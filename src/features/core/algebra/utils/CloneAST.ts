import { ASTNode } from "../../types/AST";

/** Clona recursivamente un nodo AST */
export function cloneAST<T extends ASTNode>(node: T): T {
  return JSON.parse(JSON.stringify(node));
}
