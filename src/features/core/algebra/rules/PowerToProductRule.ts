import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class PowerToProductRule implements Rule {
  name = "Potencia a producto";

  apply(node: ASTNode): ASTNode | null {
    const expanded = this.expand(node);

    if (expanded && !deepEquals(expanded, node)) {
      return expanded;
    }

    // Recorremos hijos si no hubo cambio
    if (node.type === "Operator") {
      const left = this.apply(node.left);
      const right = this.apply(node.right);

      if (left || right) {
        return {
          ...node,
          left: left ?? node.left,
          right: right ?? node.right,
        } as OperatorNode;
      }
    }

    return null;
  }

  private expand(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "^" &&
      node.right.type === "Literal" &&
      Number.isInteger(node.right.value) &&
      node.right.value > 1
    ) {
      const base = node.left;
      const exponent = node.right.value;

      let product: ASTNode = base;
      for (let i = 1; i < exponent; i++) {
        product = {
          type: "Operator",
          operator: "*",
          left: product,
          right: base,
        };
      }

      return product;
    }

    return null;
  }

  description(): string {
    return "Se expandió la potencia como multiplicación repetida (ej. x² → x·x)";
  }
}
