import { ASTNode, LiteralNode, OperatorNode } from "../../types/AST";
import { Rule } from "../steps/Rule";
import { deepEquals } from "./DeepEquals";

export class CombineLikeTermsRule implements Rule {
  name = "CombineLikeTermsRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type === "Operator") {
      const newLeft = this.apply(node.left);
      const newRight = this.apply(node.right);

      const updatedNode: OperatorNode = {
        ...node,
        left: newLeft ?? node.left,
        right: newRight ?? node.right,
      };

      const combined = this.combine(updatedNode);
      if (combined && !deepEquals(combined, node)) {
        return combined;
      }

      if (!deepEquals(updatedNode, node)) {
        return updatedNode;
      }
    }

    return null;
  }

  private combine(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "+") return null;

    const terms = this.flatten(node);
    const combined: ASTNode[] = [];
    const used = new Array(terms.length).fill(false);

    for (let i = 0; i < terms.length; i++) {
      if (used[i]) continue;

      const structure = this.extractVariableStructure(terms[i]);

      // ❌ No combinar si es un literal suelto
      if (structure.type === "Literal") {
        combined.push(terms[i]);
        used[i] = true;
        continue;
      }

      let coef = this.extractCoefficient(terms[i]);
      used[i] = true;

      for (let j = i + 1; j < terms.length; j++) {
        if (used[j]) continue;

        const otherStructure = this.extractVariableStructure(terms[j]);
        if (deepEquals(structure, otherStructure)) {
          coef += this.extractCoefficient(terms[j]);
          used[j] = true;
        }
      }

      if (coef === 0) continue;

      const newTerm = coef === 1
        ? structure
        : {
          type: "Operator" as const,
          operator: "*" as const,
          left: {
            type: "Literal",
            value: coef,
          } as LiteralNode,
          right: structure,
        };

      combined.push(newTerm);
    }

    // Si no hubo cambios reales, no se aplica
    if (
      combined.length === terms.length &&
      combined.every((t, i) => deepEquals(t, terms[i]))
    ) {
      return null;
    }

    return this.rebuildSum(combined);
  }

  private flatten(node: ASTNode): ASTNode[] {
    if (node.type === "Operator") {
      if (node.operator === "+") {
        return [...this.flatten(node.left), ...this.flatten(node.right)];
      }

      if (node.operator === "-") {
        return [
          ...this.flatten(node.left),
          {
            type: "Operator",
            operator: "*",
            left: { type: "Literal", value: -1 },
            right: node.right,
          },
        ];
      }
    }

    return [node];
  }


  private extractCoefficient(node: ASTNode): number {
    if (node.type === "Literal") return node.value;

    if (node.type === "Operator" && node.operator === "*") {
      if (node.left.type === "Literal") return node.left.value;
      if (node.right.type === "Literal") return node.right.value;
    }

    return 1;
  }

  private extractVariableStructure(node: ASTNode): ASTNode {
    if (node.type === "Operator" && node.operator === "*") {
      if (node.left.type === "Literal") return node.right;
      if (node.right.type === "Literal") return node.left;
    }
    return node;
  }

  private rebuildSum(terms: ASTNode[]): ASTNode {
    return terms.reduce((acc, curr) => {
      if (!acc) return curr;
      return {
        type: "Operator" as const,
        operator: "+" as const,
        left: acc,
        right: curr,
      };
    }, null as unknown as ASTNode);
  }

  description(): string {
    return "Se combinan los términos semejantes.";
  }
}
