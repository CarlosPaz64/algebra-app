import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

/**
 * Mueve constantes de un lado al otro de la igualdad:
 *   A + c = B  ⇒  A = B - c
 *   A + (–c) = B  ⇒  A = B + c
 */
export class TransposeTermRule implements Rule {
  name = "TransposeTermRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    // sólo sumas (tras normalizar restas)
    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "+" &&
      eq.left.right.type === "Literal"
    ) {
      const A = eq.left.left;
      const c = eq.left.right as LiteralNode;
      // si c < 0, restamos un negativo → sumamos
      const op = c.value < 0 ? "+" : "-";
      const absC = Math.abs(c.value);
      return {
        type: "Operator",
        operator: "=",
        left: A,
        right: {
          type: "Operator",
          operator: op,
          left: eq.right,
          right: { type: "Literal", value: absC } as LiteralNode,
        },
      } as OperatorNode;
    }
    return null;
  }

  description(ast: ASTNode): string {
    const eq = ast as OperatorNode;
    const c = (eq.left as any).right.value as number;
    const op = c < 0 ? "+" : "-";
    return `Transponer término ${op}${Math.abs(c)} al otro lado`;
  }
}
