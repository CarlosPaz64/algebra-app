import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class DistributeDivisionOverAdditionRule implements Rule {
  name = "Distribuir división sobre suma";

  apply(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "/" &&
      node.left.type === "Operator" &&
      node.left.operator === "+" &&
      node.right.type === "Literal"
    ) {
      const divisor = node.right.value;
      if (divisor === 0) return null;

      return {
        type: "Operator",
        operator: "+",
        left: {
          type: "Operator",
          operator: "/",
          left: node.left.left,
          right: node.right,
        },
        right: {
          type: "Operator",
          operator: "/",
          left: node.left.right,
          right: node.right,
        },
      };
    }

    return null;
  }

  description(): string {
    return "Se distribuyó la división sobre una suma.";
  }
}
