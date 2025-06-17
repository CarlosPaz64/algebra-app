import { ASTNode } from "../../types/AST";

export interface Rule {
    name: string;
    apply(ast: ASTNode): ASTNode | null;
    description(ast: ASTNode): string;
}