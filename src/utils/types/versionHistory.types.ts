import type { ChallengeType } from "./challenge.types";

/**
 * Represents a saved version of a challenge design
 * Used for version history and restore functionality
 */
export interface ChallengeVersion {
  /** Unique ID for this version */
  id: string;
  /** ID of the challenge this version belongs to */
  challengeId: string;
  /** When this version was saved */
  timestamp: string; // ISO 8601 format
  /** Complete snapshot of the challenge at this point in time */
  challenge: ChallengeType;
  /** Optional description of what changed (e.g., "Autosave", "Manual save") */
  description?: string;
  /** Whether this was an autosave or manual save */
  isAutosave: boolean;
}

/**
 * Configuration for version history storage
 */
export const VERSION_HISTORY_CONFIG = {
  /** Maximum number of versions to keep per challenge */
  MAX_VERSIONS: 20,
  /** localStorage key prefix */
  STORAGE_KEY_PREFIX: "challenge_history_",
} as const;
