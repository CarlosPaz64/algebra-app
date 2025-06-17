import { EquationContract } from "../contracts/EquationContract";

export class DeleteEquationUseCase {
    constructor(private repository: EquationContract){}

    async(id: string): Promise<void> {
        return this.repository.deleteEquation(id);
    }
}