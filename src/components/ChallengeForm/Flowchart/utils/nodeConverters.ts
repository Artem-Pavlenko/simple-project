import type { Node } from "@xyflow/react";
import type {
  IStartNode,
  IntermediateNode,
  IEndNode,
} from "../../../../utils/types/node.types";

export interface CustomNodeData extends Record<string, unknown> {
  label: string;
  type: "start" | "node" | "end";
  nodeData: IStartNode | IntermediateNode | IEndNode;
  onAddNode?: () => void;
  onDeleteNode?: (id: string) => void;
}

/**
 * Convert challenge node to ReactFlow node with callbacks
 */
export const nodeToReactFlow = (
  node: IStartNode | IntermediateNode | IEndNode,
  onAddNode?: () => void,
  onDeleteNode?: () => void
): Node => {
  let label: string = node.type;
  if ("title" in node && typeof node.title === "string") {
    label = node.title;
  }

  return {
    id: node.id,
    type: "custom",
    position: { x: node.x, y: node.y },
    data: {
      label,
      type: node.type,
      id: node.id,
      position: { x: node.x, y: node.y },
      onAddNode,
      onDeleteNode,
      nodeData: node,
    } as CustomNodeData,
    style: {
      borderRadius: 8,
      boxShadow: "0 2px 8px #0001",
    },
  };
};

/**
 * Simple converter without callbacks (used during initialization)
 */
export const simpleNodeToReactFlow = (
  node: IStartNode | IntermediateNode | IEndNode
): Node => {
  let label: string = node.type;
  if ("title" in node && typeof node.title === "string") {
    label = node.title;
  }

  return {
    id: node.id,
    type: "custom",
    position: { x: node.x, y: node.y },
    data: {
      label,
      type: node.type,
      id: node.id,
      position: { x: node.x, y: node.y },
      nodeData: node,
      onAddNode: undefined,
      onDeleteNode: undefined,
    } as CustomNodeData,
    style: {
      borderRadius: 8,
      boxShadow: "0 2px 8px #0001",
    },
  };
};
