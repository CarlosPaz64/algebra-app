import { Rule } from "../steps/Rule";
import { OperatorNode } from "../../types/AST";
import { cloneAST } from "../utils/CloneAST";
import { ASTNode } from "../../types/AST";

export class MultiplyByReciprocalRule implements Rule {
  name = "MultiplyByReciprocalRule";

  description = () => "Multiplicar por el recíproco para eliminar fracción";

  apply(node: OperatorNode): OperatorNode | null {
    if (node.operator !== "=") return null;
    const left = node.left;
    const right = node.right;

    // Detectar: (1/n) * x
    if (
      this.isFractionTimesVar(left)
    ) {
      const variableNode = (left as OperatorNode).right;
      const n = ((left as OperatorNode).left as OperatorNode).right;

      return {
        type: "Operator",
        operator: "=",
        left: cloneAST(variableNode),
        right: {
          type: "Operator",
          operator: "*",
          left: cloneAST(right),
          right: cloneAST(n),
        },
      };
    }

    // Detectar: x * (1/n)
    if (
      this.isVarTimesFraction(left)
    ) {
      const variableNode = (left as OperatorNode).left;
      const n = ((left as OperatorNode).right as OperatorNode).right;

      return {
        type: "Operator",
        operator: "=",
        left: cloneAST(variableNode),
        right: {
          type: "Operator",
          operator: "*",
          left: cloneAST(right),
          right: cloneAST(n),
        },
      };
    }

    return null;
  }

  private isFractionTimesVar(node: ASTNode): boolean {
    return (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.left.type === "Operator" &&
      node.left.operator === "/" &&
      node.left.left.type === "Literal" &&
      node.left.left.value === 1 &&
      node.left.right.type === "Literal" &&
      node.right.type === "Variable"
    );
  }

  private isVarTimesFraction(node: ASTNode): boolean {
    return (
      node.type === "Operator" &&
      node.operator === "*" &&
      node.right.type === "Operator" &&
      node.right.operator === "/" &&
      node.right.left.type === "Literal" &&
      node.right.left.value === 1 &&
      node.right.right.type === "Literal" &&
      node.left.type === "Variable"
    );
  }
}
