import type { ChallengeType } from "../types/challenge.types";

/**
 * Export a challenge as a JSON file download
 * FR-2.12: The user shall be able to export a single Challenge as a standalone file in JSON format
 */
export const exportChallengeAsJSON = (challenge: ChallengeType): void => {
  try {
    // Find the first node connected to Start node
    // This will be used as metadata to preserve the connection during import
    const firstNodeId = Object.keys(challenge.nodes)[0];
    // Create export data with metadata
    // We add a temporary field _startNodeTarget to preserve the Start->First connection
    const exportData = {
      ...challenge,
      _startNodeTarget: firstNodeId, // Metadata: ID of node connected to Start
    };

    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `challenge-${challenge.title.replace(
      /[^a-zA-Z0-9]/g,
      "-"
    )}-${challenge.version}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export challenge:", error);
    throw new Error("Failed to export challenge. Please try again.");
  }
};

/**
 * Get human-readable file size
 */
export const getFileSizeEstimate = (challenge: ChallengeType): string => {
  const jsonString = JSON.stringify(challenge);
  const bytes = new Blob([jsonString]).size;

  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Validate challenge before export
 */
export const validateChallengeForExport = (
  challenge: ChallengeType
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!challenge.id) errors.push("Challenge must have an ID");
  if (!challenge.title || challenge.title.trim() === "")
    errors.push("Challenge must have a title");
  if (!challenge.version) errors.push("Challenge must have a version");

  return {
    isValid: errors.length === 0,
    errors,
  };
};
