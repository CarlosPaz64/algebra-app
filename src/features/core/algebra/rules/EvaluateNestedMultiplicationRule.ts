import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";
import { deepEquals } from "./DeepEquals";

export class EvaluateNestedMultiplicationRule implements Rule {
  name = "EvaluateNestedMultiplicationRule";

  apply(node: ASTNode): ASTNode | null {
    const result = this.flattenMultiplication(node);
    if (result && !deepEquals(result, node)) {
      return result;
    }

    // Revisión recursiva defensiva
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

  private flattenMultiplication(node: ASTNode): ASTNode | null {
    if (node.type !== "Operator" || node.operator !== "*") return null;

    const factors = this.extractMultiplicativeFactors(node);

    let numericProduct = 1;
    const nonNumericFactors: ASTNode[] = [];

    for (const factor of factors) {
      if (factor.type === "Literal") {
        numericProduct *= factor.value;
      } else {
        nonNumericFactors.push(factor);
      }
    }

    if (factors.length < 2 || numericProduct === 1) return null;

    let current: ASTNode = {
      type: "Literal",
      value: numericProduct,
    };

    for (const factor of nonNumericFactors) {
      current = {
        type: "Operator",
        operator: "*",
        left: current,
        right: factor,
      };
    }

    return current;
  }

  private extractMultiplicativeFactors(node: ASTNode): ASTNode[] {
    if (node.type === "Operator" && node.operator === "*") {
      return [
        ...this.extractMultiplicativeFactors(node.left),
        ...this.extractMultiplicativeFactors(node.right),
      ];
    } else {
      return [node];
    }
  }

  description(): string {
    return "Se evaluaron multiplicaciones anidadas y se agruparon factores.";
  }
}
