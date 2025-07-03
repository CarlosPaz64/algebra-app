import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";

/**
 * Si ve una fracción con denominador literal, multiplica ambos lados para eliminarla:
 * - Caso A: x = (a / b)    ⇒    x * b = a
 * - Caso B: (A) / b = C    ⇒    A = C * b
 */
export class ClearDenominatorRule implements Rule {
  name = "ClearDenominatorRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;

    const eq = ast as OperatorNode;

    // ✅ CASO A: x = a / b ⇒ x * b = a
    if (
      eq.left.type === "Variable" &&
      eq.right.type === "Operator" &&
      eq.right.operator === "/" &&
      eq.right.left.type === "Literal" &&
      eq.right.right.type === "Literal"
    ) {
      return {
        type: "Operator",
        operator: "=",
        left: {
          type: "Operator",
          operator: "*",
          left: eq.left,
          right: eq.right.right,
        },
        right: eq.right.left,
      };
    }

    // ✅ CASO B: (A) / b = C ⇒ A = C * b
    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "/" &&
      eq.left.right.type === "Literal"
    ) {
      return {
        type: "Operator",
        operator: "=",
        left: eq.left.left,
        right: {
          type: "Operator",
          operator: "*",
          left: eq.right,
          right: eq.left.right,
        },
      };
    }

    return null;
  }

  description(): string {
    return "Eliminar denominador multiplicando ambos lados";
  }
}
