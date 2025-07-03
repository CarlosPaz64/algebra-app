import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

/**
 * Aplica la propiedad distributiva: 
 *   a(b + c) = ab + ac
 *   a(b - c) = ab - ac
 */
export class DistributeMultiplicationOverAdditionRule implements Rule {
  name = "DistributeMultiplicationOverAdditionRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "*" &&
      eq.left.left.type === "Literal" &&
      eq.left.right.type === "Operator" &&
      (eq.left.right.operator === "+" || eq.left.right.operator === "-")
    ) {
      const a = eq.left.left as LiteralNode;
      const op = eq.left.right as OperatorNode;

      const leftDistrib: ASTNode = {
        type: "Operator",
        operator: "*",
        left: a,
        right: op.left,
      };

      const rightDistrib: ASTNode = {
        type: "Operator",
        operator: "*",
        left: a,
        right: op.right,
      };

      const distributed: ASTNode = {
        type: "Operator",
        operator: op.operator,
        left: leftDistrib,
        right: rightDistrib,
      };

      return {
        ...eq,
        left: distributed,
      };
    }

    return null;
  }

  description(): string {
    return "Distribuir multiplicación sobre suma o resta";
  }
}
