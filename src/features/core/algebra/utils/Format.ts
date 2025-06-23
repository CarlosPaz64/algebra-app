import { ASTNode } from "../../types/AST";

export function formatNodeCompact(node: ASTNode): string {
  if (node.type === "Literal") return `${node.value}`;
  if (node.type === "Variable") return node.name;

  if (node.type === "Operator") {
    const { operator, left, right } = node;

    // Ej: 2 * x
    if (operator === "*" && left.type === "Literal" && right.type === "Variable") {
      return `${left.value}${right.name}`;
    }

    // Ej: 2 * x^2
    if (
      operator === "*" &&
      left.type === "Literal" &&
      right.type === "Operator" &&
      right.operator === "^" &&
      right.left.type === "Variable" &&
      right.right.type === "Literal"
    ) {
      return `${left.value}${right.left.name}^${right.right.value}`;
    }

    // x^2
    if (operator === "^" && left.type === "Variable" && right.type === "Literal") {
      return `${left.name}^${right.value}`;
    }

    // x * 3 (caso inverso)
    if (operator === "*" && left.type === "Variable" && right.type === "Literal") {
      return `${right.value}${left.name}`; // opcional: depende si quieres 3x o x3
    }

    // Suma: sin paréntesis
    if (operator === "+") {
      return `${formatNodeCompact(left)} + ${formatNodeCompact(right)}`;
    }

    // Resto de casos (con paréntesis si no se simplifica)
    return `(${formatNodeCompact(left)} ${operator} ${formatNodeCompact(right)})`;
  }

  return "";
}
