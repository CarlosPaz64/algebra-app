import * as math from "mathjs";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
  VariableNode,
  FunctionNode,
  GroupingNode
} from "../../types/AST";
import { Parser } from "./Parser";

type MathNode = math.MathNode;

function validateBrackets(expr: string) {
  const stack: string[] = [];
  for (const ch of expr) {
    if (ch === "(") stack.push(ch);
    else if (ch === ")") {
      if (!stack.length) throw new Error("Paréntesis de cierre sin apertura.");
      stack.pop();
    }
  }
  if (stack.length) throw new Error("Falta cerrar paréntesis.");
}

function insertImplicitMultiplication(expr: string): string {
  // convierte 2(x+3) o x(x+1) en 2*(x+3) y x*(x+1)
  return expr.replace(/([0-9a-zA-Z)])\s*\(/g, "$1*(");
}

export class MathjsParser implements Parser {
  parse(input: string): ASTNode {
    // 0) Preprocesado: agregar * implícita y validar paréntesis
    const cleaned = insertImplicitMultiplication(input);
    validateBrackets(cleaned);

    // 1) Partir en LHS y RHS en el primer '=' que aparezca
    const idx = cleaned.indexOf("=");
    if (idx < 0) {
      throw new Error("La expresión debe contener un '=' para formar una ecuación.");
    }
    const leftStr  = cleaned.slice(0, idx).trim();
    const rightStr = cleaned.slice(idx + 1).trim();

    // 2) Parsear cada lado por separado
    const leftMath  = math.parse(leftStr)  as MathNode;
    const rightMath = math.parse(rightStr) as MathNode;

    // 3) Convertir cada MathNode a tu ASTNode
    const leftAst  = this.toAST(leftMath);
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
        const op   = (node as any).op as string;
        const args = (node as any).args as MathNode[];
        // unary minus
        if (op === "-" && args.length === 1) {
          return {
            type: "Operator",
            operator: "-",
            left:  { type: "Literal", value: 0 },
            right: this.toAST(args[0]),
          } as OperatorNode;
        }
        // binary operators
        const left  = this.toAST(args[0]);
        const right = this.toAST(args[1]);
        return {
          type: "Operator",
          operator: op as any,
          left,
          right
        } as OperatorNode;
      }
      case "FunctionNode": {
        const fnName = (node as any).fn.name as string;
        const args   = ((node as any).args as MathNode[]).map(a => this.toAST(a));
        return { type: "Function", name: fnName as any, args } as FunctionNode;
      }
      case "ParenthesisNode":
        return {
          type: "Grouping",
          expression: this.toAST((node as any).content)
        } as GroupingNode;
      default:
        throw new Error(`Nodo mathjs de tipo '${node.type}' no soportado`);
    }
  }
}
