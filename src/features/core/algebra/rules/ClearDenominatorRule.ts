import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";

/**
 * Si ve: x = (a / b) ⇒ x * b = a
 * ❗ Solo se aplica si la variable está en el lado izquierdo.
 */
export class ClearDenominatorRule implements Rule {
  name = "ClearDenominatorRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;

    const eq = ast as OperatorNode;

    // Solo aplicar si variable está a la izquierda
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
          right: eq.right.right
        },
        right: eq.right.left
      };
    }

    return null;
  }

  description(): string {
    return "Eliminar denominador multiplicando ambos lados";
  }
}
