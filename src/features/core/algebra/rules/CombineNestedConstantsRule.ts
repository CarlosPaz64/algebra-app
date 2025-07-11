import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

/**
 * Combina constantes dentro de una estructura tipo:
 *  (a - b) + c  →  a + (c - b)
 *  c + (a - b)  →  a + (c - b)
 */
export class CombineNestedConstantsRule implements Rule {
  name = "CombineNestedConstantsRule";

  apply(ast: ASTNode): ASTNode | null {
    if (
      ast.type === "Operator" &&
      ast.operator === "=" &&
      ast.left.type === "Operator" &&
      ast.left.operator === "+"
    ) {
      const left = ast.left.left;
      const right = ast.left.right;

      // Caso: (a - b) + c
      if (
        left.type === "Operator" &&
        left.operator === "-" &&
        left.right.type === "Literal" &&
        right.type === "Literal"
      ) {
        const result = right.value - left.right.value;

        return {
          ...ast,
          left: {
            type: "Operator",
            operator: "+",
            left: left.left,
            right: { type: "Literal", value: result },
          },
        };
      }

      // Caso: c + (a - b)
      if (
        right.type === "Operator" &&
        right.operator === "-" &&
        right.right.type === "Literal" &&
        left.type === "Literal"
      ) {
        const result = left.value - right.right.value;

        return {
          ...ast,
          left: {
            type: "Operator",
            operator: "+",
            left: right.left,
            right: { type: "Literal", value: result },
          },
        };
      }
    }

    return null;
  }

  description(): string {
    return "Combina constantes en expresiones como (a - b) + c o c + (a - b)";
  }
}
