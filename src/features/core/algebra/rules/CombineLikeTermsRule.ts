import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode, VariableNode } from "../../types/AST";

/**
 * Combina términos semejantes de la forma:
 *   a·x + b·x  ⇒  (a + b)·x
 */
export class CombineLikeTermsRule implements Rule {
  name = "CombineLikeTermsRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;
    const eq = ast as OperatorNode;

    for (const side of ["left", "right"] as const) {
      const node = eq[side];
      if (
        node.type === "Operator" &&
        node.operator === "+" &&
        node.left.type === "Operator" &&
        node.right.type === "Operator"
      ) {
        const L = node.left as OperatorNode;
        const R = node.right as OperatorNode;
        if (
          L.operator === "*" &&
          R.operator === "*" &&
          L.left.type === "Literal" &&
          R.left.type === "Literal" &&
          L.right.type === "Variable" &&
          R.right.type === "Variable" &&
          (L.right as VariableNode).name === (R.right as VariableNode).name
        ) {
          const sum = (L.left as LiteralNode).value + (R.left as LiteralNode).value;
          const newNode: ASTNode = {
            type: "Operator",
            operator: "*",
            left: { type: "Literal", value: sum },
            right: L.right,
          };
          return { ...eq, [side]: newNode } as OperatorNode;
        }
      }
    }
    return null;
  }

  description(): string {
    return "Combinar términos semejantes";
  }
}
