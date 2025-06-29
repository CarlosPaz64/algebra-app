import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, VariableNode } from "../../types/AST";

/**
 * Si ve (num/den) = C  ⇒  num = C·den
 * También: C = (num/den) ⇒ num = C·den
 * ❗ No se aplica si la variable ya está aislada (ej: x = 4/2)
 */
export class ClearDenominatorRule implements Rule {
  name = "ClearDenominatorRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;

    const eq = ast as OperatorNode;

    // ✋ No aplicar si ya está en forma x = (a / b)
    if (
      eq.left.type === "Variable" &&
      eq.right.type === "Operator" &&
      eq.right.operator === "/" &&
      eq.right.left.type === "Literal" &&
      eq.right.right.type === "Literal"
    ) {
      return null;
    }

    const trySide = (side: "left" | "right", other: "left" | "right"): ASTNode | null => {
      const node = eq[side];
      if (node.type === "Operator" && node.operator === "/") {
        return {
          type: "Operator",
          operator: "=",
          left: node.left,
          right: {
            type: "Operator",
            operator: "*",
            left: eq[other],
            right: node.right,
          }
        };
      }
      return null;
    };

    const l = trySide("left", "right");
    if (l) return l;

    const r = trySide("right", "left");
    if (r) return r;

    return null;
  }

  description(): string {
    return "Eliminar denominador multiplicando ambos lados";
  }
}