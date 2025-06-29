import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";
import { stringToAST } from "../parser/StringParser";

function isZeroLiteral(n: ASTNode): n is LiteralNode {
  return n.type === "Literal" && n.value === 0;
}

/**
 * Detecta ax^2 + bx + c = 0 y lo convierte en
 * x = (-b ± √(b²-4ac)) / (2a)
 */
export class QuadraticFormulaRule implements Rule {
  name = "QuadraticFormulaRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    // sólo si RHS es 0
    if (!isZeroLiteral(eq.right)) return null;

    // función auxiliar para extraer coeficientes (muy simplificada)
    const flatten = (node: ASTNode): ASTNode[] => {
      if (node.type === "Operator" && node.operator === "+")
        return [...flatten(node.left), ...flatten(node.right)];
      return [node];
    };
    const terms = flatten(eq.left);
    let a=0, b=0, c=0;
    for (const t of terms) {
      if (
        t.type === "Operator" &&
        t.operator === "*" &&
        t.left.type === "Literal" &&
        t.right.type === "Operator" &&
        t.right.operator === "^" &&
        t.right.left.type === "Variable" &&
        t.right.right.type === "Literal" &&
        (t.right.right as LiteralNode).value === 2
      ) {
        a = (t.left as LiteralNode).value;
      } else if (
        t.type === "Operator" &&
        t.operator === "*" &&
        t.left.type === "Literal" &&
        t.right.type === "Variable"
      ) {
        b = (t.left as LiteralNode).value;
      } else if (t.type === "Literal") {
        c = t.value;
      }
    }
    if (a === 0) return null;

    // construimos el paso con la fórmula
    const expr = `x = (-${b} + sqrt(${b}^2 - 4*${a}*${c}))/(2*${a})`;
    return stringToAST(expr) as OperatorNode;
  }

  description(): string {
    return "Aplicar fórmula cuadrática";
  }
}
