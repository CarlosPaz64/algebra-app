import * as math from "mathjs";
import {
  ASTNode,
  OperatorNode,
  LiteralNode,
  VariableNode,
  FunctionNode,
  GroupingNode,
} from "../../types/AST";
import { Parser } from "./Parser";

type MathNode = math.MathNode;

// Valida paréntesis balanceados
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

// Inserta multiplicaciones implícitas (ej: 2x → 2*x)
function insertImplicitMultiplication(expr: string): string {
  return expr
    .replace(/(\d|\)|[a-zA-Z])\s*\(/g, "$1*(")
    .replace(/\)\s*(\d|[a-zA-Z])/g, ")*$1")
    .replace(/([a-zA-Z])(\d)/g, "$1*$2")
    .replace(/(\d)([a-zA-Z])/g, "$1*$2");
}

// Limpia caracteres invisibles + símbolos no deseados
function sanitizeInput(expr: string): string {
  return expr
    .normalize("NFKC") // Normaliza rarezas Unicode
    .replace(/[^\x20-\x7E]/g, "") // Solo caracteres ASCII visibles
    .replace(/[\u200B-\u200D\uFEFF]/g, "") // Invisibles comunes
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .trim();
}

export class MathjsParser implements Parser {
  parse(input: string): ASTNode {
    const sanitized = sanitizeInput(input);
    const cleaned = insertImplicitMultiplication(sanitized);

    // 🔍 Imprime para depuración real
    console.log("🧼 Entrada limpia (sanitizeInput):", JSON.stringify(sanitized));
    console.log("🛠️ Entrada final (con multiplicación implícita):", JSON.stringify(cleaned));

    validateBrackets(cleaned);

    const idx = cleaned.indexOf("=");
    if (idx < 0) {
      throw new Error("La expresión debe contener un '=' para formar una ecuación.");
    }

    const leftStr = cleaned.slice(0, idx).trim();
    const rightStr = cleaned.slice(idx + 1).trim();

    if (!leftStr || !rightStr) {
      throw new Error("Ambos lados de la ecuación deben contener expresiones válidas.");
    }

    // 👁️ Imprime los lados antes de parsear
    console.log("📤 Izquierda:", JSON.stringify(leftStr));
    console.log("📤 Derecha:", JSON.stringify(rightStr));

    const safeParse = (str: string) => {
      try {
        return math.parse(str);
      } catch (e) {
        throw new Error(`Error de sintaxis en "${str}": ${(e as Error).message}`);
      }
    };

    const leftAst = this.toAST(safeParse(leftStr));
    const rightAst = this.toAST(safeParse(rightStr));

    return {
      type: "Operator",
      operator: "=",
      left: leftAst,
      right: rightAst,
    };
  }

  private toAST(node: MathNode): ASTNode {
    switch (node.type) {
      case "ConstantNode":
        return {
          type: "Literal",
          value: Number((node as math.ConstantNode).value),
        };

      case "SymbolNode":
        return {
          type: "Variable",
          name: (node as math.SymbolNode).name,
        };

      case "OperatorNode": {
        const opNode = node as math.OperatorNode;
        const op = opNode.op;
        const args = opNode.args;

        // Unario: -x
        if (op === "-" && args.length === 1) {
          return {
            type: "Operator",
            operator: "-",
            left: { type: "Literal", value: 0 },
            right: this.toAST(args[0]),
          };
        }

        // N-ario (ej: a + b + c → ((a + b) + c))
        if (args.length > 2) {
          return args.reduceRight((acc, cur) => {
            return {
              type: "Operator",
              operator: op,
              left: this.toAST(cur),
              right: acc,
            };
          }, this.toAST(args.pop()!))!;
        }

        // Binario
        return {
          type: "Operator",
          operator: op,
          left: this.toAST(args[0]),
          right: this.toAST(args[1]),
        };
      }

      case "FunctionNode": {
        const fn = node as math.FunctionNode;
        const fnName = (fn.fn as math.SymbolNode).name;
        return {
          type: "Function",
          name: fnName,
          args: fn.args.map((arg) => this.toAST(arg)),
        };
      }

      case "ParenthesisNode": {
        const content = (node as any).content as MathNode;
        return {
          type: "Grouping",
          expression: this.toAST(content),
        };
      }

      default:
        throw new Error(`Tipo de nodo no soportado: ${node.type}`);
    }
  }
}
