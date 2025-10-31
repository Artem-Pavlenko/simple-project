import { useState, useCallback } from "react";
import { SupabaseAPI } from "../service/api";
import type { AdventureType } from "../types/adventure.types";
import type {
  InputAliasingType,
  ChallengeSelectionSettingsType,
  AudioFileType,
} from "../types/adventure.types";
import type { ChallengeType } from "../types/challenge.types";
import type { TagType } from "../types";
import { exportAdventureAsJSON, validateAdventureForExport } from "../export";
import { importAdventureFromJSON } from "../import";

// Database row type with snake_case column names
type AdventureDbRow = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  version: string;
  tag: string | null;
  input_aliasing: InputAliasingType;
  assets: {
    matImage: string;
    audioFiles: AudioFileType[];
  };
  challenge_selection_settings: ChallengeSelectionSettingsType;
  challenges: Record<string, ChallengeType>;
  created_at: string;
  updated_at: string;
};

// Helper function to transform database row to AdventureType
const transformDbRowToAdventure = (row: AdventureDbRow): AdventureType => ({
  id: row.id,
  title: row.title,
  description: row.description || "",
  version: row.version,
  tag: row.tag as TagType | undefined,
  input_aliasing: row.input_aliasing,
  assets: row.assets,
  challengeSelectionSettings: row.challenge_selection_settings,
  challenges: row.challenges,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

export const useAdventures = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAdventure = useCallback(
    async (adventure: Omit<AdventureType, "created_at" | "updated_at">) => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await SupabaseAPI.createAdventure(adventure);
        if (error) throw error;
        return data ? transformDbRowToAdventure(data) : null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create adventure";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const getAdventureById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await SupabaseAPI.getAdventureById(id);
      if (error) throw error;
      return data ? transformDbRowToAdventure(data) : null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get adventure";
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateAdventure = useCallback(
    async (
      id: string,
      updates: Partial<Omit<AdventureType, "id" | "created_at">>
    ) => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await SupabaseAPI.updateAdventure(id, updates);
        if (error) throw error;
        return data ? transformDbRowToAdventure(data) : null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update adventure";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteAdventure = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await SupabaseAPI.deleteAdventure(id);
      if (error) throw error;
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete adventure";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getUserAdventures = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await SupabaseAPI.getUserAdventures();
      if (error) throw error;
      return data ? data.map(transformDbRowToAdventure) : [];
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get adventures";
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const checkAdventureExists = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await SupabaseAPI.checkAdventureExists(id);
      if (error && error.code !== "PGRST116") throw error; // PGRST116 = no rows returned
      return data !== null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to check adventure";
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const exportAdventure = useCallback((adventure: AdventureType) => {
    const validation = validateAdventureForExport(adventure);
    if (!validation.isValid) {
      throw new Error(
        `Cannot export adventure: ${validation.errors.join(", ")}`
      );
    }
    exportAdventureAsJSON(adventure);
  }, []);

  const duplicateAdventure = useCallback(
    async (originalAdventure: AdventureType) => {
      setLoading(true);
      setError(null);
      try {
        // Create a duplicate with new ID and modified title
        const duplicatedAdventure: AdventureType = {
          ...originalAdventure,
          id: crypto.randomUUID(),
          title: `Copy of ${originalAdventure.title}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Generate new IDs for all challenges
          challenges: Object.fromEntries(
            Object.entries(originalAdventure.challenges).map(
              ([, challenge]) => {
                const newChallengeId = crypto.randomUUID();
                const duplicatedChallenge = {
                  ...challenge,
                  id: newChallengeId,
                  created_at: new Date().toISOString(),
                  updated_at: new Date().toISOString(),
                };
                return [newChallengeId, duplicatedChallenge];
              }
            )
          ),
        };

        const { data, error } = await SupabaseAPI.createAdventure(
          duplicatedAdventure
        );
        if (error) throw error;
        return data ? transformDbRowToAdventure(data) : null;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to duplicate adventure";
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const importAdventure = useCallback(async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      // Parse and validate the imported adventure
      const importedAdventure = await importAdventureFromJSON(file);

      // Save to database
      const { data, error } = await SupabaseAPI.createAdventure(
        importedAdventure
      );
      if (error) throw error;
      return data ? transformDbRowToAdventure(data) : null;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to import adventure";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    createAdventure,
    getAdventureById,
    updateAdventure,
    deleteAdventure,
    getUserAdventures,
    checkAdventureExists,
    exportAdventure,
    duplicateAdventure,
    importAdventure,
  };
};
