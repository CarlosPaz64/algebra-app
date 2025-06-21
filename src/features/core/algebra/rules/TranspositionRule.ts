import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class TranspositionRule implements Rule {
  name = "Transposición";

  apply(node: ASTNode): ASTNode | null {
    const transformed = this.transpose(node);

    // Si se aplicó correctamente y es diferente
    if (transformed && !deepEquals(transformed, node)) {
      return transformed;
    }

    // Recorre hijos solo si no se transformó el nodo actual
    if (node.type === "Operator") {
      const newLeft = this.apply(node.left);
      const newRight = this.apply(node.right);

      if (newLeft || newRight) {
        return {
          ...node,
          left: newLeft ?? node.left,
          right: newRight ?? node.right,
        };
      }
    }

    return null;
  }

  private transpose(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "=" &&
      node.left.type === "Operator" &&
      node.left.operator === "+"
    ) {
      const a = node.left.left;
      const b = node.left.right;
      const c = node.right;

      return {
        type: "Operator",
        operator: "=",
        left: a,
        right: {
          type: "Operator",
          operator: "-",
          left: c,
          right: b,
        },
      };
    }

    return null;
  }

  description(): string {
    return "Se transpuso un término al otro lado del signo igual.";
  }
}
