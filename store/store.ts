import { create } from "zustand";

interface PlantState {
  plants: { id: string; name: string; nextCycle: Date }[];
  addPlant: (id: string, name: string, nextCycle: Date) => void;
  removePlant: (id: string) => void;
}

export const usePlantStore = create<PlantState>((set) => ({
  plants: [],
  addPlant: (id, name, nextCycle) =>
    set((state) => ({
      plants: [...state.plants, { id, name, nextCycle }],
    })),
  removePlant: (id) =>
    set((state) => ({
      plants: state.plants.filter((plant) => plant.id !== id),
    })),
}));
