import { useMemo } from "react";
import type { Edge } from "@xyflow/react";
import type { ChallengeType } from "../../../../utils/types/challenge.types";
import type { IntermediateNode } from "../../../../utils/types/node.types";

/**
 * Hook for building ReactFlow edges from challenge data
 * Handles Start node connection and intermediate node success/failure edges
 */
export const useFlowchartEdges = (
  challenge: ChallengeType | null | undefined
): Edge[] => {
  return useMemo((): Edge[] => {
    const edges: Edge[] = [];
    if (!challenge) return edges;

    // Connect startNode to first intermediate node (if exists)
    // Use _startNodeTarget if available (from import), otherwise fall back to first node
    const nodeIds = Object.keys(challenge.nodes || {});
    const startNodeTarget = (challenge as unknown as Record<string, unknown>)
      ._startNodeTarget as string | undefined;
    const firstNodeId = startNodeTarget || nodeIds[0];

    if (challenge.startNode && firstNodeId && nodeIds.length > 0) {
      edges.push({
        id: `e-start-${firstNodeId}`,
        source: challenge.startNode.id,
        target: firstNodeId,
        style: { stroke: "#3b82f6", strokeWidth: 2 },
        markerEnd: {
          type: "arrowclosed",
          color: "#3b82f6",
        },
      });
    }

    // For each intermediate node, connect success/failure based on their string ID references
    Object.values(challenge.nodes || {}).forEach((node) => {
      const typedNode = node as IntermediateNode;

      // Add success edge only if it's not self-reference
      if (typedNode.success && typedNode.success !== typedNode.id) {
        edges.push({
          id: `e-${typedNode.id}-success-${typedNode.success}`,
          source: typedNode.id,
          target: typedNode.success,
          sourceHandle: "success",
          label: "Success",
          style: { stroke: "#22c55e", strokeWidth: 2 },
          markerEnd: {
            type: "arrowclosed",
            color: "#22c55e",
          },
        });
      }

      // Add failure edge only if it's not self-reference (RESTART)
      if (typedNode.failure && typedNode.failure !== typedNode.id) {
        edges.push({
          id: `e-${typedNode.id}-failure-${typedNode.failure}`,
          source: typedNode.id,
          target: typedNode.failure,
          sourceHandle: "failure",
          label: "Failure",
          style: { stroke: "#ef4444", strokeWidth: 2 },
          markerEnd: {
            type: "arrowclosed",
            color: "#ef4444",
          },
        });
      }
    });

    return edges;
  }, [challenge]);
};
