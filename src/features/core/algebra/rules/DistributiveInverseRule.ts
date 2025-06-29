import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, VariableNode } from "../../types/AST";

/**
 * Factoriza x·a + x·b  ⇒  x·(a + b)
 */
export class DistributiveInverseRule implements Rule {
  name = "DistributiveInverseRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
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

        const isValid =
          L.operator === "*" &&
          R.operator === "*" &&
          L.left.type === "Variable" &&
          R.left.type === "Variable" &&
          L.left.name === R.left.name;

        if (isValid) {
          const factored: ASTNode = {
            type: "Operator",
            operator: "*",
            left: L.left, // x
            right: {
              type: "Operator",
              operator: "+",
              left: L.right,
              right: R.right,
            },
          };

          return {
            ...eq,
            [side]: factored,
          } as OperatorNode;
        }
      }
    }

    return null;
  }

  description(): string {
    return "Aplicar factorización distributiva inversa";
  }
}