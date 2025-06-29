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
    // es una ecuación: “lhs = rhs”
    const lhs = str.slice(0, idx).trim();
    const rhs = str.slice(idx + 1).trim();
    return {
      type: "Operator",
      operator: "=",
      left: stringToAST(lhs),
      right: stringToAST(rhs),
    } as OperatorNode;
  }

  // si no hay “=”, parseamos con mathjs
  const mnode: MathNode = mathParse(str);
  return toAST(mnode);
}

function toAST(node: MathNode): ASTNode {
  switch (node.type) {
    case "ConstantNode":
      return { type: "Literal", value: Number((node as any).value) } as LiteralNode;

    case "SymbolNode":
      return { type: "Variable", name: (node as any).name } as VariableNode;

    case "OperatorNode": {
      const op = (node as any).op as string;
      const args = (node as any).args as MathNode[];
      // unario “-”
      if (op === "-" && args.length === 1) {
        return {
          type: "Operator",
          operator: "-",
          left: { type: "Literal", value: 0 },
          right: toAST(args[0]),
        } as OperatorNode;
      }
      // binario
      const [left, right] = args;
      return {
        type: "Operator",
        operator: op as any,
        left: toAST(left),
        right: toAST(right),
      } as OperatorNode;
    }

    case "FunctionNode": {
      const fnName = (node as any).fn.name as string;
      const args = ((node as any).args as MathNode[]).map(toAST);
      return { type: "Function", name: fnName as any, args } as FunctionNode;
    }

    case "ParenthesisNode":
      return { type: "Grouping", expression: toAST((node as any).content) } as GroupingNode;

    default:
      throw new Error(`mathjs nodo tipo '${node.type}' no soportado`);
  }
}
