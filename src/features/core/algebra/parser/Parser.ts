import { ASTNode } from "../../types/AST";

/**
 * Interfaz de parser para convertir una cadena en tu ASTNode.
 */
export interface Parser {
  /**
   * Parsea la expresión algebraica y devuelve su AST.
   */
  parse(expression: string): ASTNode;
}
