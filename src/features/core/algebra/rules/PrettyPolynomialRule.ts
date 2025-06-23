import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class PrettyPolynomialRule implements Rule {
  name = "PrettyPolynomialRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type === "Operator") {
      // 🔁 Simplifica x * x => x^2
      if (
        node.operator === "*" &&
        node.left.type === "Variable" &&
        node.right.type === "Variable" &&
        node.left.name === node.right.name
      ) {
        return {
          type: "Operator",
          operator: "^",
          left: { type: "Variable", name: node.left.name },
          right: { type: "Literal", value: 2 },
        };
      }

      // 🔁 Simplifica x^n * x^m => x^(n + m)
      if (
        node.operator === "*" &&
        node.left.type === "Operator" &&
        node.left.operator === "^" &&
        node.right.type === "Operator" &&
        node.right.operator === "^" &&
        node.left.left.type === "Variable" &&
        node.right.left.type === "Variable" &&
        node.left.left.name === node.right.left.name &&
        node.left.right.type === "Literal" &&
        node.right.right.type === "Literal"
      ) {
        return {
          type: "Operator",
          operator: "^",
          left: node.left.left,
          right: {
            type: "Literal",
            value: node.left.right.value + node.right.right.value,
          },
        };
      }

      // 🔁 Simplifica x * x^n => x^(n + 1)
      if (
        node.operator === "*" &&
        node.left.type === "Variable" &&
        node.right.type === "Operator" &&
        node.right.operator === "^" &&
        node.right.left.type === "Variable" &&
        node.left.name === node.right.left.name &&
        node.right.right.type === "Literal"
      ) {
        return {
          type: "Operator",
          operator: "^",
          left: node.left,
          right: {
            type: "Literal",
            value: node.right.right.value + 1,
          },
        };
      }

      // 🔁 Simplifica x^n * x => x^(n + 1)
      if (
        node.operator === "*" &&
        node.right.type === "Variable" &&
        node.left.type === "Operator" &&
        node.left.operator === "^" &&
        node.left.left.type === "Variable" &&
        node.left.left.name === node.right.name &&
        node.left.right.type === "Literal"
      ) {
        return {
          type: "Operator",
          operator: "^",
          left: node.right,
          right: {
            type: "Literal",
            value: node.left.right.value + 1,
          },
        };
      }

      // 📦 Aplicar recursivamente en hijos
      const newLeft = this.apply(node.left);
      if (newLeft) {
        return { ...node, left: newLeft };
      }

      const newRight = this.apply(node.right);
      if (newRight) {
        return { ...node, right: newRight };
      }

      // 📦 Reordenar términos si es suma
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
        const isSame =
          originalTerms.length === sorted.length &&
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
