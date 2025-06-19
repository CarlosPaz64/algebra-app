import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export class FractionReductionRule implements Rule {
  name = "Reducción de fracciones";

  apply(ast: ASTNode): ASTNode | null {
    if (
      ast.type === "Operator" &&
      ast.operator === "/" &&
      ast.left.type === "Literal" &&
      ast.right.type === "Literal"
    ) {
      const a = ast.left.value;
      const b = ast.right.value;

      const divisor = gcd(a, b);
      if (divisor === 1) return null;

      return {
        type: "Operator",
        operator: "/",
        left: { type: "Literal", value: a / divisor },
        right: { type: "Literal", value: b / divisor },
      };
    }

    return null;
  }

  description(): string {
    return "Se redujo la fracción a su mínima expresión.";
  }
}