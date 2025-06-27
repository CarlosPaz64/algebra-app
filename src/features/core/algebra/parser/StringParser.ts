import { parse as mathParse } from "mathjs";
import type { MathNode } from "mathjs";
import { ASTNode, OperatorNode, LiteralNode, VariableNode, FunctionNode, GroupingNode } from "../../types/AST";

export function stringToAST(str: string): ASTNode {
  const mnode: MathNode = mathParse(str);
  return toAST(mnode);
}

function toAST(node: MathNode): ASTNode {
  switch (node.type) {
    case "ConstantNode":
      return { type: "Literal", value: Number((node as any).value) } as LiteralNode;
    case "SymbolNode":
      return { type: "Variable", name: (node as any).name } as VariableNode;
    case "OperatorNode":
      const op = (node as any).op as string;
      const [a, b] = (node as any).args as MathNode[];
      // unary minus
      if (op === "-" && !b) {
        return {
          type: "Operator",
          operator: "-",
          left: { type: "Literal", value: 0 },
          right: toAST(a),
        } as OperatorNode;
      }
      return {
        type: "Operator",
        operator: op as any,
        left: toAST(a),
        right: toAST(b),
      } as OperatorNode;
    case "FunctionNode":
      const fn = (node as any).fn.name as string;
      const args = ((node as any).args as MathNode[]).map(toAST);
      return { type: "Function", name: fn as any, args } as FunctionNode;
    case "ParenthesisNode":
      return { type: "Grouping", expression: toAST((node as any).content) } as GroupingNode;
    default:
      throw new Error(`mathjs node type ${node.type} no soportado`);
  }
}
