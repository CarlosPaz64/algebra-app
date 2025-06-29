import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
} from "../../types/AST";

/**
 * Si detecta x·(A + B) = C con A y B literales,
 * convierte A + B en un Literal antes de dividir.
 */
export class SimplifyInsideGroupingRule implements Rule {
  name = "SimplifyInsideGroupingRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;
    const eq = ast as OperatorNode;

    // Solo miramos el lado donde esté la multiplicación x·(...)
    if (
      eq.left.type === "Operator" &&
      eq.left.operator === "*" &&
      eq.left.right.type === "Operator" &&
      eq.left.right.operator === "+" &&
      eq.left.right.left.type === "Literal" &&
      eq.left.right.right.type === "Literal"
    ) {
      const sum =
        (eq.left.right.left as LiteralNode).value +
        (eq.left.right.right as LiteralNode).value;

      // Construimos x·sum
      const newLeft: OperatorNode = {
        type: "Operator",
        operator: "*",
        left: eq.left.left,
        right: { type: "Literal", value: sum },
      };

      return {
        type: "Operator",
        operator: "=",
        left: newLeft,
        right: eq.right,
      } as OperatorNode;
    }

    return null;
  }

  description(): string {
    return "Simplificar la suma dentro del paréntesis";
  }
} 