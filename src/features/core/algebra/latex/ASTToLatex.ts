import { ASTNode } from "../../types/AST";

export function ASTToLatex(ast: ASTNode): string {
  switch (ast.type) {
    case "Literal":
      return ast.value.toString();

    case "Variable":
      return ast.name;

    case "Operator": {
      const left = ASTToLatex(ast.left);
      const right = ASTToLatex(ast.right);

      switch (ast.operator) {
        case "+":
        case "-":
        case "*":
        case "^":
          return `\\left(${left} ${latexOp(ast.operator)} ${right}\\right)`;

        case "/":
          return `\\frac{${left}}{${right}}`;

        case "=":
          return `${left} = ${right}`;

        default:
          return `\\left(${left} ${ast.operator} ${right}\\right)`;
      }
    }

    case "Function": {
      const args = ast.args.map(ASTToLatex).join(", ");
      return `\\${ast.name}\\left(${args}\\right)`;
    }

    case "Grouping":
      return `\\left(${ASTToLatex(ast.expression)}\\right)`;

    default:
      return "";
  }
}

function latexOp(op: string): string {
  switch (op) {
    case "*":
      return "\\cdot";
    case "^":
      return "^";
    default:
      return op;
  }
}