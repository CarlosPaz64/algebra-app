import { ASTNode, OperatorNode } from "../../types/AST";
import { Rule } from "../steps/Rule";
import { deepEquals } from "./DeepEquals";

export class CombineLikeTermsRule implements Rule {
  name = "CombineLikeTermsRule";

  apply(node: ASTNode): ASTNode | null {
    const result = this.combine(node);

    // Solo devolvemos si hay un cambio real
    if (result && !deepEquals(result, node)) {
      return result;
    }

    // Recursión defensiva
    if (node.type === "Operator") {
      const newLeft = this.apply(node.left);
      const newRight = this.apply(node.right);

      if (newLeft || newRight) {
        return {
          ...node,
          left: newLeft ?? node.left,
          right: newRight ?? node.right,
        };
      }
    }

    return null;
  }

  private combine(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "+" &&
      node.left.type === "Operator" &&
      node.left.operator === "*" &&
      node.right.type === "Operator" &&
      node.right.operator === "*"
    ) {
      const left = node.left;
      const right = node.right;

      if (
        left.right.type === "Variable" &&
        right.right.type === "Variable" &&
        left.right.name === right.right.name &&
        left.left.type === "Literal" &&
        right.left.type === "Literal"
      ) {
        return {
          type: "Operator",
          operator: "*",
          left: {
            type: "Literal",
            value: left.left.value + right.left.value,
          },
          right: left.right,
        };
      }
    }

    return null;
  }

  description(): string {
    return "Se combinan los términos semejantes.";
  }
}
