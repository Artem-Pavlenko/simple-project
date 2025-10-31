import type { ChallengeType } from "../types/challenge.types";

/**
 * Import a challenge from a JSON file
 * Validates the structure and returns the challenge data
 */
export const importChallengeFromJSON = (file: File): Promise<ChallengeType> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const jsonString = event.target?.result as string;
        const parsedData = JSON.parse(jsonString);

        // Validate that it's a valid challenge structure
        const validation = validateImportedChallenge(parsedData);
        if (!validation.isValid) {
          reject(
            new Error(`Invalid challenge file: ${validation.errors.join(", ")}`)
          );
          return;
        }

        // Create ID mapping for all nodes
        const idMapping = new Map<string, string>();

        // Generate new ID for start node
        const newStartNodeId = crypto.randomUUID();
        if (parsedData.startNode?.id) {
          idMapping.set(parsedData.startNode.id, newStartNodeId);
        }

        // Extract metadata about Start node target (if exists)
        const startNodeTargetOldId = (parsedData as unknown as Record<string, unknown>)._startNodeTarget as string | undefined;

        // Generate new IDs for all nodes and create mapping
        const nodeIdMapping = new Map<string, string>();
        if (parsedData.nodes) {
          Object.keys(parsedData.nodes).forEach((oldId) => {
            const newId = crypto.randomUUID();
            nodeIdMapping.set(oldId, newId);
            idMapping.set(oldId, newId);
          });
        }

        // Generate new IDs for end nodes
        if (parsedData.endNodes && Array.isArray(parsedData.endNodes)) {
          parsedData.endNodes.forEach((endNode: unknown) => {
            if (
              endNode &&
              typeof endNode === "object" &&
              "id" in endNode &&
              typeof endNode.id === "string"
            ) {
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

        // Generate new IDs for imported challenge
        const importedChallenge: ChallengeType = {
          ...parsedData,
          id: crypto.randomUUID(),
          title: `Imported ${parsedData.title}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),

          // Update start node
          startNode: parsedData.startNode
            ? {
                ...parsedData.startNode,
                id: newStartNodeId,
              }
            : {
                type: "start",
                id: newStartNodeId,
                height: 100,
                width: 100,
                x: 100,
                y: 100,
              },

          // Update end nodes with new IDs
          endNodes: parsedData.endNodes
            ? parsedData.endNodes.map((endNode: unknown) => {
                if (
                  endNode &&
                  typeof endNode === "object" &&
                  "id" in endNode &&
                  typeof endNode.id === "string"
                ) {
                  return {
                    ...endNode,
                    id: idMapping.get(endNode.id) || crypto.randomUUID(),
                  };
                }
                return endNode;
              })
            : [],

          // Generate new IDs for nodes and update internal references
          // IMPORTANT: Preserve order - first node should be the one connected to Start
          nodes: parsedData.nodes
            ? (() => {
                const entries = Object.entries(parsedData.nodes).map(
                  ([oldId, node]: [string, unknown]) => {
                    const newNodeId =
                      nodeIdMapping.get(oldId) || crypto.randomUUID();

                    if (node && typeof node === "object") {
                      const nodeObj = node as Record<string, unknown>;
                      const updatedNode = {
                        ...nodeObj,
                        id: newNodeId,
                        // Update success and failure references if they exist
                        success: nodeObj.success
                          ? updateNodeReference(nodeObj.success)
                          : undefined,
                        failure: nodeObj.failure
                          ? updateNodeReference(nodeObj.failure)
                          : undefined,
                      };
                      return [newNodeId, updatedNode, oldId] as [string, unknown, string];
                    }

                    return [newNodeId, node, oldId] as [string, unknown, string];
                  }
                );

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

        // Preserve _startNodeTarget metadata by adding it to the challenge
        // This field is not in ChallengeType but TypeScript allows extra properties
        // It will survive database round-trips and help maintain correct Start node connection
        if (startNodeTargetOldId) {
          const newStartNodeTargetId = nodeIdMapping.get(startNodeTargetOldId);
          if (newStartNodeTargetId) {
            (importedChallenge as Record<string, unknown>)._startNodeTarget = newStartNodeTargetId;
          }
        }

        resolve(importedChallenge);
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
 * Validate imported challenge structure against ChallengeType interface
 */
export const validateImportedChallenge = (
  data: unknown
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Type guard to check if data is an object
  if (!data || typeof data !== "object") {
    errors.push("Data must be an object");
    return { isValid: false, errors };
  }

  const challenge = data as Record<string, unknown>;

  // Validate required ChallengeType fields
  if (!challenge.id || typeof challenge.id !== "string") {
    errors.push("Missing or invalid 'id' field (must be string)");
  }

  if (!challenge.title || typeof challenge.title !== "string") {
    errors.push("Missing or invalid 'title' field (must be string)");
  }

  if (!challenge.description || typeof challenge.description !== "string") {
    errors.push("Missing or invalid 'description' field (must be string)");
  }

  if (!challenge.version || typeof challenge.version !== "string") {
    errors.push("Missing or invalid 'version' field (must be string)");
  }

  // Validate challengeStart array
  if (!Array.isArray(challenge.challengeStart)) {
    errors.push("Missing or invalid 'challengeStart' field (must be array)");
  }

  // Validate startNode (IStartNode)
  if (!challenge.startNode || typeof challenge.startNode !== "object") {
    errors.push("Missing or invalid 'startNode' field (must be object)");
  } else {
    const startNode = challenge.startNode as Record<string, unknown>;
    if (!startNode.id || typeof startNode.id !== "string") {
      errors.push("startNode missing valid 'id' field");
    }
    if (startNode.type !== "start") {
      errors.push("startNode must have type 'start'");
    }
    if (typeof startNode.x !== "number") {
      errors.push("startNode missing valid 'x' coordinate (number)");
    }
    if (typeof startNode.y !== "number") {
      errors.push("startNode missing valid 'y' coordinate (number)");
    }
    if (typeof startNode.width !== "number") {
      errors.push("startNode missing valid 'width' (number)");
    }
    if (typeof startNode.height !== "number") {
      errors.push("startNode missing valid 'height' (number)");
    }
  }

  // Validate endNodes array (IEndNode[])
  if (!Array.isArray(challenge.endNodes)) {
    errors.push("Missing or invalid 'endNodes' field (must be array)");
  } else {
    if (challenge.endNodes.length === 0) {
      errors.push("endNodes array is empty (must have at least one end node)");
    }

    challenge.endNodes.forEach((endNode: unknown, index: number) => {
      if (!endNode || typeof endNode !== "object") {
        errors.push(`End node at index ${index} must be an object`);
        return;
      }

      const node = endNode as Record<string, unknown>;
      if (!node.id || typeof node.id !== "string") {
        errors.push(`End node[${index}] missing valid 'id' field`);
      }
      if (node.type !== "end") {
        errors.push(`End node[${index}] must have type 'end'`);
      }
      if (!node.outcome || (node.outcome !== "success" && node.outcome !== "failure")) {
        errors.push(`End node[${index}] must have 'outcome' field with value "success" or "failure"`);
      }
      if (typeof node.x !== "number") {
        errors.push(`End node[${index}] missing valid 'x' coordinate`);
      }
      if (typeof node.y !== "number") {
        errors.push(`End node[${index}] missing valid 'y' coordinate`);
      }
      if (typeof node.width !== "number") {
        errors.push(`End node[${index}] missing valid 'width'`);
      }
      if (typeof node.height !== "number") {
        errors.push(`End node[${index}] missing valid 'height'`);
      }
    });
  }

  // Validate nodes object (IntermediateNode)
  if (!challenge.nodes || typeof challenge.nodes !== "object" || Array.isArray(challenge.nodes)) {
    errors.push("Missing or invalid 'nodes' field (must be object)");
  } else {
    Object.entries(challenge.nodes as Record<string, unknown>).forEach(([nodeId, node]) => {
      if (!node || typeof node !== "object") {
        errors.push(`Node '${nodeId}' must be an object`);
        return;
      }

      const nodeObj = node as Record<string, unknown>;

      if (nodeObj.type === "node") {
        // Validate required IntermediateNode fields
        if (!nodeObj.id || typeof nodeObj.id !== "string") {
          errors.push(`Node '${nodeId}' missing valid 'id' field`);
        }
        if (!nodeObj.title || typeof nodeObj.title !== "string") {
          errors.push(`Node '${nodeId}' missing valid 'title' field`);
        }
        if (typeof nodeObj.description !== "string") {
          errors.push(`Node '${nodeId}' missing valid 'description' field`);
        }

        // Validate position and dimensions
        if (typeof nodeObj.x !== "number") {
          errors.push(`Node '${nodeId}' missing valid 'x' coordinate`);
        }
        if (typeof nodeObj.y !== "number") {
          errors.push(`Node '${nodeId}' missing valid 'y' coordinate`);
        }
        if (typeof nodeObj.width !== "number") {
          errors.push(`Node '${nodeId}' missing valid 'width'`);
        }
        if (typeof nodeObj.height !== "number") {
          errors.push(`Node '${nodeId}' missing valid 'height'`);
        }

        // Validate effects arrays
        if (!Array.isArray(nodeObj.entryEffects)) {
          errors.push(`Node '${nodeId}' missing 'entryEffects' array`);
        }
        if (!Array.isArray(nodeObj.exitEffects)) {
          errors.push(`Node '${nodeId}' missing 'exitEffects' array`);
        }
        if (!Array.isArray(nodeObj.events)) {
          errors.push(`Node '${nodeId}' missing 'events' array`);
        }

        // Validate success/failure references (MUST be strings, not objects)
        if (nodeObj.success === undefined) {
          errors.push(`Node '${nodeId}' missing 'success' field`);
        } else if (typeof nodeObj.success !== "string") {
          errors.push(`Node '${nodeId}': 'success' must be a string ID reference, not an object (old format not supported)`);
        }

        if (nodeObj.failure === undefined) {
          errors.push(`Node '${nodeId}' missing 'failure' field`);
        } else if (typeof nodeObj.failure !== "string") {
          errors.push(`Node '${nodeId}': 'failure' must be a string ID reference, not an object (old format not supported)`);
        }

        // Validate timeOut (can be null or TimeOut object)
        if (nodeObj.timeOut !== null && typeof nodeObj.timeOut !== "object") {
          errors.push(`Node '${nodeId}' 'timeOut' must be null or an object`);
        }
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
export const getChallengeImportFileSizeEstimate = (file: File): string => {
  const bytes = file.size;

  if (bytes < 1024) return `${bytes} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
