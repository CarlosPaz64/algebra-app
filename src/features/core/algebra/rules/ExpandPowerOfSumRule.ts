import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class ExpandPowerOfSumRule implements Rule {
  name = "ExpandPowerOfSumRule";

  apply(node: ASTNode): ASTNode | null {
    // 🔁 Aplica recursivamente a hijos primero
    if (node.type === "Operator") {
      const newLeft = this.apply(node.left) ?? node.left;
      const newRight = this.apply(node.right) ?? node.right;

      const updatedNode: OperatorNode = {
        ...node,
        left: newLeft,
        right: newRight,
      };

      // Intenta expandir el nodo actual
      const expanded = this.expand(updatedNode);
      if (expanded && !deepEquals(expanded, updatedNode)) {
        console.log("✅ ExpandPowerOfSumRule aplicada a:", JSON.stringify(updatedNode, null, 2));
        return expanded;
      }

      // Si hubo cambios en hijos, actualiza el nodo
      if (!deepEquals(updatedNode, node)) {
        return updatedNode;
      }
    }

    return null;
  }

  private expand(node: ASTNode): ASTNode | null {
    if (!this.isPowerOfSum(node)) return null;

    const base = node.left!.type === "Grouping"
      ? node.left.expression
      : node.left!;

    const a = (base as OperatorNode).left;
    const b = (base as OperatorNode).right;

    const aSquared: OperatorNode = {
      type: "Operator",
      operator: "^",
      left: a,
      right: { type: "Literal", value: 2 }
    };

    const bSquared: OperatorNode = {
      type: "Operator",
      operator: "^",
      left: b,
      right: { type: "Literal", value: 2 }
    };

    const twoAB: OperatorNode = {
      type: "Operator",
      operator: "*",
      left: { type: "Literal", value: 2 },
      right: {
        type: "Operator",
        operator: "*",
        left: a,
        right: b
      }
    };

    return {
      type: "Operator",
      operator: "+",
      left: {
        type: "Operator",
        operator: "+",
        left: aSquared,
        right: twoAB
      },
      right: bSquared
    };
  }

  description(): string {
    return "Se aplica la identidad (a + b)^2 = a^2 + 2ab + b^2";
  }

  private isPowerOfSum(node: ASTNode): node is OperatorNode {
    if (
      node.type === "Operator" &&
      node.operator === "^" &&
      node.right.type === "Literal" &&
      node.right.value === 2 &&
      node.left
    ) {
      const base =
        node.left.type === "Grouping"
          ? node.left.expression
          : node.left;

      return (
        base.type === "Operator" &&
        base.operator === "+"
      );
    }

    return false;
  }
}
