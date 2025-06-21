import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class SimplifyLikeTermsRule implements Rule {
  name = "Simplificación de términos semejantes";

  apply(ast: ASTNode): ASTNode | null {
    const transformed = this.simplify(ast);

    if (transformed && !deepEquals(transformed, ast)) {
      return transformed;
    }

    // Recorrer hijos si no se transformó nada
    if (ast.type === "Operator") {
      const left = this.apply(ast.left);
      const right = this.apply(ast.right);

      if (left || right) {
        return {
          ...ast,
          left: left ?? ast.left,
          right: right ?? ast.right,
        };
      }
    }

    return null;
  }

  private simplify(ast: ASTNode): ASTNode | null {
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

      return {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: coef1 + coef2 },
        right: { type: "Variable", name: variableName }
      };
    }

    return null;
  }

  description(): string {
    return "Se simplificaron términos semejantes (ej. 2x + 3x → 5x)";
  }
}
