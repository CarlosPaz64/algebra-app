import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class PrettyPolynomialRule implements Rule {
  name = "PrettyPolynomialRule";

apply(node: ASTNode): ASTNode | null {
  if (node.type === "Operator") {
    const newLeft = this.apply(node.left);
    if (newLeft) {
      return {
        ...node,
        left: newLeft,
      };
    }

    const newRight = this.apply(node.right);
    if (newRight) {
      return {
        ...node,
        right: newRight,
      };
    }

    if (node.operator === "+") {
      const terms = this.flatten(node);

      const sortKey = (n: ASTNode): number => {
        if (
          n.type === "Operator" &&
          n.operator === "*" &&
          n.right.type === "Operator" &&
          n.right.operator === "^"
        ) {
          const power = n.right.right;
          if (power.type === "Literal") return -power.value;
        }
        if (
          n.type === "Operator" &&
          n.operator === "^" &&
          n.right.type === "Literal"
        ) {
          return -n.right.value;
        }
        if (n.type === "Operator" && n.operator === "*") {
          if (n.right.type === "Variable") return -1;
        }
        if (n.type === "Variable") return -1;
        if (n.type === "Literal") return 0;
        return 1;
      };

      const sorted = [...terms].sort((a, b) => {
        const diff = sortKey(a) - sortKey(b);
        return diff !== 0
          ? diff
          : JSON.stringify(a).localeCompare(JSON.stringify(b));
      });

      const originalTerms = this.flatten(node);
      const isSame = originalTerms.length === sorted.length &&
        originalTerms.every((t, i) => deepEquals(t, sorted[i]));

      if (isSame) return null;

      return this.rebuild(sorted);
    }
  }

  return null;
}


  private flatten(node: ASTNode): ASTNode[] {
    if (node.type === "Operator" && node.operator === "+") {
      return [...this.flatten(node.left), ...this.flatten(node.right)];
    }
    return [node];
  }

  private rebuild(terms: ASTNode[]): ASTNode {
    return terms.reduce((acc, curr) => {
      if (!acc) return curr;
      return {
        type: "Operator",
        operator: "+",
        left: acc,
        right: curr,
      };
    }, null as any);
  }

  description(): string {
    return "Se ordenaron los términos del polinomio y se aplanó la expresión final.";
  }
}
