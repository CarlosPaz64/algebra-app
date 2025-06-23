import { Rule } from "../steps/Rule";
import { ASTNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class FlattenAdditionRule implements Rule {
  name = "FlattenAdditionRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "+") return null;

    const terms = this.extractTerms(node);
    const rebuilt = this.rebuild(terms);

    // ✅ Evita bucle infinito comparando estructura original vs reconstruida
    if (deepEquals(node, rebuilt)) return null;
    return rebuilt;
  }

  private extractTerms(node: ASTNode): ASTNode[] {
    if (node.type === "Operator" && node.operator === "+") {
      return [...this.extractTerms(node.left), ...this.extractTerms(node.right)];
    }
    return [node];
  }

  private rebuild(terms: ASTNode[]): ASTNode {
    if (terms.length === 0) {
      throw new Error("No se puede reconstruir una suma vacía");
    }

    return terms.slice(1).reduce((acc, curr) => {
      return {
        type: "Operator",
        operator: "+",
        left: acc,
        right: curr,
      };
    }, terms[0]);
  }

  description(): string {
    return "Se aplanaron sumas anidadas para simplificar la expresión.";
  }
}
