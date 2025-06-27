import { ASTNode } from "../../types/AST";

export function astToString(ast: ASTNode): string {
  switch (ast.type) {
    case "Literal":
      return ast.value.toString();
    case "Variable":
      return ast.name;
    case "Operator":
      const L = astToString(ast.left);
      const R = astToString(ast.right);
      return ast.operator === "^"
        ? `(${L})^(${R})`
        : `(${L}${ast.operator}${R})`;
    case "Function":
      const args = ast.args.map(astToString).join(",");
      return `${ast.name}(${args})`;
    case "Grouping":
      return `(${astToString(ast.expression)})`;
  }
}
