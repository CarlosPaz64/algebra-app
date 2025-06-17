import { Equation } from "../entities/Equation";

// Este es el contrato de la aplicación a priori
export interface EquationContract {
    getEquations(): Promise<Equation[]> // Aquí se declara que se van a obtener las ecuaciones
    getEquationById(id: string): Promise<Equation | null> // Se busca obtener a una ecuación por ID
    saveEquation(equation: Equation): Promise<void> // Se guarda a la ecuación. Es tipo void porque no retorna nada
    deleteEquation(id: string): Promise<void> // Similar a la anterior, es void porque no retorna nada, y porque ejecuta una acción
    clearAllEquations(): Promise<void> // Tipo void, porque ejecuta la acción de borrar todas las ecuaciones guardadas
    // Y no debe retornar nada

}