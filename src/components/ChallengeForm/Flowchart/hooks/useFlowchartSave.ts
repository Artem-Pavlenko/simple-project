import { useCallback, useState } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { ChallengeType } from "../../../../utils/types/challenge.types";
import type { AdventureType } from "../../../../utils/types/adventure.types";
import type {
  IntermediateNode,
  IEndNode,
} from "../../../../utils/types/node.types";
import { challengeToasts } from "../../../../utils/toast";
import { validateFlowchart } from "../../../../utils/validation/flowchartValidation";

interface UseFlowchartSaveProps {
  challenge: ChallengeType | null | undefined;
  adventure: AdventureType | undefined;
  onUpdateAdventure?: (updatedAdventure: AdventureType) => Promise<void>;
  flowNodes: Node[];
  flowEdges: Edge[];
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedNodeId: React.Dispatch<React.SetStateAction<string | null>>;
  saveVersionToHistory?: (challenge: ChallengeType, isAutosave: boolean) => void;
}

/**
 * Hook for saving flowchart changes to database
 * Converts flow state to challenge and updates via onUpdateAdventure
 */
export const useFlowchartSave = ({
  challenge,
  adventure,
  onUpdateAdventure,
  flowNodes,
  flowEdges,
  hasUnsavedChanges,
  setHasUnsavedChanges,
  setSelectedNodeId,
  saveVersionToHistory,
}: UseFlowchartSaveProps) => {
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = useCallback(
    async (isAutosave: boolean = false) => {
      if (
        !adventure ||
        !challenge ||
        !onUpdateAdventure ||
        !hasUnsavedChanges
      ) {
        return;
      }

      setIsSaving(true);
      if (!isAutosave) {
        setSelectedNodeId(null); // Close NodeEditor during manual saving
      }

      try {
        // Build updated challenge from current flow state
        const updatedNodes: Record<string, IntermediateNode> = {};
        let updatedStartNode = challenge.startNode;
        const updatedEndNodes: IEndNode[] = [];

        flowNodes.forEach((node) => {
          if (node.data.type === "start" && challenge.startNode) {
            // Update start node coordinates
            updatedStartNode = {
              ...challenge.startNode,
              x: node.position.x,
              y: node.position.y,
            };
          } else if (node.data.type === "end") {
            // Update end node with outcome
            const endNodeData = node.data.nodeData as IEndNode;
            const endNode: IEndNode = {
              id: node.id,
              type: "end",
              x: node.position.x,
              y: node.position.y,
              width: (node.style?.width as number) || 120,
              height: (node.style?.height as number) || 60,
              outcome: endNodeData?.outcome || "success",
            };
            updatedEndNodes.push(endNode);
          } else if (node.data.type === "node" && node.data.nodeData) {
            // Update intermediate node with success/failure as string IDs
            const nodeData = node.data.nodeData as IntermediateNode;

            // Find success and failure connections from edges
            const successEdge = flowEdges.find(
              (edge) =>
                edge.source === node.id && edge.sourceHandle === "success"
            );
            const failureEdge = flowEdges.find(
              (edge) =>
                edge.source === node.id && edge.sourceHandle === "failure"
            );

            // Use edge targets as string IDs, or fall back to nodeData
            updatedNodes[node.id] = {
              ...nodeData,
              x: node.position.x,
              y: node.position.y,
              title: node.data.label as string,
              success: successEdge?.target || nodeData.success,
              failure: failureEdge?.target || nodeData.failure,
            };
          }
        });

        // Reorder nodes so the first node is the one connected to Start
        const startEdge = flowEdges.find(
          (edge) => edge.source === challenge.startNode?.id
        );
        const firstNodeId = startEdge?.target;

        // Rebuild nodes object with first node first
        const orderedNodes: Record<string, IntermediateNode> = {};
        if (firstNodeId && updatedNodes[firstNodeId]) {
          orderedNodes[firstNodeId] = updatedNodes[firstNodeId];
        }
        // Add remaining nodes
        Object.keys(updatedNodes).forEach((nodeId) => {
          if (nodeId !== firstNodeId) {
            orderedNodes[nodeId] = updatedNodes[nodeId];
          }
        });

        let updatedChallenge: ChallengeType = {
          ...challenge,
          startNode: updatedStartNode,
          nodes: orderedNodes,
          endNodes: updatedEndNodes,
          updated_at: new Date().toISOString(),
        };

        // Preserve _startNodeTarget metadata
        if (firstNodeId) {
          (updatedChallenge as Record<string, unknown>)._startNodeTarget =
            firstNodeId;
        }

        // Validate the challenge and auto-change tag to "Draft" if invalid
        const validationResult = validateFlowchart(updatedChallenge);
        if (!validationResult.isValid && updatedChallenge.tag === "Final") {
          // Challenge is invalid but was marked as "Final" - change to "Draft"
          updatedChallenge = {
            ...updatedChallenge,
            tag: "Draft",
          };
          // Show warning toast about auto-change
          challengeToasts.tagChangedToDraft();
        }

        const updatedAdventure: AdventureType = {
          ...adventure,
          challenges: {
            ...adventure.challenges,
            [updatedChallenge.id]: updatedChallenge,
          },
        };

        await onUpdateAdventure(updatedAdventure);
        setHasUnsavedChanges(false);

        // Save to version history AFTER successful save to server
        // Store the successfully saved state for potential rollback
        if (saveVersionToHistory) {
          saveVersionToHistory(updatedChallenge, isAutosave);
        }

        // Show toast only for autosave
        if (isAutosave) {
          challengeToasts.saveSuccess();
        }
      } catch (error) {
        console.error("Failed to save changes:", error);

        // Show toast for autosave errors
        if (isAutosave) {
          challengeToasts.saveError(
            error instanceof Error ? error.message : undefined
          );
        }
      } finally {
        setIsSaving(false);
      }
    },
    [
      adventure,
      challenge,
      onUpdateAdventure,
      hasUnsavedChanges,
      flowNodes,
      flowEdges,
      setIsSaving,
      setHasUnsavedChanges,
      setSelectedNodeId,
      saveVersionToHistory,
    ]
  );

  return {
    isSaving,
    handleSaveChanges,
  };
};
