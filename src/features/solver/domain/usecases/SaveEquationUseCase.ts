import { Equation } from "../entities/Equation";
import { EquationContract } from "../contracts/EquationContract";

export class SaveEquationUseCase {
    constructor(private repository: EquationContract){}

    execute(equation: Equation): Promise<void> {
        return this.repository.saveEquation(equation);
    }
}