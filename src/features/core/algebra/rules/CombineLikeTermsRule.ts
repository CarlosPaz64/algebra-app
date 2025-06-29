import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode, VariableNode } from "../../types/AST";

/**
 * Combina términos semejantes de la forma:
 *   a·x + b·x  ⇒  (a + b)·x
 */
export class CombineLikeTermsRule implements Rule {
  name = "CombineLikeTermsRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
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

        const isMatching = (
          a: OperatorNode,
          b: OperatorNode
        ) =>
          a.operator === "*" &&
          b.operator === "*" &&
          a.left.type === "Literal" &&
          b.left.type === "Literal" &&
          a.right.type === "Variable" &&
          b.right.type === "Variable" &&
          a.right.name === b.right.name;

        if (isMatching(L, R)) {
          const sum =
            (L.left as LiteralNode).value + (R.left as LiteralNode).value;

          const newTerm: ASTNode = {
            type: "Operator",
            operator: "*",
            left: { type: "Literal", value: sum },
            right: L.right,
          };

          return {
            ...eq,
            [side]: newTerm,
          } as OperatorNode;
        }
      }
    }

    return null;
  }

  description(): string {
    return "Combinar términos semejantes";
  }
}