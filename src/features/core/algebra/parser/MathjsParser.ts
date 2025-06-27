import * as math from "mathjs";
import { ASTNode, OperatorNode, LiteralNode, VariableNode, FunctionNode, GroupingNode } from "../../types/AST";
import { Parser } from "./Parser";

type MathNode = math.MathNode;

export class MathjsParser implements Parser {
  parse(input: string): ASTNode {
    // 1) Partir en LHS y RHS en el primer '=' que aparezca
    const idx = input.indexOf("=");
    if (idx < 0) {
      throw new Error("La expresión debe contener un '=' para formar una ecuación.");
    }
    const leftStr = input.slice(0, idx).trim();
    const rightStr = input.slice(idx + 1).trim();

    // 2) Parsear cada lado por separado
    const leftMath = math.parse(leftStr) as MathNode;
    const rightMath = math.parse(rightStr) as MathNode;

    // 3) Convertir cada MathNode a tu ASTNode
    const leftAst = this.toAST(leftMath);
    const rightAst = this.toAST(rightMath);

    // 4) Ensamblar tu nodo raíz de ecuación
    return {
      type: "Operator",
      operator: "=",
      left: leftAst,
      right: rightAst,
    } as OperatorNode;
  }

  private toAST(node: MathNode): ASTNode {
    switch (node.type) {
      case "ConstantNode":
        return { type: "Literal", value: Number((node as any).value) } as LiteralNode;
      case "SymbolNode":
        return { type: "Variable", name: (node as any).name } as VariableNode;
      case "OperatorNode": {
        const op = (node as any).op as string;
        const args = (node as any).args as MathNode[];
        // unary minus
        if (op === "-" && args.length === 1) {
          return {
            type: "Operator",
            operator: "-",
            left: { type: "Literal", value: 0 },
            right: this.toAST(args[0]),
          } as OperatorNode;
        }
        // binary operators
        const left = this.toAST(args[0]);
        const right = this.toAST(args[1]);
        return { type: "Operator", operator: op as any, left, right } as OperatorNode;
      }
      case "FunctionNode": {
        const fnName = (node as any).fn.name as string;
        const args = ((node as any).args as MathNode[]).map(a => this.toAST(a));
        return { type: "Function", name: fnName as any, args } as FunctionNode;
      }
      case "ParenthesisNode":
        return { type: "Grouping", expression: this.toAST((node as any).content) } as GroupingNode;
      default:
        throw new Error(`Nodo mathjs de tipo '${node.type}' no soportado`);
    }
  }
}
