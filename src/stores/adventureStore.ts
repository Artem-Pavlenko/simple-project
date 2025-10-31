import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdventureType } from "../utils/types/adventure.types";
import type { ChallengeType } from "../utils/types/challenge.types";

export interface IUserProfile {
  id: string;
  email: string | null | undefined;
}

interface IAdventureStore {
  adventures: AdventureType[];
  addAdventure: (adventure: AdventureType) => void;
  updAdventure: (adventure: AdventureType) => void;
  updAdventureChallenge: (
    adventureId: string,
    challenge: ChallengeType
  ) => void;
  clearAdventures: () => void;
  setAdventures: (adventures: AdventureType[]) => void;
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
