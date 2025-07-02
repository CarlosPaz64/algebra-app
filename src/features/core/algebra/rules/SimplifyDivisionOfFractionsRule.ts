import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, GroupingNode, LiteralNode } from "../../types/AST";

export class SimplifyDivisionOfFractionsRule implements Rule {
  name = "Simplificar divisiones de fracciones";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    const tryTransform = (node: ASTNode): ASTNode | null => {
      if (
        node.type === "Operator" &&
        node.operator === "/" &&
        node.right.type === "Grouping"
      ) {
        const inner = node.right.expression;
        if (
          inner.type === "Operator" &&
          inner.operator === "/" &&
          inner.left.type === "Literal" &&
          inner.right.type === "Literal"
        ) {
          const numerator = node.left;
          const inverse = {
            type: "Operator",
            operator: "/",
            left: { ...inner.right },
            right: { ...inner.left },
          } as OperatorNode;

          return {
            type: "Operator",
            operator: "*",
            left: numerator,
            right: inverse,
          } as OperatorNode;
        }
      }
      return null;
    };

    for (const side of ["left", "right"] as const) {
      const updated = tryTransform(eq[side]);
      if (updated) {
        return {
          ...eq,
          [side]: updated,
        } as OperatorNode;
      }
    }

    return null;
  }

  description(): string {
    return "Simplificar divisiones anidadas como 10 / (5 / 2)";
  }
}
