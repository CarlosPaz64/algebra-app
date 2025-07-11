import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode, VariableNode } from "../../types/AST";

export class EvaluatePlusMinusRule implements Rule {
  name = "EvaluatePlusMinusRule";

  apply(ast: ASTNode): ASTNode[] | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;
    if (eq.left.type !== "Variable") return null;

    const rhs = eq.right;

    // Busca: x = ((a ± b) * plusminus) / c
    if (
      rhs.type === "Operator" &&
      rhs.operator === "/" &&
      rhs.left.type === "Operator" &&
      rhs.left.operator === "*" &&
      rhs.left.left.type === "Operator" &&
      (rhs.left.left.operator === "+" || rhs.left.left.operator === "-") &&
      rhs.left.right.type === "Variable" &&
      rhs.left.right.name === "plusminus"
    ) {
      const aOp = rhs.left.left as OperatorNode;
      const denom = rhs.right;

      // Rama +
      const plusBranch: ASTNode = {
        type: "Operator",
        operator: "=",
        left: eq.left,
        right: {
          type: "Operator",
          operator: "/",
          left: {
            type: "Operator",
            operator: "+",
            left: aOp.left,
            right: aOp.right
          },
          right: denom
        }
      };

      // Rama -
      const minusBranch: ASTNode = {
        type: "Operator",
        operator: "=",
        left: eq.left,
        right: {
          type: "Operator",
          operator: "/",
          left: {
            type: "Operator",
            operator: "-",
            left: aOp.left,
            right: aOp.right
          },
          right: denom
        }
      };

      return [plusBranch, minusBranch];
    }

    return null;
  }

  description(): string {
    return "Evalúa ramas separando el símbolo ± en + y - incluso si viene multiplicado con plusminus.";
  }
}
