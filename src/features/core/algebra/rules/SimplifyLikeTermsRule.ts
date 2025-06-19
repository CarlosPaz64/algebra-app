import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class SimplifyLikeTermsRule implements Rule {
  name = "Simplificación de términos semejantes";

  apply(ast: ASTNode): ASTNode | null {
    // Detecta patrón: (coef1 * x) + (coef2 * x)
    if (
      ast.type === "Operator" &&
      ast.operator === "+" &&
      ast.left.type === "Operator" &&
      ast.left.operator === "*" &&
      ast.left.left.type === "Literal" &&
      ast.left.right.type === "Variable" &&
      ast.right.type === "Operator" &&
      ast.right.operator === "*" &&
      ast.right.left.type === "Literal" &&
      ast.right.right.type === "Variable" &&
      ast.left.right.name === ast.right.right.name
    ) {
      const coef1 = ast.left.left.value;
      const coef2 = ast.right.left.value;
      const variableName = ast.left.right.name;

      const simplified: ASTNode = {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: coef1 + coef2 },
        right: { type: "Variable", name: variableName }
      };

      return simplified;
    }

    return null;
  }

  description(): string {
    return "Se simplificaron términos semejantes (ej. 2x + 3x → 5x)";
  }
}