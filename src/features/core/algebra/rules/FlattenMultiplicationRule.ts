import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class FlattenMultiplicationRule implements Rule {
  name = "FlattenMultiplicationRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "*") return null;

    const factors = this.extractFactors(node);
    const rebuilt = this.rebuild(factors);

    return deepEquals(rebuilt, node) ? null : rebuilt;
  }

  private extractFactors(node: ASTNode): ASTNode[] {
    if (node.type === "Operator" && node.operator === "*") {
      return [...this.extractFactors(node.left), ...this.extractFactors(node.right)];
    }
    return [node];
  }

  private rebuild(factors: ASTNode[]): ASTNode {
    return factors.reduce((acc, curr) => {
      if (!acc) return curr;
      return {
        type: "Operator",
        operator: "*",
        left: acc,
        right: curr,
      };
    }, null as any);
  }

  description(): string {
    return "Se reestructuraron multiplicaciones anidadas.";
  }
}
