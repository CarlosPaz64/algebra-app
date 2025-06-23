import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class PolynomialBeautifyRule implements Rule {
  name = "PolynomialBeautifyRule";

  apply(node: ASTNode): ASTNode | null {
    const simplified = this.simplify(node);
    return deepEquals(node, simplified) ? null : simplified;
  }

  private simplify(node: ASTNode): ASTNode {
    if (node.type === "Operator") {
      const left = this.simplify(node.left);
      const right = this.simplify(node.right);

      // x^1 → x
      if (node.operator === "^" && right.type === "Literal" && right.value === 1) {
        return left;
      }

      // 1 · x → x o x · 1 → x
      if (node.operator === "*" && left.type === "Literal" && left.value === 1) {
        return right;
      }
      if (node.operator === "*" && right.type === "Literal" && right.value === 1) {
        return left;
      }

      return {
        ...node,
        left,
        right,
      };
    }

    // Otros nodos se devuelven tal cual
    return node;
  }

  description(): string {
    return "Se limpiaron exponentes iguales a 1 y multiplicaciones por 1 para una presentación más clara.";
  }
}
