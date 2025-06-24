import { ASTNode } from "../../types/AST";
import { Rule } from "../steps/Rule";

export class EvaluateAdditionRule implements Rule {
  name = "EvaluateAdditionRule";

  apply(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "+" &&
      node.left.type === "Literal" &&
      node.right.type === "Literal"
    ) {
      return {
        type: "Literal",
        value: node.left.value + node.right.value,
      };
    }

    return null;
  }

  description(): string {
    return "Se evaluó una suma de constantes.";
  }
}
