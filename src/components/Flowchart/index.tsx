import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import type { ChallengeType } from "../../utils/types/challenge.types";
import type {
  IStartNode,
  IntermediateNode,
  IEndNode,
} from "../../utils/types/node.types";
import { LOG } from "../../utils";
import { NodeCard } from "./NodeCard";

export interface FlowchartProps {
  challenge?: ChallengeType;
  onChallengeChange?: (challenge: ChallengeType) => void;
}

export const Flowchart: React.FC<FlowchartProps> = ({
  challenge,
  onChallengeChange,
}) => {
  LOG(challenge, "challenge");

  // Build nodes
  const rfNodes: Node[] = [
    ...(challenge?.startNode ? [nodeToReactFlow(challenge.startNode)] : []),
    ...Object.values(challenge?.nodes || {}).map(nodeToReactFlow),
    ...(challenge?.endNodes ?? []).map(nodeToReactFlow),
  ];

  // Build edges
  const edges: Edge[] = [];
  // Connect startNode to first intermediate node (if exists)
  const nodeIds = Object.keys(challenge?.nodes || {});
  if (challenge?.startNode && nodeIds.length > 0) {
    edges.push({
      id: `e-start-${nodeIds[0]}`,
      source: challenge.startNode.id,
      target: nodeIds[0],
    });
  }
  // For each intermediate node, connect success/failure
  Object.values(challenge?.nodes || {}).forEach((node) => {
    // Type assertion for strict types
    const typedNode = node as IntermediateNode;
    if (typedNode.success?.id) {
      edges.push({
        id: `e-${typedNode.id}-success-${typedNode.success.id}`,
        source: typedNode.id,
        target: typedNode.success.id,
      });
    }
    if (typedNode.failure?.id) {
      edges.push({
        id: `e-${typedNode.id}-failure-${typedNode.failure.id}`,
        source: typedNode.id,
        target: typedNode.failure.id,
      });
    }
  });
  const [flowNodes, setFlowNodes, handleNodesChange] = useNodesState(rfNodes);
  const [flowEdges, setFlowEdges, handleEdgesChange] = useEdgesState(edges);

  const handleAddNode = useCallback(
    (parentId?: string) => {
      const newId = `node-${Date.now()}`;
      const newNode: IntermediateNode = {
        id: newId,
        type: "node",
        x: 100,
        y: 100,
        width: 180,
        height: 80,
        title: "New Node",
        description: "",
        entryEffects: [],
        exitEffects: [],
        timeOut: null,
        events: [],
        success: {
          id: `${newId}-success`,
          type: "end",
          x: 300,
          y: 100,
          width: 120,
          height: 60,
        },
        failure: {
          id: `${newId}-failure`,
          type: "end",
          x: 300,
          y: 200,
          width: 120,
          height: 60,
        },
      };
      const updatedNodes = { ...(challenge?.nodes ?? {}), [newId]: newNode };
      // If parentId is provided, link new node to parent (for example, as success)
      if (parentId && updatedNodes[parentId]) {
        (updatedNodes[parentId] as IntermediateNode).success = newNode;
      }
      if (challenge && onChallengeChange) {
        onChallengeChange({ ...challenge, nodes: updatedNodes });
      }
      setFlowNodes((nds) => [...nds, nodeToReactFlow(newNode)]);
    },
    [challenge, onChallengeChange, setFlowNodes]
  );

  const handleDeleteNode = useCallback(
    (id: string) => {
      if (!challenge) return;
      // Prevent deleting start node
      if (challenge.startNode?.id === id) return;
      const updatedNodes = { ...challenge.nodes };
      // Recursively delete all nodes and edges linked to this node
      const deleteRecursive = (nodeId: string) => {
        Object.values(updatedNodes).forEach((node) => {
          if ((node as IntermediateNode).success?.id === nodeId) {
            deleteRecursive(node.id);
          }
          if ((node as IntermediateNode).failure?.id === nodeId) {
            deleteRecursive(node.id);
          }
        });
        delete updatedNodes[nodeId];
      };
      deleteRecursive(id);
      onChallengeChange?.({ ...challenge, nodes: updatedNodes });
      setFlowNodes((nds) => nds.filter((n) => n.id !== id));
    },
    [challenge, onChallengeChange, setFlowNodes]
  );

  const onConnect = useCallback(
    (params: Connection) => setFlowEdges((eds) => addEdge(params, eds)),
    [setFlowEdges]
  );

  interface CustomNodeData {
    label: string;
    type: string;
    onAddNode?: () => void;
    onDeleteNode?: (id: string) => void;
  }

  const nodeTypes = {
    custom: ({ data }: { data: CustomNodeData }) => {
      LOG(data, "NodeCard data");
      return (
        <NodeCard
          label={data.label}
          type={data.type}
          onAddNode={data.onAddNode}
          onDeleteNode={() => {}}
        />
      );
    },
  };

  function nodeToReactFlow(
    node: IStartNode | IntermediateNode | IEndNode
  ): Node {
    let label: string = node.type;
    if ("title" in node && typeof node.title === "string") label = node.title;
    return {
      id: node.id,
      type: "custom",
      position: { x: node.x, y: node.y },
      data: {
        label,
        type: node.type,
        onAddNode: () => handleAddNode(node.id),
        onDeleteNode: () => handleDeleteNode(node.id),
      },
      style: {
        width: node.width,
        height: node.height,
        background:
          node.type === "start"
            ? "#e3f0ff"
            : node.type === "end"
            ? "#6ee7b7"
            : "#f9fbe7",
        borderRadius: 8,
        padding: 8,
        boxShadow: "0 2px 8px #0001",
      },
    };
  }

  return (
    <div
      style={{
        height: 400,
        background: "#fff",
        borderRadius: 8,
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background color="#e0e7ef" gap={16} />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <div style={{ position: "absolute", top: 50, left: 12, zIndex: 2 }}>
        {flowNodes.map((node) => (
          <button
            key={node.id}
            onClick={() => handleDeleteNode(node.id)}
            style={{ margin: 2 }}
          >
            Видалити {String(node.data.label)}
          </button>
        ))}
      </div>
    </div>
  );
};
