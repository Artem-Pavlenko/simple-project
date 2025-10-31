import { useCallback } from "react";
import type { Node, Edge, Connection } from "@xyflow/react";
import { addEdge } from "@xyflow/react";
import type { IntermediateNode } from "../../../../utils/types/node.types";

interface UseEdgeHandlersProps {
  flowNodes: Node[];
  flowEdges: Edge[];
  setFlowNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setFlowEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Hook for edge connection handling
 * Manages edge creation with validation and special cases (Start node, RESTART)
 */
export const useEdgeHandlers = ({
  flowNodes,
  flowEdges,
  setFlowNodes,
  setFlowEdges,
  setHasUnsavedChanges,
}: UseEdgeHandlersProps) => {
  const onConnect = useCallback(
    (params: Connection) => {
      // Prevent connections to start node
      if (
        params.target &&
        flowNodes.find((n) => n.id === params.target)?.data.type === "start"
      ) {
        return;
      }

      // Prevent connections from end nodes
      if (
        params.source &&
        flowNodes.find((n) => n.id === params.source)?.data.type === "end"
      ) {
        return;
      }

      // Special handling for Start node - only ONE outgoing connection allowed
      if (params.source) {
        const sourceNode = flowNodes.find((n) => n.id === params.source);
        if (sourceNode?.data.type === "start") {
          // Find ALL existing edges from start node
          const existingStartEdges = flowEdges.filter(
            (edge) => edge.source === params.source
          );

          // Remove ALL existing edges from start node
          if (existingStartEdges.length > 0) {
            setFlowEdges((eds) =>
              eds.filter((e) => e.source !== params.source)
            );
          }
        }
      }

      // Check if source handle already has a connection (only one edge per success/failure)
      if (params.source && params.sourceHandle) {
        const existingEdge = flowEdges.find(
          (edge) =>
            edge.source === params.source &&
            edge.sourceHandle === params.sourceHandle
        );

        if (existingEdge) {
          // Remove existing edge first
          setFlowEdges((eds) => eds.filter((e) => e.id !== existingEdge.id));
        }
      }

      // If connecting failure handle, remove RESTART from source node's nodeData
      if (params.source && params.sourceHandle === "failure") {
        const sourceNode = flowNodes.find((n) => n.id === params.source);
        if (sourceNode && sourceNode.data.type === "node") {
          const nodeData = sourceNode.data.nodeData as IntermediateNode;

          // Check if current failure is RESTART (self-reference) and remove it
          if (nodeData.failure === params.source) {
            const updatedNodeData: IntermediateNode = {
              ...nodeData,
              failure: params.target || "",
            };

            // Update the source node's nodeData
            setFlowNodes((nds) =>
              nds.map((node) =>
                node.id === params.source
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        nodeData: updatedNodeData,
                      },
                    }
                  : node
              )
            );
          }
        }
      }

      // Create new edge
      const newEdge: Edge = {
        id: `e-${params.source}-${params.sourceHandle || "default"}-${
          params.target
        }`,
        ...params,
        style: {
          stroke:
            params.sourceHandle === "success"
              ? "#22c55e"
              : params.sourceHandle === "failure"
              ? "#ef4444"
              : "#3b82f6",
          strokeWidth: 2,
        },
        markerEnd: {
          type: "arrowclosed",
          color:
            params.sourceHandle === "success"
              ? "#22c55e"
              : params.sourceHandle === "failure"
              ? "#ef4444"
              : "#3b82f6",
        },
      };

      setFlowEdges((eds) => addEdge(newEdge, eds));
      setHasUnsavedChanges(true);
    },
    [flowEdges, flowNodes, setFlowEdges, setFlowNodes, setHasUnsavedChanges]
  );

  return { onConnect };
};
