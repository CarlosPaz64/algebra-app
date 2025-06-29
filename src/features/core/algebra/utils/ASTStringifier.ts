import { ASTNode, OperatorNode, GroupingNode } from "../../types/AST";

function precedence(op: string): number {
  switch (op) {
    case "^": return 4;
    case "*": case "/": return 3;
    case "+": case "-": return 2;
    case "=":           return 1;
    default:            return 0;
  }
}

export function astToString(ast: ASTNode): string {
  switch (ast.type) {
    case "Literal":
      return ast.value.toString();
    case "Variable":
      return ast.name;
    case "Function":
      return `${ast.name}(${ast.args.map(astToString).join(",")})`;
    case "Grouping":
      // se asume que aquí ya es necesario el paréntesis
      return `(${astToString(ast.expression)})`;

    case "Operator":
      const node = ast as OperatorNode;
      const op = node.operator;

      const leftStr  = astToString(node.left);
      const rightStr = astToString(node.right);

      const wrap = (child: ASTNode, str: string) => {
        if (child.type === "Operator") {
          const precChild = precedence((child as OperatorNode).operator);
          const precThis  = precedence(op);
          // solo envolvemos si el hijo tiene menor precedencia
          if (precChild < precThis) return `(${str})`;
        }
        return str;
      };

      // para ^ querrás “a^(b)”; los demás ops van sin agrupación extra si no hace falta
      if (op === "^") {
        return `${wrap(node.left, leftStr)}^${wrap(node.right, rightStr)}`;
      } else {
        return `${wrap(node.left, leftStr)}${op}${wrap(node.right, rightStr)}`;
      }
  }
}
