import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";
import { FlattenAdditionRule } from "./FlattenAdditionRule";

export class CombineLikeExponentsRule implements Rule {
  name = "CombineLikeExponentsRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "+") return null;

    const terms = this.flattenSum(node);
    const combined: ASTNode[] = [];
    const used = new Array(terms.length).fill(false);

    for (let i = 0; i < terms.length; i++) {
      if (used[i]) continue;
      const a = terms[i];
      let coefA = this.extractCoefficient(a);
      const structureA = this.extractVariableStructure(a);

      for (let j = i + 1; j < terms.length; j++) {
        if (used[j]) continue;
        const b = terms[j];
        const structureB = this.extractVariableStructure(b);

        if (deepEquals(structureA, structureB)) {
          const coefB = this.extractCoefficient(b);
          coefA += coefB;
          used[j] = true;
        }
      }

      used[i] = true;
      if (coefA === 0) continue;

      const newTerm = coefA === 1
        ? structureA
        : {
            type: "Operator" as const,
            operator: "*" as const,
            left: { type: "Literal" as const, value: coefA },
            right: structureA,
          };

      combined.push(newTerm);
    }

    const rebuilt = this.rebuildSum(combined);

    // ✅ Anti-loop: Compara versiones aplanadas
    const flattener = new FlattenAdditionRule();
    const flatOriginal = flattener.apply(node) ?? node;
    const flatRebuilt = flattener.apply(rebuilt) ?? rebuilt;

    if (deepEquals(flatOriginal, flatRebuilt)) return null;

    return flatRebuilt;
  }

  private flattenSum(node: ASTNode): ASTNode[] {
    if (node.type === "Operator" && node.operator === "+") {
      return [...this.flattenSum(node.left), ...this.flattenSum(node.right)];
    }
    return [node];
  }

  private extractCoefficient(node: ASTNode): number {
    if (node.type === "Literal") return node.value;
    if (node.type === "Operator" && node.operator === "*") {
      if (node.left.type === "Literal") return node.left.value;
    }
    return 1;
  }

  private extractVariableStructure(node: ASTNode): ASTNode {
    if (node.type === "Operator" && node.operator === "*") {
      if (node.left.type === "Literal") return node.right;
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
    }, null as any);
  }

  description(): string {
    return "Se combinaron términos semejantes con la misma variable y exponente.";
  }
}
