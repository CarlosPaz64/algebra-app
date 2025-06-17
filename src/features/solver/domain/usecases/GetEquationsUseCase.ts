import { Equation } from "../entities/Equation";
import { EquationContract } from "../contracts/EquationContract";

export class GetEquationsUseCase {
    constructor(private repository: EquationContract){}

    execute(): Promise<Equation[]> {
        return this.repository.getEquations();
    }
}