import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ChallengeSelectionSettingsType,
  InputAliasingType,
  s3KeyType,
} from "../utils/types/adventure.types";
import type { Challenge } from "../utils/types/challenge.types";

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
  type: "draft" | "final";

  created_at: string;
  updated_at: string;
  input_aliasing: InputAliasingType;
  assets: {
    matImage: s3KeyType;
    audioFiles: [
      {
        name: string;
        s3Key: s3KeyType;
      }
    ];
  };
  challengeSelectionSettings: ChallengeSelectionSettingsType;
  challenges: {
    [key: string]: Challenge;
  };
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
