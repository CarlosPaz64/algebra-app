import { ASTNode } from "../../types/AST";

export function deepEquals(a: ASTNode, b: ASTNode): boolean {
  if (a.type !== b.type) return false;

  switch (a.type) {
    case "Literal":
      return b.type === "Literal" && a.value === b.value;

    case "Variable":
      return b.type === "Variable" && a.name === b.name;

    case "Operator":
      return (
        b.type === "Operator" &&
        a.operator === b.operator &&
        deepEquals(a.left, b.left) &&
        deepEquals(a.right, b.right)
      );

    case "Grouping":
      return b.type === "Grouping" && deepEquals(a.expression, b.expression);

    default:
      return false;
  }
}
