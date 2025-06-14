import { ASTNode } from "./AST";
/* ESTO ES PAR APLICAR REGLAS ALGEBRÁICAS */
export interface RuleStep {
    stepNumber: number;
    description: string; 
    ast: ASTNode;
    latex: string;
}