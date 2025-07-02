import { ASTNode, OperatorNode } from "../../types/AST";

// Punto de entrada principal
export function ASTToLatex(ast: ASTNode, parentPrecedence: number = 0): string {
  switch (ast.type) {
    case "Literal":
      return ast.value.toString();

    case "Variable":
      return ast.name;

    case "Operator":
      return formatOperator(ast, parentPrecedence);

    case "Function":
      return formatFunction(ast.name, ast.args);

    case "Grouping":
      return `\\left(${ASTToLatex(ast.expression)}\\right)`;

    default:
      return "";
  }
}

// Operadores con control de precedencia y formato específico
function formatOperator(node: OperatorNode, parentPrecedence: number): string {
  const { operator, left, right } = node;

  const opPrecedence = getPrecedence(operator);
  const leftLatex = ASTToLatex(left, opPrecedence);
  const rightLatex = ASTToLatex(right, opPrecedence);

  if (operator === "/") {
    return `\\frac{${leftLatex}}{${rightLatex}}`;
  }

  if (operator === "^") {
    return `${leftLatex}^{${rightLatex}}`;
  }

  if (operator === "=") {
    return `${leftLatex} = ${rightLatex}`;
  }

  const opLatex = operator === "*" ? getMultiplicationSymbol(left, right) : operator;
  const content = `${leftLatex}${opLatex ? ` ${opLatex} ` : ""}${rightLatex}`;

  return opPrecedence < parentPrecedence
    ? `\\left(${content}\\right)`
    : content;
}

// Controla cuándo mostrar o no el símbolo de multiplicación
function getMultiplicationSymbol(left: ASTNode, right: ASTNode): string {
  const simpleTypes = ["Literal", "Variable", "Grouping"];

  if (
    simpleTypes.includes(left.type) &&
    simpleTypes.includes(right.type)
  ) {
    return ""; // ejemplo: 2x, x(x+1)
  }

  return "\\cdot";
}

// Precedencia de operadores para decidir uso de paréntesis
function getPrecedence(op: string): number {
  switch (op) {
    case "=": return 0;
    case "+": case "-": return 1;
    case "*": case "/": return 2;
    case "^": return 3;
    default: return 0;
  }
}

// Convierte funciones conocidas a su forma LaTeX
function formatFunction(name: string, args: ASTNode[]): string {
  const argsLatex = args.map(arg => ASTToLatex(arg)).join(", ");

  switch (name) {
    case "sqrt": return `\\sqrt{${argsLatex}}`;
    case "abs":  return `\\left|${argsLatex}\\right|`;

    case "log":
    case "ln":
    case "sin":
    case "cos":
    case "tan":
    case "max":
    case "min":
    case "factorial":
      return `\\${name}\\left(${argsLatex}\\right)`;

    default:
      return `${name}\\left(${argsLatex}\\right)`; // fallback genérico
  }
}
