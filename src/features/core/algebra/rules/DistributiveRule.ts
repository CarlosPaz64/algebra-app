import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class DistributiveRule implements Rule {
  name = "Distributiva";

  apply(node: ASTNode): ASTNode | null {
    const distributed = this.distribute(node);

    // Si hubo cambio real
    if (distributed && !deepEquals(distributed, node)) {
      return distributed;
    }

    // 🔁 Recorre hijos solo si no se transformó el nodo actual
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
    // a * (b + c) → ab + ac
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.right.type === "Operator" &&
      (node.right.operator === "+" || node.right.operator === "-")
    ) {
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

    // (a + b) * c → ac + bc
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      (node.left.operator === "+" || node.left.operator === "-")
    ) {
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

  description(): string {
    return "Se aplica la propiedad distributiva: a(b + c) → ab + ac";
  }
}
