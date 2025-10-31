import { useCallback } from "react";
import type { Node, Edge } from "@xyflow/react";
import type {
  IntermediateNode,
  IEndNode,
} from "../../../../utils/types/node.types";
import { nodeToReactFlow } from "../utils/nodeConverters";

interface UseNodeTransformationsProps {
  flowNodes: Node[];
  flowEdges: Edge[];
  setFlowNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setFlowEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteNode: (id: string) => void;
  handleAddNode: (parentId?: string) => void;
}

/**
 * Hook for node transformations
 * Handles copy, convert to intermediate, and convert to restart operations
 */
export const useNodeTransformations = ({
  flowNodes,
  flowEdges,
  setFlowNodes,
  setFlowEdges,
  setHasUnsavedChanges,
  handleDeleteNode,
  handleAddNode,
}: UseNodeTransformationsProps) => {
  // Copy node (duplicate with all properties)
  const handleCopyNode = useCallback(
    (sourceNodeId: string) => {
      // Find the source node
      const sourceFlowNode = flowNodes.find((n) => n.id === sourceNodeId);
      if (!sourceFlowNode || sourceFlowNode.data.type !== "node") return;

      const sourceNodeData = sourceFlowNode.data.nodeData as IntermediateNode;

      const newId = `node-${crypto.randomUUID()}`;
      const successId = `${newId}-success`;
      const failureId = `${newId}-failure`;

      // Find free position to the right or above the original node
      const findFreePosition = (startX: number, startY: number) => {
        const nodeWidth = 220; // Approximate node width including spacing
        const nodeHeight = 120; // Approximate node height including spacing

        // Try positions to the right first
        for (
          let offsetX = nodeWidth;
          offsetX <= nodeWidth * 4;
          offsetX += nodeWidth
        ) {
          const testX = startX + offsetX;
          const testY = startY;

          // Check if this position is free
          const isOccupied = flowNodes.some((node) => {
            const nodeX = node.position.x;
            const nodeY = node.position.y;
            return (
              Math.abs(nodeX - testX) < nodeWidth * 0.8 &&
              Math.abs(nodeY - testY) < nodeHeight * 0.8
            );
          });

          if (!isOccupied) {
            return { x: testX, y: testY };
          }
        }

        // If no free space to the right, try above
        for (
          let offsetY = -nodeHeight;
          offsetY >= -nodeHeight * 4;
          offsetY -= nodeHeight
        ) {
          const testX = startX;
          const testY = startY + offsetY;

          // Check if this position is free
          const isOccupied = flowNodes.some((node) => {
            const nodeX = node.position.x;
            const nodeY = node.position.y;
            return (
              Math.abs(nodeX - testX) < nodeWidth * 0.8 &&
              Math.abs(nodeY - testY) < nodeHeight * 0.8
            );
          });

          if (!isOccupied) {
            return { x: testX, y: testY };
          }
        }

        // Fallback: offset to the right and down
        return { x: startX + nodeWidth, y: startY + nodeHeight };
      };

      // Calculate new position in free space
      const freePosition = findFreePosition(
        sourceFlowNode.position.x,
        sourceFlowNode.position.y
      );
      const newX = freePosition.x;
      const newY = freePosition.y;

      // Create a copy of the source node with new IDs and position
      const copiedNode: IntermediateNode = {
        id: newId,
        type: "node",
        x: newX,
        y: newY,
        width: sourceNodeData.width,
        height: sourceNodeData.height,
        title: `${sourceNodeData.title} (Copy)`,
        description: sourceNodeData.description,
        entryEffects: JSON.parse(JSON.stringify(sourceNodeData.entryEffects)), // Deep copy
        exitEffects: JSON.parse(JSON.stringify(sourceNodeData.exitEffects)), // Deep copy
        timeOut: sourceNodeData.timeOut
          ? JSON.parse(JSON.stringify(sourceNodeData.timeOut))
          : null, // Deep copy
        events: JSON.parse(JSON.stringify(sourceNodeData.events)), // Deep copy
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
          copiedNode,
          () => handleAddNode(copiedNode.id),
          () => handleDeleteNode(copiedNode.id)
        ),
        nodeToReactFlow(successEndNode, undefined, () =>
          handleDeleteNode(successId)
        ),
        nodeToReactFlow(failureEndNode, undefined, () =>
          handleDeleteNode(failureId)
        ),
      ];

      setFlowNodes((nds) => [...nds, ...newFlowNodes]);

      // Add edges ONLY from copied node to its success/failure (no incoming edge)
      const newEdges: Edge[] = [
        // Edge from copied node to success
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
        // Edge from copied node to failure
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
        },
      ];

      setFlowEdges((eds) => [...eds, ...newEdges]);
      setHasUnsavedChanges(true);
    },
    [
      flowNodes,
      handleDeleteNode,
      handleAddNode,
      setFlowNodes,
      setFlowEdges,
      setHasUnsavedChanges,
    ]
  );

  // Convert end node to intermediate node
  const handleConvertEndToIntermediate = useCallback(
    (endNodeId: string) => {
      const endNode = flowNodes.find((n) => n.id === endNodeId);
      if (!endNode || endNode.data.type !== "end") return;

      const newId = endNodeId; // Keep the same ID
      const successId = `${newId}-success`;
      const failureId = `${newId}-failure`;

      // Find the highest node number among existing intermediate nodes
      const intermediateNodes = flowNodes
        .filter((n) => n.data.type === "node")
        .map((n) => n.data.nodeData as IntermediateNode);

      const nodeNumbers = intermediateNodes
        .map((node) => {
          const match = node.title.match(/^Node (\d+)$/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((num) => num > 0);

      const nextNodeNumber =
        nodeNumbers.length > 0 ? Math.max(...nodeNumbers) + 1 : 1;

      // Create IntermediateNode from EndNode
      const intermediateNode: IntermediateNode = {
        id: newId,
        type: "node",
        x: endNode.position.x,
        y: endNode.position.y,
        width: 180,
        height: 80,
        title: `Node ${nextNodeNumber}`,
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
        x: endNode.position.x + 250,
        y: endNode.position.y - 50,
        width: 120,
        height: 60,
        outcome: "success",
      };

      const failureEndNode: IEndNode = {
        id: failureId,
        type: "end",
        x: endNode.position.x + 250,
        y: endNode.position.y + 100,
        width: 120,
        height: 60,
        outcome: "failure",
      };

      // Update the existing node to IntermediateNode
      const updatedNode = nodeToReactFlow(intermediateNode, undefined, () =>
        handleDeleteNode(intermediateNode.id)
      );

      // Create success and failure nodes
      const successNode = nodeToReactFlow(successEndNode, undefined, () =>
        handleDeleteNode(successId)
      );

      const failureNode = nodeToReactFlow(failureEndNode, undefined, () =>
        handleDeleteNode(failureId)
      );

      // Update flow nodes
      setFlowNodes((nds) => [
        ...nds.filter((n) => n.id !== endNodeId), // Remove old end node
        updatedNode,
        successNode,
        failureNode,
      ]);

      // Add edges to success/failure
      const newEdges: Edge[] = [
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
        },
      ];

      setFlowEdges((eds) => [...eds, ...newEdges]);
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

  // Convert end node to restart (self-reference failure)
  const handleConvertEndToRestart = useCallback(
    (endNodeId: string) => {
      // Find the parent node that has this end node as failure
      const parentEdge = flowEdges.find(
        (edge) => edge.target === endNodeId && edge.sourceHandle === "failure"
      );

      if (!parentEdge) return;

      const parentNode = flowNodes.find((n) => n.id === parentEdge.source);
      if (!parentNode || parentNode.data.type !== "node") return;

      const parentNodeData = parentNode.data.nodeData as IntermediateNode;

      // Update parent node's failure to be its own ID (self-reference for RESTART)
      const updatedParentNodeData: IntermediateNode = {
        ...parentNodeData,
        failure: parentNode.id, // Self-reference for RESTART
      };

      // Update parent node in flow
      setFlowNodes(
        (nds) =>
          nds
            .map((node) =>
              node.id === parentNode.id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      nodeData: updatedParentNodeData,
                    },
                  }
                : node.id === endNodeId
                ? null // Remove the end node
                : node
            )
            .filter(Boolean) as Node[]
      );

      // Remove the edge from parent to this end node
      setFlowEdges((eds) => eds.filter((e) => e.target !== endNodeId));

      setHasUnsavedChanges(true);
    },
    [flowNodes, flowEdges, setFlowNodes, setFlowEdges, setHasUnsavedChanges]
  );

  return {
    handleCopyNode,
    handleConvertEndToIntermediate,
    handleConvertEndToRestart,
  };
};
