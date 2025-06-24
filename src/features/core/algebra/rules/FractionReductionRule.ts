import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export class FractionReductionRule implements Rule {
  name = "Reducción de fracciones";

  apply(node: ASTNode): ASTNode | null {
    const simplified = this.reduce(node);

    if (simplified && !deepEquals(simplified, node)) {
      return simplified;
    }

    // Recorre recursivamente si no hubo cambio directo
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

private reduce(node: ASTNode): ASTNode | null {
  // Caso 1: Fracción literal normal: 8 / 4 → 2
  if (
    node.type === "Operator" &&
    node.operator === "/" &&
    node.left.type === "Literal" &&
    node.right.type === "Literal"
  ) {
    const a = node.left.value;
    const b = node.right.value;
    const divisor = gcd(a, b);
    if (divisor === 1) return null;

    return {
      type: "Operator",
      operator: "/",
      left: { type: "Literal", value: a / divisor },
      right: { type: "Literal", value: b / divisor },
    };
  }

  // Caso 2: Fracción con binomio: (4x - 8)/4 → x - 2
  if (
    node.type === "Operator" &&
    node.operator === "/" &&
    node.right.type === "Literal" &&
    node.left.type === "Operator" &&
    node.left.operator === "-" &&
    node.left.left.type === "Operator" &&
    node.left.left.operator === "*" &&
    node.left.left.left.type === "Literal" &&
    node.left.right.type === "Literal"
  ) {
    const coef = node.left.left.left.value; // 4
    const constant = node.left.right.value; // 8
    const divisor = node.right.value; // 4

    if (coef % divisor === 0 && constant % divisor === 0) {
      return {
        type: "Operator",
        operator: "-",
        left: {
          type: "Operator",
          operator: "*",
          left: { type: "Literal", value: coef / divisor },
          right: node.left.left.right,
        },
        right: {
          type: "Literal",
          value: constant / divisor,
        },
      };
    }
  }

  return null;
}


  description(): string {
    return "Se redujo la fracción a su mínima expresión.";
  }
}
