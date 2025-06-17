import { Equation } from "../entities/Equation";
import { EquationContract } from "../contracts/EquationContract";

export class GetEquationById {
    constructor(private repository: EquationContract){}

    execute(id: string): Promise<Equation | null> {
        return this.repository.getEquationById(id);
    }
}