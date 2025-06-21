import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class IdentityRule implements Rule {
  name = "Identidad algebraica";

  apply(node: ASTNode): ASTNode | null {
    const simplified = this.removeIdentities(node);

    if (simplified && !deepEquals(simplified, node)) {
      return simplified;
    }

    // Aplicar recursivamente en hijos si no cambió
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

  private removeIdentities(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator") return null;

    if (node.operator === "*" && (isOne(node.left) || isOne(node.right))) {
      return isOne(node.left) ? node.right : node.left;
    }

    if (node.operator === "/" && isOne(node.right)) {
      return node.left;
    }

    return null;
  }

  description(): string {
    return "Se aplicó la identidad: x * 1 → x o x / 1 → x";
  }
}

function isOne(node: ASTNode): boolean {
  return node.type === "Literal" && node.value === 1;
}
