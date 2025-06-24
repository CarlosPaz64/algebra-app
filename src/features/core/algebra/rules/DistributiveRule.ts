import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class DistributiveRule implements Rule {
  name = "Distributiva";

  apply(node: ASTNode): ASTNode | null {
    const distributed = this.distribute(node);

    if (distributed && !deepEquals(distributed, node)) {
      return distributed;
    }

    // Recorre hijos si no se transformó este nodo
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

  private distribute(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.right.type === "Operator" &&
      (node.right.operator === "+" || node.right.operator === "-")
    ) {
      // Previene re-aplicación sobre nodos ya distribuidos
      if (this.isDistributed(node.left, node.right)) return null;

      return {
        type: "Operator",
        operator: node.right.operator,
        left: {
          type: "Operator",
          operator: "*",
          left: node.left,
          right: node.right.left,
        },
        right: {
          type: "Operator",
          operator: "*",
          left: node.left,
          right: node.right.right,
        },
      };
    }

    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      (node.left.operator === "+" || node.left.operator === "-")
    ) {
      if (this.isDistributed(node.right, node.left)) return null;

      return {
        type: "Operator",
        operator: node.left.operator,
        left: {
          type: "Operator",
          operator: "*",
          left: node.left.left,
          right: node.right,
        },
        right: {
          type: "Operator",
          operator: "*",
          left: node.left.right,
          right: node.right,
        },
      };
    }

    return null;
  }

  private isDistributed(factor: ASTNode, sumNode: ASTNode): boolean {
    return (
      sumNode.type === "Operator" &&
      (sumNode.left.type === "Operator" &&
        sumNode.left.operator === "*" &&
        deepEquals(sumNode.left.left, factor)) &&
      (sumNode.right.type === "Operator" &&
        sumNode.right.operator === "*" &&
        deepEquals(sumNode.right.left, factor))
    );
  }

  description(): string {
    return "Se aplica la propiedad distributiva: a(b + c) → ab + ac";
  }
}
