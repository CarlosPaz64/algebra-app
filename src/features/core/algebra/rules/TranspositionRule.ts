import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class TranspositionRule implements Rule {
  name = "Transposición";

  apply(ast: ASTNode): ASTNode | null {
    if (
      ast.type === "Operator" &&
      ast.operator === "=" &&
      ast.left.type === "Operator" &&
      ast.left.operator === "+"
    ) {
      const a = ast.left.left;
      const b = ast.left.right;
      const c = ast.right;

      // x + 2 = 5 → x = 5 - 2
      const transposed: ASTNode = {
        type: "Operator",
        operator: "=",
        left: a,
        right: {
          type: "Operator",
          operator: "-",
          left: c,
          right: b,
        },
      };

      return transposed;
    }

    return null;
  }

  description(): string {
    return "Se transpuso un término al otro lado del signo igual.";
  }
}