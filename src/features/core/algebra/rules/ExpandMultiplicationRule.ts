import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { recursivelyApplyRule } from "./RecursivelyApplyRule";
import { deepEquals } from "./DeepEquals";

export class ExpandMultiplicationRule implements Rule {
  name = "ExpandMultiplicationRule";

apply(node: ASTNode): ASTNode | null {
  // 🔁 Aplica primero a los hijos
  if (node.type === "Operator") {
    const newLeft = this.apply(node.left) ?? node.left;
    const newRight = this.apply(node.right) ?? node.right;

    const updatedNode: ASTNode = {
      ...node,
      left: newLeft,
      right: newRight,
    };

    // 🧠 Intenta expandir el nodo actual ya actualizado
    const expanded = this.expand(updatedNode);
    if (expanded && !deepEquals(expanded, updatedNode)) {
      console.log("✅ ExpandMultiplicationRule aplicada a:", JSON.stringify(updatedNode, null, 2));
      return expanded;
    }

    // Si hubo cambios en hijos, actualiza el nodo aunque no se haya expandido
    if (!deepEquals(updatedNode, node)) {
      return updatedNode;
    }
  }

  return null;
}





  private expand(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      (node.left.operator === "+" || node.left.operator === "-") &&
      node.right.type === "Operator" &&
      (node.right.operator === "+" || node.right.operator === "-")
    ) {
      // (a + b)(c + d) → ac + ad + bc + bd
      const a = node.left.left;
      const b = node.left.right;
      const c = node.right.left;
      const d = node.right.right;

      return {
        type: "Operator",
        operator: "+",
        left: {
          type: "Operator",
          operator: "+",
          left: {
            type: "Operator",
            operator: "*",
            left: a,
            right: c,
          },
          right: {
            type: "Operator",
            operator: "*",
            left: a,
            right: d,
          },
        },
        right: {
          type: "Operator",
          operator: "+",
          left: {
            type: "Operator",
            operator: "*",
            left: b,
            right: c,
          },
          right: {
            type: "Operator",
            operator: "*",
            left: b,
            right: d,
          },
        },
      };
    }

    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      (node.left.operator === "+" || node.left.operator === "-")
    ) {
      // (a + b) * c → a*c + b*c
      const a = node.left.left;
      const b = node.left.right;
      const c = node.right;

      return {
        type: "Operator",
        operator: "+",
        left: {
          type: "Operator",
          operator: "*",
          left: a,
          right: c,
        },
        right: {
          type: "Operator",
          operator: "*",
          left: b,
          right: c,
        },
      };
    }

    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.right.type === "Operator" &&
      (node.right.operator === "+" || node.right.operator === "-")
    ) {
      // a * (b + c) → a*b + a*c
      const a = node.left;
      const b = node.right.left;
      const c = node.right.right;

      return {
        type: "Operator",
        operator: "+",
        left: {
          type: "Operator",
          operator: "*",
          left: a,
          right: b,
        },
        right: {
          type: "Operator",
          operator: "*",
          left: a,
          right: c,
        },
      };
    }

    return null;
  }

  description(): string {
    return "Se aplica la propiedad distributiva: (a + b)(c + d) → ac + ad + bc + bd";
  }
}