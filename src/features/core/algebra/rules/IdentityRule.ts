import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class IdentityRule implements Rule {
  name = "Identidad algebraica";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;

    // x * 1 o 1 * x → x
    if (
      ast.operator === "*" &&
      (isOne(ast.left) || isOne(ast.right))
    ) {
      return isOne(ast.left) ? ast.right : ast.left;
    }

    // x / 1 → x
    if (ast.operator === "/" && isOne(ast.right)) {
      return ast.left;
    }

    return null;
  }

  description(): string {
    return "Se aplicó la identidad: x * 1 → x o x / 1 → x";
  }
}

function isOne(node: ASTNode): boolean {
  return node.type === "Literal" && node.value === 1;
}