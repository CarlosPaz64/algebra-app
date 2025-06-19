import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class DistributiveRule implements Rule {
  name = "Distributiva";

  apply(ast: ASTNode): ASTNode | null {
    // Detectar patrón: A * (B + C)
    if (
      ast.type === "Operator" &&
      ast.operator === "*" &&
      ast.right.type === "Operator" &&
      ast.right.operator === "+"
    ) {
      const A = ast.left;
      const B = ast.right.left;
      const C = ast.right.right;

      // Retornar A·B + A·C
      const distributed: ASTNode = {
        type: "Operator",
        operator: "+",
        left: {
          type: "Operator",
          operator: "*",
          left: A,
          right: B,
        },
        right: {
          type: "Operator",
          operator: "*",
          left: A,
          right: C,
        },
      };

      return distributed;
    }

    return null;
  }

  description(): string {
    return "Se aplicó la propiedad distributiva: A·(B + C) → A·B + A·C";
  }
}