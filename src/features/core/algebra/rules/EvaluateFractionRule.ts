import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

export class EvaluateFractionRule implements Rule {
  name = "Evaluar fracciones literales";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    const simplifySide = (node: ASTNode): ASTNode | null => {
      if (
        node.type === "Operator" &&
        node.operator === "/" &&
        node.left.type === "Literal" &&
        node.right.type === "Literal"
      ) {
        const num = (node.left as LiteralNode).value;
        const den = (node.right as LiteralNode).value;

        if (den !== 0) {
          return { type: "Literal", value: num / den };
        }
      }
      return null;
    };

    for (const side of ["left", "right"] as const) {
      const simplified = simplifySide(eq[side]);
      if (simplified) {
        return { ...eq, [side]: simplified } as OperatorNode;
      }
    }

    return null;
  }

  description(): string {
    return "Evaluar fracciones como 5 / 2 → 2.5";
  }
}
