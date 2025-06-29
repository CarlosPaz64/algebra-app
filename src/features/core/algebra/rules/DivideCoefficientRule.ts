import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode, VariableNode } from "../../types/AST";

/**
 * Si A·x = C  ⇒  x = C / A
 */
export class DivideCoefficientRule implements Rule {
  name = "DivideCoefficientRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "*" &&
      eq.left.left.type === "Literal" &&
      eq.left.right.type === "Variable"
    ) {
      const a = eq.left.left.value;
      const x = eq.left.right;

      const newRight: ASTNode = {
        type: "Operator",
        operator: "/",
        left: eq.right,
        right: { type: "Literal", value: a },
      };

      return {
        type: "Operator",
        operator: "=",
        left: x,
        right: newRight,
      };
    }

    return null;
  }

  description(): string {
    return "Dividir coeficiente de la variable";
  }
}