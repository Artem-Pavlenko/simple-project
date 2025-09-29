import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface IUserProfile {
  id: string;
  email: string | null | undefined;
}

export interface IAdventure {
  title: string;
  description: string;
  tags: string[];
  version: string;
  id: string;
  createdAt?: string;
  updatedAt?: string;
  challenges?: string[];
  type: "draft" | "final";
}

interface IAdventureStore {
  adventures: IAdventure[];
  addAdventure: (adventure: IAdventure) => void;
  clearAdventures: () => void;
  setAdventures: (adventures: IAdventure[]) => void;
  deleteAdventure: (id: string) => void;
}

export const useAdventureStore = create<IAdventureStore>()(
  persist(
    (set) => ({
      adventures: [],
      addAdventure(adventure) {
        set((state) => ({ adventures: [...state.adventures, adventure] }));
      },
      setAdventures(adventures) {
        set({ adventures });
      },
      clearAdventures() {
        set({ adventures: [] });
      },
      deleteAdventure(id) {
        set((state) => ({
          adventures: state.adventures.filter((adv) => adv.id !== id),
        }));
      },
    }),
    {
      name: "adventures-storage",
    }
  )
);
