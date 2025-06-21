import { Rule } from "../steps/Rule";
import { ASTNode, OperatorNode } from "../../types/AST";

export class FlattenGroupingRule implements Rule {
  name = "FlattenGroupingRule";

  apply(node: ASTNode): ASTNode | null {
    if (node.type === "Grouping") {
      console.log("✅ [FlattenGroupingRule] Nodo Grouping eliminado");
      return node.expression;
    }

    if (node.type === "Operator") {
      let changed = false;

      const flatLeft = node.left?.type === "Grouping"
        ? (changed = true, node.left.expression)
        : node.left;

      const flatRight = node.right?.type === "Grouping"
        ? (changed = true, node.right.expression)
        : node.right;

      if (changed) {
        console.log("✅ [FlattenGroupingRule] Agrupación removida en hijos");
        return {
          ...node,
          left: flatLeft,
          right: flatRight,
        };
      }
    }

    return null;
  }

  description(): string {
    return "Se eliminan los paréntesis innecesarios (agrupación)";
  }
}
