import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class PowerSimplifyRule implements Rule {
  name = "PowerSimplifyRule";

  apply(node: ASTNode): ASTNode | null {
    // 🔁 x * x => x^2
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Variable" &&
      node.right.type === "Variable" &&
      node.left.name === node.right.name
    ) {
      return {
        type: "Operator",
        operator: "^",
        left: node.left,
        right: { type: "Literal", value: 2 },
      };
    }

    // 🔁 x^n * x => x^(n+1)
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      node.left.operator === "^" &&
      node.left.left.type === "Variable" &&
      node.left.right.type === "Literal" &&
      node.right.type === "Variable" &&
      node.left.left.name === node.right.name
    ) {
      return {
        type: "Operator",
        operator: "^",
        left: node.right,
        right: {
          type: "Literal",
          value: node.left.right.value + 1,
        },
      };
    }

    // 🔁 x * x^n => x^(n+1)
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.right.type === "Operator" &&
      node.right.operator === "^" &&
      node.right.left.type === "Variable" &&
      node.right.right.type === "Literal" &&
      node.left.type === "Variable" &&
      node.left.name === node.right.left.name
    ) {
      return {
        type: "Operator",
        operator: "^",
        left: node.left,
        right: {
          type: "Literal",
          value: node.right.right.value + 1,
        },
      };
    }

    // 🔁 a * x * x => a * x^2
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      node.left.operator === "*" &&
      node.left.left.type === "Literal" &&
      node.left.right.type === "Variable" &&
      node.right.type === "Variable" &&
      node.left.right.name === node.right.name
    ) {
      return {
        type: "Operator",
        operator: "*",
        left: node.left.left,
        right: {
          type: "Operator",
          operator: "^",
          left: node.right,
          right: { type: "Literal", value: 2 },
        },
      };
    }

    return null;
  }

  description(): string {
    return "Simplifica multiplicaciones de variables repetidas como potencias.";
  }
}
