import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class CombineLikeTermsAndConstantsRule implements Rule {
  name = "Se simplificaron términos semejantes o constantes (ej. 2x + 3x → 5x, 5 + 3 → 8)";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || (ast.operator !== "+" && ast.operator !== "-")) return null;

    const flatTerms = this.flattenAdditionAndNegatives(ast);
    let constantSum = 0;
    const termMap = new Map<string, number>();
    const others: ASTNode[] = [];

    for (const node of flatTerms) {
      if (node.type === "Literal") {
        constantSum += node.value;
      } else if (
        node.type === "Operator" &&
        node.operator === "*" &&
        node.left.type === "Literal" &&
        node.right.type === "Variable"
      ) {
        const varName = node.right.name;
        const coef = node.left.value;
        termMap.set(varName, (termMap.get(varName) ?? 0) + coef);
      } else if (node.type === "Variable") {
        const varName = node.name;
        termMap.set(varName, (termMap.get(varName) ?? 0) + 1);
      } else {
        others.push(node);
      }
    }

    const simplifiedTerms: ASTNode[] = [];

    for (const [name, coef] of termMap.entries()) {
      if (coef !== 0) {
        simplifiedTerms.push({
          type: "Operator",
          operator: "*",
          left: { type: "Literal", value: coef },
          right: { type: "Variable", name },
        });
      }
    }

    if (constantSum !== 0) {
      simplifiedTerms.push({ type: "Literal", value: constantSum });
    }

    const all = [...simplifiedTerms, ...others];
    if (all.length === 0) {
      return { type: "Literal", value: 0 };
    } else if (all.length === 1) {
      return all[0];
    } else {
      const combined = all.reduce((acc, curr) => ({
        type: "Operator",
        operator: "+",
        left: acc,
        right: curr,
      }));

      return deepEquals(combined, ast) ? null : combined;
    }
  }

  private flattenAdditionAndNegatives(node: ASTNode): ASTNode[] {
    if (node.type === "Operator") {
      if (node.operator === "+") {
        return [
          ...this.flattenAdditionAndNegatives(node.left),
          ...this.flattenAdditionAndNegatives(node.right),
        ];
      } else if (node.operator === "-") {
        return [
          ...this.flattenAdditionAndNegatives(node.left),
          this.negate(node.right),
        ];
      }
    }
    return [node];
  }

  private negate(node: ASTNode): ASTNode {
    if (node.type === "Literal") {
      return { type: "Literal", value: -node.value };
    }

    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Literal"
    ) {
      return {
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value: -node.left.value },
        right: node.right,
      };
    }

    return {
      type: "Operator",
      operator: "*",
      left: { type: "Literal", value: -1 },
      right: node,
    };
  }

  description(): string {
    return this.name;
  }
}
