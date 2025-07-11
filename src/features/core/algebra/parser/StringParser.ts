import { parse as mathParse } from "mathjs";
import type { MathNode } from "mathjs";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
  VariableNode,
  FunctionNode,
  GroupingNode
} from "../../types/AST";

/**
 * Convierte una cadena que puede ser:
 *  - una ecuación con “=”
 *  - o una expresión algebraica
 * en tu ASTNode.
 */
export function stringToAST(str: string): ASTNode {
  const idx = str.indexOf("=");
  if (idx >= 0) {
    const lhs = str.slice(0, idx).trim();
    const rhs = str.slice(idx + 1).trim();
    return {
      type: "Operator",
      operator: "=",
      left: stringToAST(lhs),
      right: stringToAST(rhs),
    };
  }

  const sanitized = str.replace("±", "plusminus");
  const mnode: MathNode = mathParse(sanitized);
  return toAST(mnode);
}


function toAST(node: MathNode): ASTNode {
  switch (node.type) {
    case "ConstantNode":
      return {
        type: "Literal",
        value: Number((node as any).value)
      } as LiteralNode;

    case "SymbolNode":
      return {
        type: "Variable",
        name: (node as any).name
      } as VariableNode;

    case "OperatorNode": {
      let op = (node as any).op as string;
      if (op === "plusminus") op = "±";
      const args = (node as any).args as MathNode[];

      // Caso unario “-”
      if (op === "-" && args.length === 1) {
        const child = toAST(args[0]);

        // Simplifica -Literal(x) a Literal(-x)
        if (child.type === "Literal") {
          return { type: "Literal", value: -child.value };
        }

        return {
          type: "Operator",
          operator: "-",
          left: { type: "Literal", value: 0 },
          right: child,
        } as OperatorNode;
      }

      // binario
      const [leftRaw, rightRaw] = args;
      const left = toAST(leftRaw);
      const right = toAST(rightRaw);

      // Simplifica 0 - Literal(x) a Literal(-x)
      if (op === "-" && left.type === "Literal" && left.value === 0 && right.type === "Literal") {
        return { type: "Literal", value: -right.value };
      }

      return {
        type: "Operator",
        operator: op as any,
        left,
        right,
      } as OperatorNode;
    }

    case "FunctionNode": {
      const fnName = (node as any).fn.name as string;
      const args = ((node as any).args as MathNode[]).map(toAST);
      return {
        type: "Function",
        name: fnName as any,
        args
      } as FunctionNode;
    }

    case "ParenthesisNode":
      return {
        type: "Grouping",
        expression: toAST((node as any).content)
      } as GroupingNode;

    default:
      throw new Error(`mathjs nodo tipo '${node.type}' no soportado`);
  }
}
