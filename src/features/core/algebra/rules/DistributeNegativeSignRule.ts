import { ASTNode, OperatorNode } from "../../types/AST";
import { Rule } from "../steps/Rule";
import { deepEquals } from "./DeepEquals";

export class DistributeNegativeSignRule implements Rule {
  name = "DistributeNegativeSignRule";

  apply(node: ASTNode): ASTNode | null {
    const transformed = this.distributeNegative(node);

    if (transformed && !deepEquals(transformed, node)) {
      return transformed;
    }

    // Recursión manual controlada
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

  private distributeNegative(node: ASTNode): ASTNode | null {
    if (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Literal" &&
      node.left.value === -1 &&
      node.right.type === "Operator" &&
      (node.right.operator === "+" || node.right.operator === "-")
    ) {
      const distribute = (operand: ASTNode): ASTNode => {
        if (operand.type === "Literal") {
          return { ...operand, value: -operand.value };
        } else if (operand.type === "Variable") {
          return {
            type: "Operator",
            operator: "*",
            left: { type: "Literal", value: -1 },
            right: operand,
          };
        }
        return operand;
      };

      return {
        type: "Operator",
        operator: node.right.operator === "+" ? "-" : "+", // Cambia el operador
        left: distribute(node.right.left),
        right: distribute(node.right.right),
      };
    }

    return null;
  }

  description(): string {
    return "Se distribuye el signo negativo en la suma/resta.";
  }
}