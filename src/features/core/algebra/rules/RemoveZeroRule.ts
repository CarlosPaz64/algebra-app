import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class RemoveZeroRule implements Rule {
  name = "Eliminación de ceros";

  apply(node: ASTNode): ASTNode | null {
    const simplified = this.removeZeros(node);

    if (simplified && !deepEquals(simplified, node)) {
      return simplified;
    }

    // Recorre hijos manualmente solo si no cambió
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

  private removeZeros(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      (node.operator === "+" || node.operator === "-") &&
      (isZero(node.right) || isZero(node.left))
    ) {
      return isZero(node.right) ? node.left : node.right;
    }

    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      (isZero(node.left) || isZero(node.right))
    ) {
      return { type: "Literal", value: 0 };
    }

    return null;
  }

  description(): string {
    return "Se eliminaron ceros innecesarios (ej. x + 0 → x, x * 0 → 0)";
  }
}

function isZero(node: ASTNode): boolean {
  return node.type === "Literal" && node.value === 0;
}
