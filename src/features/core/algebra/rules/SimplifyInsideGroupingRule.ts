import { Rule } from "../steps/Rule";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
  GroupingNode,
} from "../../types/AST";

export class SimplifyInsideGroupingRule implements Rule {
  name = "Simplificar constantes dentro del paréntesis";

  apply(ast: ASTNode): ASTNode | null {
    if (ast.type !== "Operator" || ast.operator !== "=") return null;
    const eq = ast as OperatorNode;

    const simplify = (side: "left" | "right"): ASTNode | null => {
      const node = eq[side];

      // Buscamos x * (a op b)
      if (
        node.type === "Operator" &&
        node.operator === "*" &&
        node.right.type === "Grouping" &&
        node.right.expression.type === "Operator" &&
        node.right.expression.left.type === "Literal" &&
        node.right.expression.right.type === "Literal"
      ) {
        const opNode = node.right.expression;
        const a = (opNode.left as LiteralNode).value;
        const b = (opNode.right as LiteralNode).value;

        let result: number;
        switch (opNode.operator) {
          case "+":
            result = a + b;
            break;
          case "-":
            result = a - b;
            break;
          case "*":
            result = a * b;
            break;
          case "/":
            result = a / b;
            break;
          default:
            return null;
        }

        const newLeft: OperatorNode = {
          type: "Operator",
          operator: "*",
          left: node.left,
          right: {
            type: "Literal",
            value: result,
          },
        };

        return {
          ...eq,
          [side]: newLeft,
        } as OperatorNode;
      }

      return null;
    };

    return simplify("left") || simplify("right");
  }

  description(): string {
    return "Simplificar operación dentro de paréntesis: x * (a op b)";
  }
}
