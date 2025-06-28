import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, VariableNode } from "../../types/AST";

/**
 * Factoriza x·a + x·b  ⇒  x·(a + b)
 */
export class DistributiveInverseRule implements Rule {
  name = "DistributiveInverseRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;
    const eq = ast as OperatorNode;

    for (const side of ["left", "right"] as const) {
      const node = eq[side];
      if (
        node.type === "Operator" &&
        node.operator === "+" &&
        node.left.type === "Operator" &&
        node.right.type === "Operator"
      ) {
        const L = node.left as OperatorNode;
        const R = node.right as OperatorNode;
        if (
          L.operator === "*" &&
          R.operator === "*" &&
          L.left.type === "Variable" &&
          R.left.type === "Variable" &&
          (L.left as VariableNode).name === (R.left as VariableNode).name
        ) {
          const xvar = L.left;
          const a = L.right;
          const b = R.right;
          const factored: ASTNode = {
            type: "Operator",
            operator: "*",
            left: xvar,
            right: { type: "Operator", operator: "+", left: a, right: b },
          };
          return { ...eq, [side]: factored } as OperatorNode;
        }
      }
    }
    return null;
  }

  description(): string {
    return "Aplicar factorización distributiva inversa";
  }
}
