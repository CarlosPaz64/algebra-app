import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  LiteralNode
} from "../../types/AST";

export class SimplifyConstantsRule implements Rule {
  name = "Simplificar constantes";

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

        // 1) atajos de identidad
        if (node.operator === "-" && R === 0) {
          // (L - 0) ⇒ L
          return { ...eq, [side]: { type: "Literal", value: L } } as OperatorNode;
        }
        if (node.operator === "+" && R === 0) {
          // (L + 0) ⇒ L
          return { ...eq, [side]: { type: "Literal", value: L } } as OperatorNode;
        }
        if (node.operator === "*" && (R === 1 || L === 1)) {
          // (1 * R) ⇒ R   ó   (L * 1) ⇒ L
          return { ...eq, [side]: { type: "Literal", value: node.operator === "*" ? (L === 1 ? R : L) : L } } as OperatorNode;
        }
        if (node.operator === "/" && R === 1) {
          // (L / 1) ⇒ L
          return { ...eq, [side]: { type: "Literal", value: L } } as OperatorNode;
        }

        // 2) caso general: computar numéricamente
        let res: number;
        switch (node.operator) {
          case "+": res = L + R; break;
          case "-": res = L - R; break;
          case "*": res = L * R; break;
          case "/": res = L / R; break;
          default: continue;
        }

        return { ...eq, [side]: { type: "Literal", value: res } } as OperatorNode;
      }
    }

    return null;
  }

  description(): string {
    return "Simplificar constantes";
  }
}
