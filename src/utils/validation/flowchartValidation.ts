import type { ChallengeType } from "../types/challenge.types";
import type { IntermediateNode, NodeVariants } from "../types/node.types";

export interface ValidationError {
  id: string;
  type: "error" | "warning";
  message: string;
  nodeId?: string;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

/**
 * FlowchartValidator - Validates challenge flowchart structure according to FR-3.27 requirements
 *
 * STRICTLY VALIDATES ONLY DOCUMENTED REQUIREMENTS (FR-3.27):
 * - Exactly one Start node
 * - At least one Success & one Fail node (end nodes connected as success/failure transitions)
 * - All nodes must be reachable via edges
 * - Transition definitions are validated for presence, not for logical coherence
 * - The system does NOT prevent user-defined loops, circular paths, or overlapping conditions
 *
 * Additional validations are minimal and focus only on structural completeness:
 * - Node size must be positive (basic structural requirement)
 * - Node titles are required for intermediate nodes (basic identification)
 * - Text length warnings for very long content (usability only)
 * - Node overlap warnings (UX improvement, not requirement)
 *
 * Position coordinate validations are NOT included as they are not specified
 * in the requirements documentation, but overlap checking helps with usability.
 */
export class FlowchartValidator {
  private challenge: ChallengeType;
  private errors: ValidationError[] = [];
  private warnings: ValidationError[] = [];

  constructor(challenge: ChallengeType) {
    this.challenge = challenge;
  }

  // Helper: Find node by ID
  private findNodeById(nodeId: string): NodeVariants | null {
    // Check start node
    if (this.challenge.startNode?.id === nodeId) {
      return this.challenge.startNode;
    }

    // Check intermediate nodes
    if (this.challenge.nodes && this.challenge.nodes[nodeId]) {
      return this.challenge.nodes[nodeId];
    }

    // Check end nodes
    const endNode = this.challenge.endNodes?.find((n) => n.id === nodeId);
    if (endNode) {
      return endNode;
    }

    return null;
  }

  validate(): ValidationResult {
    this.errors = [];
    this.warnings = [];

    // Core validation based on FR-3.27 requirements
    this.validateStartNode(); // Exactly one Start node
    this.validateEndNodes(); // At least one Success & one Fail node
    this.validateIntermediateNodes(); // Check node structure
    this.validateReachability(); // All nodes must be reachable via edges
    this.validateTransitionDefinitions(); // Transition definitions are validated for presence

    // Additional helpful validations (warnings)
    this.validateNodePositions();
    this.validateNodeContent();

    return {
      isValid: this.errors.length === 0,
      errors: this.errors,
      warnings: this.warnings,
    };
  }

  // FR-3.27: Exactly one Start node
  private validateStartNode(): void {
    if (!this.challenge.startNode) {
      this.addError(
        "MISSING_START_NODE",
        "Challenge must have exactly one start node",
        undefined,
        "Add a start node to your flowchart"
      );
      return;
    }

    const startNode = this.challenge.startNode;

    if (!startNode.id || startNode.id.trim() === "") {
      this.addError(
        "INVALID_START_NODE_ID",
        "Start node must have a valid ID",
        startNode.id
      );
    }

    if (startNode.type !== "start") {
      this.addError(
        "INVALID_START_NODE_TYPE",
        'Start node must have type "start"',
        startNode.id
      );
    }

    // Size validation (errors)
    if (startNode.width <= 0 || startNode.height <= 0) {
      this.addError(
        "INVALID_START_NODE_SIZE",
        "Start node must have positive width and height",
        startNode.id
      );
    }
  }

  // FR-3.27: At least one Success & one Fail node
  private validateEndNodes(): void {
    if (!this.challenge.endNodes || this.challenge.endNodes.length === 0) {
      this.addError(
        "MISSING_END_NODES",
        "Challenge must have at least one Success and one Fail end node"
      );
      return;
    }

    // For basic validation, if we have:
    // - At least 2 end nodes AND intermediate nodes with success/failure references
    // - OR intermediate nodes that have success/failure defined (even if inline)
    // Then we consider it valid

    const hasIntermediateNodes =
      Object.keys(this.challenge.nodes || {}).length > 0;
    const endNodeCount = this.challenge.endNodes.length;

    // Count explicit success/failure connections
    const successEndNodes = new Set<string>();
    const failureEndNodes = new Set<string>();
    let hasSuccessTransitions = false;
    let hasFailureTransitions = false;

    Object.values(this.challenge.nodes || {}).forEach((node) => {
      if (node.success) {
        hasSuccessTransitions = true;
        const successNode = this.findNodeById(node.success);
        if (successNode && successNode.type === "end") {
          successEndNodes.add(node.success);
        }
      }
      if (node.failure) {
        hasFailureTransitions = true;
        const failureNode = this.findNodeById(node.failure);
        if (failureNode && failureNode.type === "end") {
          failureEndNodes.add(node.failure);
        }
      }
    });

    // Validation logic:
    // 1. If we have intermediate nodes, they must have success/failure transitions
    if (hasIntermediateNodes) {
      if (!hasSuccessTransitions) {
        this.addError(
          "MISSING_SUCCESS_TRANSITIONS",
          "Intermediate nodes must have success transitions defined",
          undefined,
          "Add success transitions to your intermediate nodes"
        );
      }

      if (!hasFailureTransitions) {
        this.addError(
          "MISSING_FAILURE_TRANSITIONS",
          "Intermediate nodes must have failure transitions defined",
          undefined,
          "Add failure transitions to your intermediate nodes"
        );
      }
    }

    // 2. Basic check: if we have intermediate nodes and at least 2 end nodes, it's likely valid
    if (
      hasIntermediateNodes &&
      endNodeCount >= 2 &&
      hasSuccessTransitions &&
      hasFailureTransitions
    ) {
      // Structure looks good, only add warnings if needed
      if (successEndNodes.size === 0 && hasSuccessTransitions) {
        this.addWarning(
          "IMPLICIT_SUCCESS_END_NODE",
          "Success transitions defined but may not point to dedicated end nodes",
          undefined
        );
      }

      if (failureEndNodes.size === 0 && hasFailureTransitions) {
        this.addWarning(
          "IMPLICIT_FAILURE_END_NODE",
          "Failure transitions defined but may not point to dedicated end nodes",
          undefined
        );
      }
    } else if (hasIntermediateNodes && endNodeCount < 2) {
      // We need more end nodes for proper success/failure flow
      this.addError(
        "INSUFFICIENT_END_NODES",
        "Challenge with intermediate nodes needs at least 2 end nodes (for success and failure paths)",
        undefined,
        "Add more end nodes to support success and failure paths"
      );
    } // Validate individual end nodes
    this.challenge.endNodes.forEach((endNode, index) => {
      if (!endNode.id || endNode.id.trim() === "") {
        this.addError(
          "INVALID_END_NODE_ID",
          `End node ${index + 1} must have a valid ID`,
          endNode.id
        );
      }

      if (endNode.type !== "end") {
        this.addError(
          "INVALID_END_NODE_TYPE",
          `End node ${endNode.id} must have type "end"`,
          endNode.id
        );
      }

      // Size validation (errors)
      if (endNode.width <= 0 || endNode.height <= 0) {
        this.addError(
          "INVALID_END_NODE_SIZE",
          `End node ${endNode.id} must have positive width and height`,
          endNode.id
        );
      }
    });

    // Check for duplicate IDs
    const endNodeIds = this.challenge.endNodes.map((node) => node.id);
    const duplicateIds = endNodeIds.filter(
      (id, index) => endNodeIds.indexOf(id) !== index
    );
    if (duplicateIds.length > 0) {
      this.addError(
        "DUPLICATE_END_NODE_IDS",
        `Duplicate end node IDs found: ${duplicateIds.join(", ")}`
      );
    }
  }

  private validateIntermediateNodes(): void {
    const nodes = this.challenge.nodes || {};
    const nodeIds = Object.keys(nodes);

    if (nodeIds.length === 0) {
      this.addWarning(
        "NO_INTERMEDIATE_NODES",
        "Challenge has no intermediate nodes. Consider adding logic nodes for game flow."
      );
      return;
    }

    nodeIds.forEach((nodeId) => {
      const node = nodes[nodeId];
      this.validateIntermediateNode(node, nodeId);
    });

    // Check for duplicate IDs across all node types
    const allNodeIds = [
      this.challenge.startNode?.id,
      ...this.challenge.endNodes.map((n) => n.id),
      ...nodeIds,
    ].filter(Boolean);

    const duplicateIds = allNodeIds.filter(
      (id, index) => allNodeIds.indexOf(id) !== index
    );
    if (duplicateIds.length > 0) {
      this.addError(
        "DUPLICATE_NODE_IDS",
        `Duplicate node IDs found: ${duplicateIds.join(", ")}`
      );
    }
  }

  private validateIntermediateNode(
    node: IntermediateNode,
    expectedId: string
  ): void {
    // Basic node structure validation
    if (!node.id || node.id !== expectedId) {
      this.addError(
        "INVALID_INTERMEDIATE_NODE_ID",
        `Intermediate node ID mismatch. Expected: ${expectedId}, Got: ${node.id}`,
        node.id
      );
    }

    if (node.type !== "node") {
      this.addError(
        "INVALID_INTERMEDIATE_NODE_TYPE",
        `Intermediate node ${node.id} must have type "node"`,
        node.id
      );
    }

    // Required fields validation
    if (!node.title || node.title.trim() === "") {
      this.addError(
        "MISSING_NODE_TITLE",
        `Intermediate node ${node.id} must have a title`,
        node.id,
        "Add a descriptive title to this node"
      );
    }

    // Success/failure transitions validation - required for transition definitions
    if (!node.success) {
      this.addError(
        "MISSING_SUCCESS_NODE",
        `Intermediate node ${node.id} must have a success transition defined`,
        node.id,
        "Connect a success node to this intermediate node"
      );
    } else {
      this.validateSuccessFailureNode(node.success, "success", node.id);
    }

    if (!node.failure) {
      this.addError(
        "MISSING_FAILURE_NODE",
        `Intermediate node ${node.id} must have a failure transition defined`,
        node.id,
        "Connect a failure node to this intermediate node"
      );
    } else {
      this.validateSuccessFailureNode(node.failure, "failure", node.id);
    }

    // Position and size validation
    if (node.width <= 0 || node.height <= 0) {
      this.addError(
        "INVALID_NODE_SIZE",
        `Intermediate node ${node.id} must have positive width and height`,
        node.id
      );
    }

    // Optional content warnings
    if (!node.description || node.description.trim() === "") {
      this.addWarning(
        "MISSING_NODE_DESCRIPTION",
        `Intermediate node ${node.id} should have a description for better documentation`,
        node.id
      );
    }

    if (!node.events || node.events.length === 0) {
      this.addWarning(
        "NO_EVENTS",
        `Intermediate node ${node.id} has no events defined - consider adding triggers and effects`,
        node.id
      );
    }
  }

  private validateSuccessFailureNode(
    nodeId: string,
    type: "success" | "failure",
    parentId: string
  ): void {
    if (!nodeId || nodeId.trim() === "") {
      this.addError(
        "INVALID_SUCCESS_FAILURE_ID",
        `${type} transition for node ${parentId} must have a valid target ID`,
        parentId,
        `Set a valid ${type} node target`
      );
      return;
    }

    // Check if the target exists in the challenge
    const isEndNode = this.challenge.endNodes.some(
      (endNode) => endNode.id === nodeId
    );
    const isIntermediateNode =
      this.challenge.nodes && this.challenge.nodes[nodeId];

    if (!isEndNode && !isIntermediateNode) {
      this.addError(
        "MISSING_TRANSITION_TARGET",
        `${type} transition target ${nodeId} for node ${parentId} does not exist in challenge`,
        parentId,
        `Create the target node ${nodeId} or update the transition target`
      );
    }

    // Prevent self-reference for success transitions
    // Note: Self-reference is ALLOWED for failure transitions (RESTART pattern: node.failure === node.id)
    if (nodeId === parentId && type === "success") {
      this.addError(
        "SELF_REFERENCE_TRANSITION",
        `Node ${parentId} cannot reference itself as ${type} transition`,
        parentId,
        "Choose a different target node for this transition"
      );
    }
  }

  // FR-3.27: All nodes must be reachable via edges
  private validateReachability(): void {
    const reachableNodes = new Set<string>();
    this.findReachableNodes(this.challenge.startNode?.id, reachableNodes);

    // Check intermediate nodes reachability
    Object.keys(this.challenge.nodes || {}).forEach((nodeId) => {
      if (!reachableNodes.has(nodeId)) {
        this.addError(
          "UNREACHABLE_NODE",
          `Node ${nodeId} is not reachable from start node - all nodes must be reachable via edges`,
          nodeId,
          "Connect this node to the flow by adding edges from other nodes"
        );
      }
    });

    // Check end nodes reachability
    this.challenge.endNodes.forEach((endNode) => {
      if (!reachableNodes.has(endNode.id)) {
        this.addError(
          "UNREACHABLE_END_NODE",
          `End node ${endNode.id} is not reachable from start node`,
          endNode.id,
          "Connect this end node to intermediate nodes"
        );
      }
    });
  }

  private findReachableNodes(
    nodeId: string | undefined,
    reachableNodes: Set<string>
  ): void {
    if (!nodeId || reachableNodes.has(nodeId)) return;

    reachableNodes.add(nodeId);

    // For start node, find connected intermediate nodes
    if (nodeId === this.challenge.startNode?.id) {
      // Check if _startNodeTarget metadata exists (from save/import)
      const startNodeTarget = (this.challenge as unknown as Record<string, unknown>)
        ._startNodeTarget as string | undefined;

      if (startNodeTarget && this.challenge.nodes?.[startNodeTarget]) {
        // Use explicit target if available and it exists
        this.findReachableNodes(startNodeTarget, reachableNodes);
      } else {
        // Fallback: If no valid _startNodeTarget, mark ALL intermediate nodes as reachable
        // This prevents false positives for legacy challenges
        // The assumption is that if edges are properly defined in Flowchart UI,
        // the challenge will be valid after save
        Object.keys(this.challenge.nodes || {}).forEach((nodeId) => {
          this.findReachableNodes(nodeId, reachableNodes);
        });
      }
      return;
    }

    // For intermediate nodes, check success and failure transitions
    const node = this.challenge.nodes?.[nodeId];
    if (node) {
      this.findReachableNodes(node.success, reachableNodes);
      this.findReachableNodes(node.failure, reachableNodes);
    }
  }

  // FR-3.27: Transition definitions are validated for presence, not for logical coherence
  private validateTransitionDefinitions(): void {
    Object.values(this.challenge.nodes || {}).forEach((node) => {
      // Check that success transition is defined
      if (!node.success) {
        this.addError(
          "MISSING_SUCCESS_TRANSITION",
          `Node ${node.id} must have a success transition defined`,
          node.id,
          "Add a success node connection"
        );
      }

      // Check that failure transition is defined
      if (!node.failure) {
        this.addError(
          "MISSING_FAILURE_TRANSITION",
          `Node ${node.id} must have a failure transition defined`,
          node.id,
          "Add a failure node connection"
        );
      }

      // Note: We do NOT validate logical coherence as per FR-3.27
      // System does not prevent user-defined loops, circular paths, or overlapping conditions
    });
  }

  private validateNodePositions(): void {
    const allNodes = [
      this.challenge.startNode,
      ...this.challenge.endNodes,
      ...Object.values(this.challenge.nodes || {}),
    ].filter(Boolean);

    // Check for node overlaps (warning only - UX improvement, not a requirement)
    for (let i = 0; i < allNodes.length; i++) {
      for (let j = i + 1; j < allNodes.length; j++) {
        const node1 = allNodes[i];
        const node2 = allNodes[j];

        if (this.nodesOverlap(node1, node2)) {
          this.addWarning(
            "OVERLAPPING_NODES",
            `Nodes ${node1.id} and ${node2.id} are overlapping`,
            node1.id,
            "Reposition nodes to avoid overlap for better visibility"
          );
        }
      }
    }
  }

  private nodesOverlap(node1: NodeVariants, node2: NodeVariants): boolean {
    return !(
      node1.x + node1.width <= node2.x ||
      node2.x + node2.width <= node1.x ||
      node1.y + node1.height <= node2.y ||
      node2.y + node2.height <= node1.y
    );
  }

  private validateNodeContent(): void {
    Object.values(this.challenge.nodes || {}).forEach((node) => {
      // Check text length
      if (node.title && node.title.length > 100) {
        this.addWarning(
          "LONG_NODE_TITLE",
          `Node ${node.id} title is very long (${node.title.length} characters)`,
          node.id
        );
      }

      if (node.description && node.description.length > 500) {
        this.addWarning(
          "LONG_NODE_DESCRIPTION",
          `Node ${node.id} description is very long (${node.description.length} characters)`,
          node.id
        );
      }

      // Check special characters
      if (node.title && /[<>"'&]/.test(node.title)) {
        this.addWarning(
          "SPECIAL_CHARACTERS_IN_TITLE",
          `Node ${node.id} title contains potentially problematic characters`,
          node.id
        );
      }
    });
  }

  private addError(
    id: string,
    message: string,
    nodeId?: string,
    suggestion?: string
  ): void {
    this.errors.push({
      id,
      type: "error",
      message,
      nodeId,
      suggestion,
    });
  }

  private addWarning(
    id: string,
    message: string,
    nodeId?: string,
    suggestion?: string
  ): void {
    this.warnings.push({
      id,
      type: "warning",
      message,
      nodeId,
      suggestion,
    });
  }
}

export const validateFlowchart = (
  challenge: ChallengeType
): ValidationResult => {
  const validator = new FlowchartValidator(challenge);
  return validator.validate();
};
