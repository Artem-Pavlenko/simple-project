import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { ChallengeType } from "../../../../utils/types/challenge.types";
import type {
  IntermediateNode,
  IEndNode,
} from "../../../../utils/types/node.types";

/**
 * Hook for building ChallengeType from ReactFlow state
 * Converts flowNodes and flowEdges back to challenge structure
 */
export const useChallengeBuilder = (
  challenge: ChallengeType | null | undefined,
  flowNodes: Node[],
  flowEdges: Edge[]
) => {
  const buildCurrentChallenge = useCallback((): ChallengeType | null => {
    if (!challenge) return null;

    // Build current state from flowNodes
    const currentNodes: Record<string, IntermediateNode> = {};
    let currentStartNode = challenge.startNode;
    const currentEndNodes: IEndNode[] = [];

    flowNodes.forEach((node) => {
      if (node.data.type === "start" && challenge.startNode) {
        // Update start node coordinates
        currentStartNode = {
          ...challenge.startNode,
          x: node.position.x,
          y: node.position.y,
        };
      } else if (node.data.type === "end") {
        // Add end node with outcome
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
        currentEndNodes.push(endNode);
      } else if (node.data.type === "node" && node.data.nodeData) {
        // Add intermediate node with success/failure as string IDs
        const nodeData = node.data.nodeData as IntermediateNode;

        // Find success and failure connections from edges
        const successEdge = flowEdges.find(
          (edge) => edge.source === node.id && edge.sourceHandle === "success"
        );
        const failureEdge = flowEdges.find(
          (edge) => edge.source === node.id && edge.sourceHandle === "failure"
        );

        // Use edge targets as string IDs, or fall back to nodeData
        currentNodes[node.id] = {
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
    if (firstNodeId && currentNodes[firstNodeId]) {
      orderedNodes[firstNodeId] = currentNodes[firstNodeId];
    }
    // Add remaining nodes
    Object.keys(currentNodes).forEach((nodeId) => {
      if (nodeId !== firstNodeId) {
        orderedNodes[nodeId] = currentNodes[nodeId];
      }
    });

    const updatedChallenge = {
      ...challenge,
      startNode: currentStartNode,
      nodes: orderedNodes,
      endNodes: currentEndNodes,
    };

    // Preserve _startNodeTarget metadata for correct Start node connection after database round-trip
    if (firstNodeId) {
      (updatedChallenge as Record<string, unknown>)._startNodeTarget =
        firstNodeId;
    }

    return updatedChallenge;
  }, [challenge, flowNodes, flowEdges]);

  return { buildCurrentChallenge };
};
