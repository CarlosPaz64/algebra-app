import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, VariableNode } from "../../types/AST";

/**
 * Regla que separa una solución con ± en dos ecuaciones distintas.
 */
export class SplitPlusMinusRule implements Rule {
  name = "SplitPlusMinusRule";

  apply(ast: ASTNode): ASTNode[] | null {
    if (
      ast.type !== "Operator" ||
      ast.operator !== "=" ||
      (ast as any).metadata?.split
    ) {
      return null;
    }

    const eq = ast as OperatorNode;
    if (eq.left.type !== "Variable") return null;

    const right = eq.right;

    // Buscamos x = ((a * ±) * b) / c  o cualquier variante similar
    if (
      right.type === "Operator" &&
      right.operator === "/" &&
      right.left.type === "Operator" &&
      right.left.operator === "*" &&
      right.left.left.type === "Operator" &&
      right.left.left.operator === "*" &&
      (
        (right.left.left.left.type === "Variable" && right.left.left.left.name === "plusminus") ||
        (right.left.left.right.type === "Variable" && right.left.left.right.name === "plusminus")
      )
    ) {
      const a = right.left.left.left;
      const b = right.left.left.right;
      const sqrtPart = right.left.right;
      const denominator = right.right;

      const createBranch = (sign: "+" | "-"): ASTNode => {
        // Determinar el coeficiente real (el que NO es plusminus)
        const coefficient = a.type === "Variable" && a.name === "plusminus" ? b : a;

        const signedExpression: OperatorNode = {
          type: "Operator",
          operator: sign,
          left: {
            type: "Literal",
            value: 0,
          },
          right: {
            type: "Operator",
            operator: "*",
            left: coefficient,
            right: sqrtPart,
          },
        };

        const full: OperatorNode = {
          type: "Operator",
          operator: "=",
          left: eq.left,
          right: {
            type: "Operator",
            operator: "/",
            left: signedExpression,
            right: denominator,
          },
        };

        (full as any).metadata = { split: true };
        return full;
      };

      return [createBranch("+"), createBranch("-")];
    }

    return null;
  }

  description(): string {
    return "Separar solución con ± en dos ecuaciones distintas: una con + y otra con -";
  }
}
