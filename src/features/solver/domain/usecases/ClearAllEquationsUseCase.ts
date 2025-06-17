import { EquationContract } from "../contracts/EquationContract";

export class ClearAllEquationUseCase {
    constructor(private repository: EquationContract){}

    async(): Promise<void> {
        return this.repository.clearAllEquations();
    }
}