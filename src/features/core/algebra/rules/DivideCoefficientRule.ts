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
      const a = (eq.left.left as LiteralNode).value;
      const xvar = eq.left.right as VariableNode;
      const newRight: ASTNode = {
        type: "Operator",
        operator: "/",
        left: eq.right,
        right: { type: "Literal", value: a },
      };
      return {
        type: "Operator",
        operator: "=",
        left: xvar,
        right: newRight,
      } as OperatorNode;
    }
    return null;
  }

  description(): string {
    return "Dividir coeficiente de la variable";
  }
}
