import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode, VariableNode } from "../../types/AST";

/**
 * Combina múltiples términos semejantes en una suma:
 *   2x + 3y + 4x ⇒ 6x + 3y
 */
export class CombineLikeTermsRule implements Rule {
  name = "CombineLikeTermsRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    let changed = false;

    for (const side of ["left", "right"] as const) {
      const node = eq[side];

      // Extraer todos los términos de una suma plana (a + b + c + ...)
      const terms = this.flattenAddition(node);

      const grouped: Record<string, number> = {}; // { x: coeficiente, y: coeficiente }

      const others: ASTNode[] = [];

      for (const term of terms) {
        if (
          term.type === "Operator" &&
          term.operator === "*" &&
          term.left.type === "Literal" &&
          term.right.type === "Variable"
        ) {
          const variableName = term.right.name;
          grouped[variableName] = (grouped[variableName] || 0) + term.left.value;
          changed = true;
        } else {
          others.push(term);
        }
      }

      // Reconstruir los nuevos términos combinados
      const combinedTerms: ASTNode[] = Object.entries(grouped).map(([name, value]) => ({
        type: "Operator",
        operator: "*",
        left: { type: "Literal", value },
        right: { type: "Variable", name }
      }));

      const newTerms = [...combinedTerms, ...others];

      if (changed && newTerms.length > 0) {
        const newExpr = this.buildAddition(newTerms);
        return {
          ...eq,
          [side]: newExpr
        };
      }
    }

    return null;
  }

  description(): string {
    return "Combinar múltiples términos semejantes del mismo lado de la ecuación";
  }

  private flattenAddition(node: ASTNode): ASTNode[] {
    // Convierte una suma anidada en una lista plana
    if (node.type === "Operator" && node.operator === "+") {
      return [...this.flattenAddition(node.left), ...this.flattenAddition(node.right)];
    }
    return [node];
  }

  private buildAddition(terms: ASTNode[]): ASTNode {
    // Reconstruye a + b + c de una lista [a, b, c]
    return terms.reduce((acc, term) => {
      if (!acc) return term;
      return {
        type: "Operator",
        operator: "+",
        left: acc,
        right: term
      };
    }, null as any);
  }
}
