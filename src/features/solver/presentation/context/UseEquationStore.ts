import { create } from 'zustand';
import { Equation } from '../../domain/entities/Equation';
import { GetEquationsUseCase } from '../../domain/usecases/GetEquationsUseCase';
import { SaveEquationUseCase } from '../../domain/usecases/SaveEquationUseCase';
import { DeleteEquationUseCase } from '../../domain/usecases/DeleteEquationUseCase';
import { ClearAllEquationsUseCase } from '../../domain/usecases/ClearAllEquationsUseCase';
import { EquationStorageRepository } from '../../infrastructure/repositories/EquationStorageRepository';
import { GetEquationById } from '../../domain/usecases/GetEquationByIdUseCase';

const repository = new EquationStorageRepository();

interface EquationState {
    equations: Equation[];
    loadEquations: () => Promise<void>;
    saveEquation: (eq: Equation) => Promise<void>;
    deleteEquation: (id: string) => Promise<void>;
    clearAll: () => Promise<void>;
}

export const useEquationStore = create<EquationState>((set) => ({
    equations: [],

    loadEquations: async () => {
        const usecase = new GetEquationsUseCase(repository);
        const list = await usecase.execute();
        set({ equations: list });
    },

    saveEquation: async (eq) => {
        const usecase = new SaveEquationUseCase(repository);
        await usecase.execute(eq);
        const updated = await new GetEquationsUseCase(repository).execute();
        set({ equations: updated });
    },

    deleteEquation: async (id) => {
        const usecase = new DeleteEquationUseCase(repository);
        await usecase.execute(id);
        const updated = await new GetEquationsUseCase(repository).execute();
        set({ equations: updated });
    },

    clearAll: async () => {
        const usecase = new ClearAllEquationsUseCase(repository);
        await usecase.execute();
        set({ equations: [] });
    },

    getEquationById: async (id: string) => {
        const usecase = new GetEquationById(repository);
        return await usecase.execute(id);
    }
}));
