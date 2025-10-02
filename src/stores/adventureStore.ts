import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ChallengeSelectionSettingsType,
  InputAliasingType,
  s3KeyType,
} from "../utils/types/adventure.types";
import type { ChallengeType } from "../utils/types/challenge.types";

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
    [key: string]: ChallengeType;
  };
}

interface IAdventureStore {
  adventures: IAdventure[];
  addAdventure: (adventure: IAdventure) => void;
  updAdventure: (adventure: IAdventure) => void;
  updAdventureChallenge: (
    adventureId: string,
    challenge: ChallengeType
  ) => void;
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
      updAdventure(adventure) {
        set((state) => ({
          adventures: state.adventures.map((adv) =>
            adv.id === adventure.id ? adventure : adv
          ),
        }));
      },
      updAdventureChallenge(adventureId, challenge) {
        set((state) => ({
          adventures: state.adventures.map((adv) => {
            if (adv.id === adventureId) {
              return {
                ...adv,
                challenges: {
                  ...adv.challenges,
                  [challenge.id]: challenge,
                },
              };
            }
            return adv;
          }),
        }));
      },
    }),
    {
      name: "adventures-storage",
    }
  )
);
