import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";

/**
 * Transforma: (A + b) = C  ⇒  A = C - b
 * Solo si A contiene la variable y b no.
 */
export class IsolateVariableOnLeftRule implements Rule {
  name = "IsolateVariableOnLeftRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "+" &&
      eq.left.left.type === "Operator" &&
      eq.left.right.type === "Literal"
    ) {
      // A + b = C  →  A = C - b
      return {
        type: "Operator",
        operator: "=",
        left: eq.left.left,
        right: {
          type: "Operator",
          operator: "-",
          left: eq.right,
          right: eq.left.right,
        }
      };
    }

    return null;
  }

  description(): string {
    return "Mover constantes al otro lado restando";
  }
}
