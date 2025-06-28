import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode, LiteralNode } from "../../types/AST";

/**
 * Simplifica sub-expresiones donde ambos hijos son literales:
 *   L op R  ⇒  resultado
 */
export class SimplifyConstantsRule implements Rule {
  name = "SimplifyConstantsRule";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator") return null;
    const eq = ast as OperatorNode;

    for (const side of ["left", "right"] as const) {
      const node = eq[side];
      if (
        node.type === "Operator" &&
        node.left.type === "Literal" &&
        node.right.type === "Literal"
      ) {
        const L = (node.left as LiteralNode).value;
        const R = (node.right as LiteralNode).value;
        let res: number;
        switch (node.operator) {
          case "+": res = L + R; break;
          case "*": res = L * R; break;
          case "/": res = L / R; break;
          default: continue;
        }
        return {
          ...eq,
          [side]: { type: "Literal", value: res } as LiteralNode,
        } as OperatorNode;
      }
    }
    return null;
  }

  description(): string {
    return "Simplificar constantes";
  }
}
