import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";
import { stringToAST } from "../parser/StringParser";

function isZeroLiteral(n: ASTNode): n is LiteralNode {
  return n.type === "Literal" && n.value === 0;
}

// 🔧 Extrae todos los términos de una suma/resta como lista lineal (mejorada)
function extractTermsFromSum(node: ASTNode): ASTNode[] {
  if (node.type === "Operator") {
    if (node.operator === "+") {
      return [
        ...extractTermsFromSum(node.left),
        ...extractTermsFromSum(node.right),
      ];
    } else if (node.operator === "-") {
      return [
        ...extractTermsFromSum(node.left),
        {
          type: "Operator",
          operator: "*",
          left: { type: "Literal", value: -1 },
          right: node.right,
        } as OperatorNode,
      ];
    }
  }
  return [node];
}

/**
 * Detecta ecuaciones cuadráticas de la forma ax^2 + bx + c = 0
 * y aplica la fórmula general: x = (-b ± sqrt(b² - 4ac)) / (2a)
 */
export class QuadraticFormulaRule implements Rule {
  name = "QuadraticFormulaRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    if (!isZeroLiteral(eq.right)) return null;

    const terms = extractTermsFromSum(eq.left);
    let a = 0, b = 0, c = 0;

    for (const t of terms) {
      // Detecta x^2
      if (
        t.type === "Operator" &&
        t.operator === "^" &&
        t.left.type === "Variable" &&
        t.right.type === "Literal" &&
        t.right.value === 2
      ) {
        a = 1;
      }

      // Detecta ax^2
      else if (
        t.type === "Operator" &&
        t.operator === "*" &&
        t.right.type === "Operator" &&
        t.right.operator === "^" &&
        t.right.left.type === "Variable" &&
        t.right.right.type === "Literal" &&
        t.right.right.value === 2 &&
        t.left.type === "Literal"
      ) {
        a = t.left.value;
      }

      // Detecta bx
      else if (
        t.type === "Operator" &&
        t.operator === "*" &&
        t.left.type === "Literal" &&
        t.right.type === "Variable"
      ) {
        b += t.left.value;
      }

      // Detecta -bx
      else if (
        t.type === "Operator" &&
        t.operator === "*" &&
        t.left.type === "Literal" &&
        t.left.value === -1 &&
        t.right.type === "Operator" &&
        t.right.operator === "*" &&
        t.right.left.type === "Literal" &&
        t.right.right.type === "Variable"
      ) {
        b += -1 * t.right.left.value;
      }

      // Detecta constante c
      else if (t.type === "Literal") {
        c += t.value;
      }
    }

    if (a === 0) return null;

    console.log("🧮 Coeficientes detectados:\na =", a, "b =", b, "c =", c);

    const expr = `x = (${b * -1} ± sqrt(${b}^2 - 4*${a}*${c})) / (2*${a})`;
    return stringToAST(expr) as OperatorNode;
  }

  description(): string {
    return "Aplicar fórmula general cuadrática";
  }
}
