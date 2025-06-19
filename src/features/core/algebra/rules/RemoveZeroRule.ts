import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class RemoveZeroRule implements Rule {
  name = "Eliminación de ceros";

  apply(ast: ASTNode): ASTNode | null {
    if (
      ast.type === "Operator" &&
      ast.left.type === "Literal" &&
      ast.right.type === "Literal"
    ) {
      return null;
    }

    // x + 0 o 0 + x → x
    if (
      ast.type === "Operator" &&
      (ast.operator === "+" || ast.operator === "-") &&
      (isZero(ast.right) || isZero(ast.left))
    ) {
      return isZero(ast.right) ? ast.left : ast.right;
    }

    // x * 0 o 0 * x → 0
    if (
      ast.type === "Operator" &&
      ast.operator === "*" &&
      (isZero(ast.left) || isZero(ast.right))
    ) {
      return {
        type: "Literal",
        value: 0
      };
    }

    return null;
  }

  description(): string {
    return "Se eliminaron ceros innecesarios (ej. x + 0 → x, x * 0 → 0)";
  }
}

function isZero(node: ASTNode): boolean {
  return node.type === "Literal" && node.value === 0;
}