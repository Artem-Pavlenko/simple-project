import type { AdventureType } from "../types/adventure.types";

/**
 * Export an adventure as a JSON file download
 * Similar to challengeExport but for complete adventures
 */
export const exportAdventureAsJSON = (adventure: AdventureType): void => {
  try {
    // Add metadata to each challenge for preserving Start node connections
    const challengesWithMetadata: Record<string, unknown> = {};

    Object.entries(adventure.challenges || {}).forEach(([challengeId, challenge]) => {
      const firstNodeId = Object.keys(challenge.nodes || {})[0];
      challengesWithMetadata[challengeId] = {
        ...challenge,
        _startNodeTarget: firstNodeId, // Metadata: ID of node connected to Start
      };
    });

    const exportData = {
      ...adventure,
      challenges: challengesWithMetadata,
    };

    // Convert to JSON string with pretty formatting
    const jsonString = JSON.stringify(exportData, null, 2);

    // Create blob and download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.download = `adventure-${adventure.title.replace(
      /[^a-zA-Z0-9]/g,
      "-"
    )}-${adventure.version}.json`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Failed to export adventure:", error);
    throw new Error("Failed to export adventure. Please try again.");
  }
};

/**
 * Get human-readable file size
 */
export const getAdventureFileSizeEstimate = (
  adventure: AdventureType
): string => {
  const jsonString = JSON.stringify(adventure);
  const bytes = new Blob([jsonString]).size;

  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/**
 * Validate adventure before export
 */
export const validateAdventureForExport = (
  adventure: AdventureType
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!adventure.id) errors.push("Adventure must have an ID");
  if (!adventure.title || adventure.title.trim() === "")
    errors.push("Adventure must have a title");
  if (!adventure.version) errors.push("Adventure must have a version");

  // Validate challenges if any exist
  const challengeCount = Object.keys(adventure.challenges || {}).length;
  if (challengeCount === 0) {
    // errors.push("Adventure has no challenges to export");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
