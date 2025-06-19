import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";

export class PowerToProductRule implements Rule {
  name = "Potencia a producto";

  apply(ast: ASTNode): ASTNode | null {
    if (
      ast.type === "Operator" &&
      ast.operator === "^" &&
      ast.right.type === "Literal" &&
      Number.isInteger(ast.right.value) &&
      ast.right.value > 1
    ) {
      const base = ast.left;
      const exponent = ast.right.value;

      // Construir AST recursivamente: x * x * x ...
      let product: ASTNode = base;
      for (let i = 1; i < exponent; i++) {
        product = {
          type: "Operator",
          operator: "*",
          left: product,
          right: base,
        };
      }

      return product;
    }

    return null;
  }

  description(): string {
    return "Se expandió la potencia como multiplicación repetida (ej. x² → x·x)";
  }
}