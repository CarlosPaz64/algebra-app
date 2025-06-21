import { ASTNode } from "../../types/AST";

export function deepEquals(a: ASTNode, b: ASTNode): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
