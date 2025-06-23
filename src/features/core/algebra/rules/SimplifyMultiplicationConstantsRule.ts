import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class SimplifyMultiplicationConstantsRule implements Rule {
  name = "SimplifyMultiplicationConstantsRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "*") return null;

    const factors = this.extractFactors(node);

    let product = 1;
    const others: ASTNode[] = [];

    for (const f of factors) {
      if (f.type === "Literal") {
        product *= f.value;
      } else {
        others.push(f);
      }
    }

    const rebuilt: ASTNode[] = product !== 1 ? [{ type: "Literal", value: product }, ...others] : others;

    const rebuiltNode = this.rebuild(rebuilt);
    return deepEquals(rebuiltNode, node) ? null : rebuiltNode;
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
    return "Se evaluaron multiplicaciones constantes anidadas.";
  }
}
