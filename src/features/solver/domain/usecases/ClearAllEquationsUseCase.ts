import { EquationContract } from "../contracts/EquationContract";

export class ClearAllEquationsUseCase {
  constructor(private repository: EquationContract) {}

  async execute(): Promise<void> {
    return this.repository.clearAllEquations();
  }
}
