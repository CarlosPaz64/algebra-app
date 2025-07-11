/* ESTO VA A REPRESENTAR AL TIPO DE ÁRBOL DE NODO PERMITIDO */
export type ASTNode = | LiteralNode | VariableNode | OperatorNode | FunctionNode | GroupingNode


/* PRIMERO CREAMOS LOS NODOS/RAÍCES */
export interface LiteralNode {
    type: "Literal";
    value: number;
}

export interface VariableNode {
    type: "Variable";
    name: string;
}

export interface OperatorNode {
    type: "Operator";
    operator: "+" | "-" | "*" | "/" | "^" | "=" | "±" | "plusminus";
    right: ASTNode;
    left: ASTNode;
}

export interface FunctionNode {
    type: "Function";
    name: string;
    args: ASTNode[];
}

export interface GroupingNode {
    type: "Grouping";
    expression: ASTNode;
}