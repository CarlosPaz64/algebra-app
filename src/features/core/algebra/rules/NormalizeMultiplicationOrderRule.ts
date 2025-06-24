import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";

export class NormalizeMultiplicationOrderRule implements Rule {
  name = "NormalizeMultiplicationOrderRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type === "Operator") {
      // Primero normaliza hijos recursivamente
      const newLeft = this.apply(node.left);
      const newRight = this.apply(node.right);

      if (node.operator === "*" &&
          node.left.type !== "Literal" &&
          node.right.type === "Literal") {
        return {
          type: "Operator",
          operator: "*",
          left: node.right,
          right: node.left
        };
      }

      if (newLeft || newRight) {
        return {
          ...node,
          left: newLeft ?? node.left,
          right: newRight ?? node.right
        };
      }
    }

    return null;
  }

  description(): string {
    return "Se ordenaron los factores colocando los números al inicio (e.g. x·2 → 2·x).";
  }
}
