import AsyncStorage from '@react-native-async-storage/async-storage';
import { EquationContract } from '../../domain/contracts/EquationContract';
import { Equation } from '../../domain/entities/Equation';

const STORAGE_KEY = 'equations';

export class EquationStorageRepository implements EquationContract {
  async getEquations(): Promise<Equation[]> {
    const json = await AsyncStorage.getItem(STORAGE_KEY);
    return json ? JSON.parse(json) : [];
  }

  async getEquationById(id: string): Promise<Equation | null> {
    const all = await this.getEquations();
    return all.find(eq => eq.id === id) || null;
  }

  async saveEquation(equation: Equation): Promise<void> {
    const all = await this.getEquations();
    const updated = all.filter(eq => eq.id !== equation.id).concat(equation);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async deleteEquation(id: string): Promise<void> {
    const all = await this.getEquations();
    const updated = all.filter(eq => eq.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  async clearAllEquations(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
