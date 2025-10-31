/**
 * Validation utilities and helper functions
 */

import type { ChallengeType } from "../types/challenge.types";
import type { NodeVariants } from "../types/node.types";

/**
 * Check if a node ID is unique within the challenge
 */
export const isNodeIdUnique = (
  nodeId: string,
  challenge: ChallengeType
): boolean => {
  const allNodeIds = [
    challenge.startNode?.id,
    ...challenge.endNodes.map((node) => node.id),
    ...Object.keys(challenge.nodes || {}),
  ].filter(Boolean);

  return allNodeIds.filter((id) => id === nodeId).length <= 1;
};

/**
 * Get all nodes referenced by success/failure transitions
 */
export const getReferencedNodeIds = (challenge: ChallengeType): Set<string> => {
  const referencedIds = new Set<string>();

  Object.values(challenge.nodes || {}).forEach((node) => {
    if (node.success) {
      referencedIds.add(node.success);
    }
    if (node.failure) {
      referencedIds.add(node.failure);
    }
  });

  return referencedIds;
};

/**
 * Check if two nodes overlap in position
 * Useful for UX warnings about node visibility
 */
export const doNodesOverlap = (
  node1: NodeVariants,
  node2: NodeVariants
): boolean => {
  return !(
    node1.x + node1.width <= node2.x ||
    node2.x + node2.width <= node1.x ||
    node1.y + node1.height <= node2.y ||
    node2.y + node2.height <= node1.y
  );
};

/**
 * Find all nodes that are reachable from a starting node
 */
export const findReachableNodeIds = (
  startNodeId: string | undefined,
  challenge: ChallengeType
): Set<string> => {
  const reachable = new Set<string>();

  if (!startNodeId) return reachable;

  const toVisit = [startNodeId];

  while (toVisit.length > 0) {
    const currentId = toVisit.pop()!;

    if (reachable.has(currentId)) continue;
    reachable.add(currentId);

    // For start node, add first intermediate node
    if (currentId === challenge.startNode?.id) {
      const firstIntermediateId = Object.keys(challenge.nodes || {})[0];
      if (firstIntermediateId && !reachable.has(firstIntermediateId)) {
        toVisit.push(firstIntermediateId);
      }
      continue;
    }

    // For intermediate nodes, add success and failure targets
    const node = challenge.nodes?.[currentId];
    if (node) {
      if (node.success && !reachable.has(node.success)) {
        toVisit.push(node.success);
      }
      if (node.failure && !reachable.has(node.failure)) {
        toVisit.push(node.failure);
      }
    }
  }

  return reachable;
};

/**
 * Categorize end nodes into success and failure nodes based on how they're connected
 */
export const categorizeEndNodes = (
  challenge: ChallengeType
): {
  successNodes: Set<string>;
  failureNodes: Set<string>;
} => {
  const successNodes = new Set<string>();
  const failureNodes = new Set<string>();

  Object.values(challenge.nodes || {}).forEach((node) => {
    // Find the success node by ID
    const successNode = getNodeById(node.success, challenge);
    if (successNode && successNode.type === "end") {
      successNodes.add(node.success);
    }

    // Find the failure node by ID
    const failureNode = getNodeById(node.failure, challenge);
    if (failureNode && failureNode.type === "end") {
      failureNodes.add(node.failure);
    }
  });

  return { successNodes, failureNodes };
};

/**
 * Check if a node exists in the challenge
 */
export const nodeExists = (
  nodeId: string,
  challenge: ChallengeType
): boolean => {
  if (challenge.startNode?.id === nodeId) return true;
  if (challenge.endNodes.some((node) => node.id === nodeId)) return true;
  if (challenge.nodes?.[nodeId]) return true;
  return false;
};

/**
 * Get node by ID from challenge
 */
export const getNodeById = (
  nodeId: string,
  challenge: ChallengeType
): NodeVariants | null => {
  if (challenge.startNode?.id === nodeId) return challenge.startNode;

  const endNode = challenge.endNodes.find((node) => node.id === nodeId);
  if (endNode) return endNode;

  const intermediateNode = challenge.nodes?.[nodeId];
  if (intermediateNode) return intermediateNode;

  return null;
};

/**
 * Validate node size is reasonable (must be positive)
 */
export const isValidSize = (width: number, height: number): boolean => {
  return width > 0 && height > 0;
};

/**
 * Check if text length is reasonable for UI display
 */
export const isReasonableTextLength = (
  text: string,
  maxLength: number
): boolean => {
  return text.length <= maxLength;
};

/**
 * Count total number of validation issues
 */
export const countValidationIssues = (
  errors: unknown[],
  warnings: unknown[]
): number => {
  return errors.length + warnings.length;
};

/**
 * Generate a unique node ID
 */
export const generateUniqueNodeId = (
  challenge: ChallengeType,
  prefix: string = "node"
): string => {
  let counter = 1;
  let nodeId = `${prefix}-${counter}`;

  while (!isNodeIdUnique(nodeId, challenge)) {
    counter++;
    nodeId = `${prefix}-${counter}`;
  }

  return nodeId;
};

/**
 * Check if challenge has minimum viable structure
 */
export const hasMinimumViableStructure = (
  challenge: ChallengeType
): boolean => {
  const hasStartNode = !!challenge.startNode;
  const hasEndNodes = challenge.endNodes && challenge.endNodes.length > 0;
  const { successNodes, failureNodes } = categorizeEndNodes(challenge);
  const hasSuccessNode = successNodes.size > 0;
  const hasFailureNode = failureNodes.size > 0;

  return hasStartNode && hasEndNodes && hasSuccessNode && hasFailureNode;
};

/**
 * Calculate flowchart statistics
 */
export const getFlowchartStats = (challenge: ChallengeType) => {
  const intermediateNodeCount = Object.keys(challenge.nodes || {}).length;
  const endNodeCount = challenge.endNodes.length;
  const totalNodeCount = 1 + intermediateNodeCount + endNodeCount; // +1 for start node

  const { successNodes, failureNodes } = categorizeEndNodes(challenge);
  const reachableNodes = findReachableNodeIds(
    challenge.startNode?.id,
    challenge
  );
  const unreachableCount = totalNodeCount - reachableNodes.size;

  return {
    totalNodes: totalNodeCount,
    startNodes: challenge.startNode ? 1 : 0,
    intermediateNodes: intermediateNodeCount,
    endNodes: endNodeCount,
    successEndNodes: successNodes.size,
    failureEndNodes: failureNodes.size,
    reachableNodes: reachableNodes.size,
    unreachableNodes: unreachableCount,
  };
};

/**
 * Format validation message with context
 */
export const formatValidationMessage = (
  message: string,
  nodeId?: string,
  context?: string
): string => {
  let formattedMessage = message;

  if (nodeId) {
    formattedMessage += ` (Node: ${nodeId})`;
  }

  if (context) {
    formattedMessage += ` - ${context}`;
  }

  return formattedMessage;
};
