import type { AdventureType } from "../types/adventure.types";

/**
 * Import an adventure from a JSON file
 * Validates the structure and returns the adventure data
 */
export const importAdventureFromJSON = (file: File): Promise<AdventureType> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const parsedData = JSON.parse(jsonString);

        // Validate that it's a valid adventure structure
        const validation = validateImportedAdventure(parsedData);
        if (!validation.isValid) {
          reject(
            new Error(`Invalid adventure file: ${validation.errors.join(", ")}`)
          );
          return;
        }

        // Helper function to remap node IDs in a challenge
        const remapChallengeNodeIds = (challenge: any) => {
          // Extract metadata about Start node target (if exists)
          const startNodeTargetOldId = challenge._startNodeTarget as string | undefined;

          // Create ID mapping for all nodes in this challenge
          const idMapping = new Map<string, string>();

          // Generate new ID for start node
          const newStartNodeId = crypto.randomUUID();
          if (challenge.startNode?.id) {
            idMapping.set(challenge.startNode.id, newStartNodeId);
          }

          // Generate new IDs for all intermediate nodes
          if (challenge.nodes) {
            Object.keys(challenge.nodes).forEach((oldId) => {
              const newId = crypto.randomUUID();
              idMapping.set(oldId, newId);
            });
          }

          // Generate new IDs for end nodes
          if (challenge.endNodes && Array.isArray(challenge.endNodes)) {
            challenge.endNodes.forEach((endNode: any) => {
              if (endNode?.id) {
                const newId = crypto.randomUUID();
                idMapping.set(endNode.id, newId);
              }
            });
          }

          // Function to update node references
          // success/failure are string IDs
          const updateNodeReference = (nodeRef: unknown): string | undefined => {
            if (typeof nodeRef === "string") {
              return idMapping.get(nodeRef) || nodeRef;
            }
            return undefined;
          };

          const remappedChallenge = {
            ...challenge,
            // Update start node
            startNode: challenge.startNode
              ? {
                  ...challenge.startNode,
                  id: newStartNodeId,
                }
              : undefined,

            // Update end nodes with new IDs
            endNodes: challenge.endNodes
              ? challenge.endNodes.map((endNode: any) => ({
                  ...endNode,
                  id: idMapping.get(endNode.id) || crypto.randomUUID(),
                }))
              : [],

            // Remap intermediate nodes and their success/failure references
            // IMPORTANT: Preserve order - first node should be the one connected to Start
            nodes: challenge.nodes
              ? (() => {
                  const entries = Object.entries(challenge.nodes).map(([oldId, node]: [string, any]) => {
                    const newNodeId = idMapping.get(oldId) || crypto.randomUUID();
                    const updatedNode = {
                      ...node,
                      id: newNodeId,
                      // Update success and failure references
                      success: node.success ? updateNodeReference(node.success) : undefined,
                      failure: node.failure ? updateNodeReference(node.failure) : undefined,
                    };
                    return [newNodeId, updatedNode, oldId] as [string, any, string];
                  });

                  // Reorder: put the Start node target first
                  if (startNodeTargetOldId) {
                    const startTargetIndex = entries.findIndex(
                      ([, , oldId]) => oldId === startNodeTargetOldId
                    );
                    if (startTargetIndex > 0) {
                      const startTargetEntry = entries.splice(startTargetIndex, 1)[0];
                      entries.unshift(startTargetEntry);
                    }
                  }

                  // Convert to object (first entry will be first in object)
                  return Object.fromEntries(
                    entries.map(([newId, node]) => [newId, node])
                  );
                })()
              : {},
          };

          // Preserve _startNodeTarget metadata with new ID
          if (startNodeTargetOldId) {
            const newStartNodeTargetId = idMapping.get(startNodeTargetOldId);
            if (newStartNodeTargetId) {
              (remappedChallenge as Record<string, unknown>)._startNodeTarget = newStartNodeTargetId;
            }
          }

          return remappedChallenge;
        };

        // Generate new IDs for imported adventure and challenges
        const importedAdventure: AdventureType = {
          ...parsedData,
          id: crypto.randomUUID(),
          title: `Imported ${parsedData.title}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          // Generate new IDs for all challenges and remap node references
          challenges: Object.fromEntries(
            Object.entries(parsedData.challenges || {}).map(([, challenge]) => {
              const newChallengeId = crypto.randomUUID();
              const remappedChallenge = remapChallengeNodeIds(challenge);
              const updatedChallenge = {
                ...remappedChallenge,
                id: newChallengeId,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              };
              return [newChallengeId, updatedChallenge];
            })
          ),
        };

        resolve(importedAdventure);
      } catch {
        reject(
          new Error("Failed to parse JSON file. Please check the file format.")
        );
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };

    reader.readAsText(file);
  });
};

/**
 * Validate imported adventure structure
 */
export const validateImportedAdventure = (
  data: unknown
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Type guard to check if data is an object
  if (!data || typeof data !== "object") {
    errors.push("Data must be an object");
    return { isValid: false, errors };
  }

  const adventure = data as Record<string, unknown>;

  // Check required fields
  if (!adventure.id || typeof adventure.id !== "string") {
    errors.push("Missing or invalid 'id' field");
  }

  if (!adventure.title || typeof adventure.title !== "string") {
    errors.push("Missing or invalid 'title' field");
  }

  if (!adventure.version || typeof adventure.version !== "string") {
    errors.push("Missing or invalid 'version' field");
  }

  // Check if it has required adventure structure
  if (typeof adventure.input_aliasing !== "object") {
    errors.push("Missing or invalid 'input_aliasing' field");
  }

  if (typeof adventure.assets !== "object") {
    errors.push("Missing or invalid 'assets' field");
  }

  if (typeof adventure.challengeSelectionSettings !== "object") {
    errors.push("Missing or invalid 'challengeSelectionSettings' field");
  }

  // Validate challenges structure if present
  if (adventure.challenges && typeof adventure.challenges === "object") {
    const challenges = adventure.challenges as Record<string, unknown>;
    Object.entries(challenges).forEach(([challengeId, challenge]) => {
      if (!challenge || typeof challenge !== "object") {
        errors.push(
          `Invalid challenge structure for challenge: ${challengeId}`
        );
        return;
      }
      const challengeObj = challenge as Record<string, unknown>;
      if (!challengeObj.id || !challengeObj.title) {
        errors.push(
          `Invalid challenge structure for challenge: ${challengeId}`
        );
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Get file size in human readable format
 */
export const getImportFileSizeEstimate = (file: File): string => {
  const bytes = file.size;

  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
