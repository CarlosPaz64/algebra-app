/* INTERFAZ BASE DE LA APLICACIÓN */

import { ASTNode } from "../../../core/types/AST";
import { RuleStep } from "../../../core/types/RuleStep";

// Importamos a los tipos definidos
export interface Equation {
    id: string;
    rawInput: string;
    parsed: ASTNode
    steps: RuleStep[];
    solved: boolean;
    createdAt: string;
}