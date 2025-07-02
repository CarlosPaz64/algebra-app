import { Rule } from "../steps/Rule";
import { OperatorNode } from "../../types/AST";

/**
 * Multiplica ambos lados de la ecuación cuando el lado izquierdo es x / número,
 * con el objetivo de aislar la variable.
 */
export class MultiplyBothSidesRule implements Rule {
  name = "Multiplica ambos lados para eliminar división";

  description = () =>
    "Multiplica ambos lados de la ecuación para eliminar la división y aislar la variable.";

  apply(node: OperatorNode): OperatorNode | null {
    if (
      node.operator === "=" &&
      node.left.type === "Operator" &&
      node.left.operator === "/" &&
      node.left.left.type === "Variable" &&
      node.left.right.type === "Literal"
    ) {
      const denominator = node.left.right;

      return {
        type: "Operator",
        operator: "=",
        left: {
          type: "Variable",
          name: node.left.left.name,
        },
        right: {
          type: "Operator",
          operator: "*",
          left: node.right,
          right: denominator,
        },
      };
    }

    return null;
  }
}
