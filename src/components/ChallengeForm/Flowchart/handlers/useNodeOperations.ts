import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import type {
  IntermediateNode,
  IEndNode,
  NodeVariants,
} from "../../../../utils/types/node.types";
import { nodeToReactFlow } from "../utils/nodeConverters";

interface UseNodeOperationsProps {
  flowNodes: Node[];
  flowEdges: Edge[];
  setFlowNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setFlowEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Hook for node CRUD operations
 * Handles add, delete, copy, and convert operations
 */
export const useNodeOperations = ({
  flowNodes,
  flowEdges,
  setFlowNodes,
  setFlowEdges,
  setHasUnsavedChanges,
}: UseNodeOperationsProps) => {
  // Delete node handler (with recursive cleanup)
  const handleDeleteNode = useCallback(
    (id: string) => {
      // Prevent deleting start node
      const nodeToDelete = flowNodes.find((n) => n.id === id);
      if (nodeToDelete?.data.type === "start") return;

      // Find all edges and nodes connected to the node being deleted
      const edgesToDelete = new Set<string>();
      const nodesToDelete = new Set<string>();

      // Add the main node to deletion list
      nodesToDelete.add(id);

      // Find all edges connected to this node
      flowEdges.forEach((edge) => {
        if (edge.source === id || edge.target === id) {
          edgesToDelete.add(edge.id);

          // If this is an outgoing edge from the node being deleted
          if (edge.source === id) {
            const targetNode = flowNodes.find((n) => n.id === edge.target);

            // Only delete the target node if it's an END node
            // Keep IntermediateNodes (type === "node")
            if (targetNode && targetNode.data.type === "end") {
              // Additional check: only delete end nodes that belong to this specific node
              // (following naming pattern like nodeId-success or nodeId-failure)
              if (edge.target.startsWith(`${id}-`)) {
                nodesToDelete.add(edge.target);
              }
            }
            // If target is IntermediateNode (type === "node"), we keep it and only remove the edge
          }
        }
      });

      // Update flow state
      setFlowNodes((nds) => nds.filter((n) => !nodesToDelete.has(n.id)));
      setFlowEdges((eds) => eds.filter((e) => !edgesToDelete.has(e.id)));

      // Mark as having unsaved changes
      setHasUnsavedChanges(true);
    },
    [flowNodes, flowEdges, setFlowNodes, setFlowEdges, setHasUnsavedChanges]
  );

  // Add new intermediate node
  const handleAddNode = useCallback(
    (parentId?: string) => {
      const newId = `node-${crypto.randomUUID()}`;
      const successId = `${newId}-success`;
      const failureId = `${newId}-failure`;

      // Calculate position based on parent or default
      let newX = 250;
      let newY = 200;

      // Find parent node from current flow nodes
      const parentNode = flowNodes.find((n) => n.id === parentId);
      if (parentNode) {
        newX = parentNode.position.x;
        newY = parentNode.position.y + 150;
      }

      const newNode: IntermediateNode = {
        id: newId,
        type: "node",
        x: newX,
        y: newY,
        width: 180,
        height: 80,
        title: `Node ${
          flowNodes.filter((n) => n.data.type === "node").length + 1
        }`,
        description: "",
        entryEffects: [],
        exitEffects: [],
        timeOut: null,
        events: [],
        success: successId,
        failure: failureId,
      };

      // Create the end nodes separately
      const successEndNode: IEndNode = {
        id: successId,
        type: "end",
        x: newX + 250,
        y: newY - 50,
        width: 120,
        height: 60,
        outcome: "success",
      };

      const failureEndNode: IEndNode = {
        id: failureId,
        type: "end",
        x: newX + 250,
        y: newY + 100,
        width: 120,
        height: 60,
        outcome: "failure",
      };

      // Add new nodes to flow
      const newFlowNodes = [
        nodeToReactFlow(
          newNode,
          () => handleAddNode(newNode.id),
          () => handleDeleteNode(newNode.id)
        ),
        nodeToReactFlow(successEndNode, undefined, () =>
          handleDeleteNode(successId)
        ),
        nodeToReactFlow(failureEndNode, undefined, () =>
          handleDeleteNode(failureId)
        ),
      ];

      setFlowNodes((nds) => [...nds, ...newFlowNodes]);

      // Add edges from parent to new node and from new node to success/failure
      const newEdges: Edge[] = [];

      if (parentId) {
        newEdges.push({
          id: `e-${parentId}-${newId}`,
          source: parentId,
          target: newId,
          style: { stroke: "#3b82f6", strokeWidth: 3 },
          animated: true,
          markerEnd: {
            type: "arrowclosed",
            color: "#3b82f6",
          },
        });
      }

      newEdges.push(
        {
          id: `e-${newId}-success-${successId}`,
          source: newId,
          target: successId,
          sourceHandle: "success",
          label: "Success",
          style: { stroke: "#22c55e", strokeWidth: 3 },
          animated: true,
          markerEnd: {
            type: "arrowclosed",
            color: "#22c55e",
          },
        },
        {
          id: `e-${newId}-failure-${failureId}`,
          source: newId,
          target: failureId,
          sourceHandle: "failure",
          label: "Failure",
          style: { stroke: "#ef4444", strokeWidth: 3 },
          animated: false,
          markerEnd: {
            type: "arrowclosed",
            color: "#ef4444",
          },
        }
      );

      setFlowEdges((eds) => [...eds, ...newEdges]);

      // Mark as having unsaved changes
      setHasUnsavedChanges(true);
    },
    [
      flowNodes,
      handleDeleteNode,
      setFlowNodes,
      setFlowEdges,
      setHasUnsavedChanges,
    ]
  );

  // Add success end node
  const handleAddSuccessNode = useCallback(
    (parentId: string) => {
      const parentNode = flowNodes.find((n) => n.id === parentId);
      if (!parentNode) return;

      const successId = `${parentId}-success`;

      // Check if success node already exists
      const existingSuccess = flowNodes.find((n) => n.id === successId);
      if (existingSuccess) return;

      // Find and remove existing success edge (connection to another node)
      const existingSuccessEdge = flowEdges.find(
        (edge) => edge.source === parentId && edge.sourceHandle === "success"
      );

      if (existingSuccessEdge) {
        // Remove the existing success edge
        setFlowEdges((eds) =>
          eds.filter((e) => e.id !== existingSuccessEdge.id)
        );
      }

      const successNode: IEndNode = {
        id: successId,
        type: "end",
        x: parentNode.position.x + 250,
        y: parentNode.position.y - 50,
        width: 120,
        height: 60,
        outcome: "success",
      };

      const newFlowNode = nodeToReactFlow(successNode, undefined, () =>
        handleDeleteNode(successId)
      );

      const newEdge: Edge = {
        id: `e-${parentId}-success-${successId}`,
        source: parentId,
        target: successId,
        sourceHandle: "success",
        label: "Success",
        style: { stroke: "#22c55e", strokeWidth: 3 },
        animated: true,
        markerEnd: {
          type: "arrowclosed",
          color: "#22c55e",
        },
      };

      setFlowNodes((nds) => [...nds, newFlowNode]);
      setFlowEdges((eds) => [...eds, newEdge]);
      setHasUnsavedChanges(true);
    },
    [
      flowNodes,
      flowEdges,
      handleDeleteNode,
      setFlowNodes,
      setFlowEdges,
      setHasUnsavedChanges,
    ]
  );

  // Add failure end node (with complex rename logic)
  const handleAddFailureNode = useCallback(
    (parentId: string) => {
      const parentNode = flowNodes.find((n) => n.id === parentId);
      if (!parentNode) return;

      const failureId = `${parentId}-failure`;

      // Check if a node with this exact ID already exists (any type)
      const existingNodeWithSameId = flowNodes.find((n) => n.id === failureId);

      // If it's already a failure end node with correct outcome, don't recreate
      if (
        existingNodeWithSameId &&
        existingNodeWithSameId.data.type === "end" &&
        (existingNodeWithSameId.data.nodeData as IEndNode).outcome === "failure"
      ) {
        // Already correct, nothing to do
        return;
      }

      // Find and remove existing failure edge (connection to another node)
      const existingFailureEdge = flowEdges.find(
        (edge) => edge.source === parentId && edge.sourceHandle === "failure"
      );

      // If node with same ID exists but is NOT a failure end node, rename it to avoid conflict
      let nodeToRename: Node | null = null;
      let newIdForRenamedNode: string | null = null;

      if (
        existingNodeWithSameId &&
        existingNodeWithSameId.data.type !== "end"
      ) {
        // This is an intermediate node that was converted from failure end node
        // Give it a new unique ID to avoid conflict
        nodeToRename = existingNodeWithSameId;
        newIdForRenamedNode = `node-${crypto.randomUUID()}`;
      }

      // Remove existing failure edge
      if (existingFailureEdge) {
        setFlowEdges((eds) =>
          eds.filter((e) => e.id !== existingFailureEdge.id)
        );
      }

      // Create new failure end node
      const failureNode: IEndNode = {
        id: failureId,
        type: "end",
        x: parentNode.position.x + 250,
        y: parentNode.position.y + 100,
        width: 120,
        height: 60,
        outcome: "failure",
      };

      const newFlowNode = nodeToReactFlow(failureNode, undefined, () =>
        handleDeleteNode(failureId)
      );

      // Update parent node's nodeData AND handle node renaming if needed
      if (parentNode.data.type === "node") {
        const nodeData = parentNode.data.nodeData as IntermediateNode;

        const updatedNodeData: IntermediateNode = {
          ...nodeData,
          failure: failureId, // Update to new failure node ID
        };

        setFlowNodes((nds) => {
          let updatedNodes = nds;

          // Rename the conflicting node and its children if needed
          if (nodeToRename && newIdForRenamedNode) {
            const oldSuccessId = `${failureId}-success`;
            const oldFailureId = `${failureId}-failure`;
            const newSuccessId = `${newIdForRenamedNode}-success`;
            const newFailureId = `${newIdForRenamedNode}-failure`;

            updatedNodes = nds.map((node) => {
              // Rename the conflicting node itself
              if (node.id === nodeToRename.id) {
                const oldNodeData = node.data.nodeData as NodeVariants;
                return {
                  ...node,
                  id: newIdForRenamedNode,
                  data: {
                    ...node.data,
                    id: newIdForRenamedNode,
                    nodeData: {
                      ...(oldNodeData as object),
                      id: newIdForRenamedNode,
                      // Update success/failure references if it's an intermediate node
                      ...(oldNodeData.type === "node"
                        ? {
                            success:
                              (oldNodeData as IntermediateNode).success ===
                              oldSuccessId
                                ? newSuccessId
                                : (oldNodeData as IntermediateNode).success,
                            failure:
                              (oldNodeData as IntermediateNode).failure ===
                              oldFailureId
                                ? newFailureId
                                : (oldNodeData as IntermediateNode).failure,
                          }
                        : {}),
                    } as typeof oldNodeData,
                  },
                };
              }
              // Rename child success node
              if (node.id === oldSuccessId) {
                const oldNodeData = node.data.nodeData;
                return {
                  ...node,
                  id: newSuccessId,
                  data: {
                    ...node.data,
                    id: newSuccessId,
                    nodeData: {
                      ...(oldNodeData as object),
                      id: newSuccessId,
                    } as typeof oldNodeData,
                  },
                };
              }
              // Rename child failure node
              if (node.id === oldFailureId) {
                const oldNodeData = node.data.nodeData;
                return {
                  ...node,
                  id: newFailureId,
                  data: {
                    ...node.data,
                    id: newFailureId,
                    nodeData: {
                      ...(oldNodeData as object),
                      id: newFailureId,
                    } as typeof oldNodeData,
                  },
                };
              }
              return node;
            });
          }

          // Update parent node and add new failure node
          return [
            ...updatedNodes.map((node) =>
              node.id === parentId
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      nodeData: updatedNodeData,
                    },
                  }
                : node
            ),
            newFlowNode, // Add new failure node
          ];
        });

        // Update edges that reference the renamed node and its children
        if (nodeToRename && newIdForRenamedNode) {
          const oldSuccessId = `${failureId}-success`;
          const oldFailureId = `${failureId}-failure`;
          const newSuccessId = `${newIdForRenamedNode}-success`;
          const newFailureId = `${newIdForRenamedNode}-failure`;

          setFlowEdges((eds) =>
            eds.map((edge) => {
              const newSource =
                edge.source === failureId
                  ? newIdForRenamedNode
                  : edge.source === oldSuccessId
                  ? newSuccessId
                  : edge.source === oldFailureId
                  ? newFailureId
                  : edge.source;
              const newTarget =
                edge.target === failureId
                  ? newIdForRenamedNode
                  : edge.target === oldSuccessId
                  ? newSuccessId
                  : edge.target === oldFailureId
                  ? newFailureId
                  : edge.target;

              // If source or target changed, update the edge ID too
              const needsUpdate =
                newSource !== edge.source || newTarget !== edge.target;

              return {
                ...edge,
                id: needsUpdate
                  ? `e-${newSource}${
                      edge.sourceHandle ? `-${edge.sourceHandle}` : ""
                    }-${newTarget}`
                  : edge.id,
                source: newSource,
                target: newTarget,
              };
            })
          );
        }
      }

      const newEdge: Edge = {
        id: `e-${parentId}-failure-${failureId}`,
        source: parentId,
        target: failureId,
        sourceHandle: "failure",
        label: "Failure",
        style: { stroke: "#ef4444", strokeWidth: 3 },
        animated: false,
        markerEnd: {
          type: "arrowclosed",
          color: "#ef4444",
        },
      };

      setFlowEdges((eds) => [...eds, newEdge]);
      setHasUnsavedChanges(true);
    },
    [
      flowNodes,
      flowEdges,
      handleDeleteNode,
      setFlowNodes,
      setFlowEdges,
      setHasUnsavedChanges,
    ]
  );

  return {
    handleAddNode,
    handleDeleteNode,
    handleAddSuccessNode,
    handleAddFailureNode,
  };
};
