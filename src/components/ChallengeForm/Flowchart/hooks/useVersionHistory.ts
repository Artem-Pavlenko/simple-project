import { useState, useCallback } from "react";
import type { ChallengeType } from "../../../../utils/types/challenge.types";
import type { ChallengeVersion } from "../../../../utils/types/versionHistory.types";
import { VERSION_HISTORY_CONFIG } from "../../../../utils/types/versionHistory.types";

/**
 * Hook for managing challenge version history
 * Stores up to 20 most recent versions in memory (state)
 */
export const useVersionHistory = (challengeId: string | undefined) => {
  const [versions, setVersions] = useState<ChallengeVersion[]>([]);
  const [currentVersionId, setCurrentVersionId] = useState<string | null>(null);

  // Save a new version to history (in memory only)
  const saveVersion = useCallback(
    (challenge: ChallengeType, isAutosave: boolean = false) => {
      if (!challengeId) return;

      try {
        // Create a deep copy to avoid storing references
        // Use structuredClone if available, otherwise use JSON parse/stringify
        let challengeCopy: ChallengeType;

        try {
          challengeCopy = structuredClone(challenge);
        } catch {
          // Fallback for older browsers
          challengeCopy = JSON.parse(JSON.stringify(challenge));
        }

        const newVersion: ChallengeVersion = {
          id: crypto.randomUUID(),
          challengeId,
          timestamp: new Date().toISOString(),
          challenge: challengeCopy, // Store a copy, not a reference
          description: isAutosave ? "Autosave" : "Manual save",
          isAutosave,
        };

        setVersions((prev) => {
          // Add new version at the beginning
          const updated = [newVersion, ...prev];

          // Keep only the most recent MAX_VERSIONS
          const trimmed = updated.slice(0, VERSION_HISTORY_CONFIG.MAX_VERSIONS);

          return trimmed;
        });

        // Set as current version
        setCurrentVersionId(newVersion.id);

        console.log(
          `[useVersionHistory] Saved version ${newVersion.id} (${
            isAutosave ? "autosave" : "manual"
          }, nodes: ${Object.keys(challengeCopy.nodes || {}).length})`
        );
      } catch (error) {
        console.error("[useVersionHistory] Failed to save version:", error);
      }
    },
    [challengeId]
  );

  // Mark a version as current (used when restoring)
  const setAsCurrentVersion = useCallback((versionId: string) => {
    setCurrentVersionId(versionId);
  }, []);

  // Clear all versions for this challenge
  const clearHistory = useCallback(() => {
    setVersions([]);
    console.log("[useVersionHistory] Cleared version history");
  }, []);

  // Delete a specific version
  const deleteVersion = useCallback((versionId: string) => {
    setVersions((prev) => prev.filter((v) => v.id !== versionId));
    console.log(`[useVersionHistory] Deleted version ${versionId}`);
  }, []);

  return {
    versions,
    currentVersionId,
    saveVersion,
    setAsCurrentVersion,
    clearHistory,
    deleteVersion,
  };
};
