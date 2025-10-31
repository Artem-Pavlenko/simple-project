import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useAdventureStore } from "../../stores/adventureStore";
import { useAdventures } from "./useAdventures";
import { SupabaseAPI } from "../service/api";
import { exportChallengeAsJSON, validateChallengeForExport } from "../export";
import { challengeToasts } from "../toast";
import { type ChallengeType } from "../types/challenge.types";

export const useChallenges = () => {
  const navigate = useNavigate();
  const { setAdventures } = useAdventureStore();
  const { getUserAdventures } = useAdventures();

  const deleteChallenge = useCallback(
    async (adventureId: string, challengeId: string): Promise<void> => {
      try {
        await SupabaseAPI.deleteAdventureChallenge(adventureId, challengeId);
        const updatedAdventures = await getUserAdventures();
        setAdventures(updatedAdventures);
      } catch (error) {
        console.error("Failed to delete challenge:", error);
        throw error;
      }
    },
    [setAdventures, getUserAdventures]
  );

  const navigateToChallenge = useCallback(
    (adventureId: string, challengeId?: string) => {
      if (challengeId) {
        navigate(`/challenge/${adventureId}/${challengeId}`);
      } else {
        navigate(`/challenge/${adventureId}`);
      }
    },
    [navigate]
  );

  const navigateToCreateNewChallenge = useCallback(
    (adventureId: string) => {
      navigateToChallenge(adventureId);
    },
    [navigateToChallenge]
  );

  const navigateToEditChallenge = useCallback(
    (adventureId: string, challengeId: string) => {
      navigateToChallenge(adventureId, challengeId);
    },
    [navigateToChallenge]
  );

  const exportChallenge = useCallback((challenge: ChallengeType) => {
    try {
      const validation = validateChallengeForExport(challenge);
      if (!validation.isValid) {
        challengeToasts.exportError(
          `Cannot export challenge: ${validation.errors.join(", ")}`
        );
        return;
      }
      exportChallengeAsJSON(challenge);
      challengeToasts.exportSuccess(challenge.title);
    } catch (error) {
      console.error("Export failed:", error);
      challengeToasts.exportError(
        error instanceof Error ? error.message : undefined
      );
    }
  }, []);

  return {
    deleteChallenge,
    navigateToCreateNewChallenge,
    navigateToEditChallenge,
    exportChallenge,
    navigateToChallenge,
  };
};
