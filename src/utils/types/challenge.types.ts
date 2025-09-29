// A Challenge represents a self-contained game logic unit within an Adventure.
// It is composed of nodes (start, end, and intermediate) which form a flowchart-based game structure.
import type { InputType } from "./adventure.types";
import type { IEndNode, IntermediateNode, IStartNode } from "./node.types";

export type Challenge = {
  id: string;
  title: string;
  description: string;
  version: string;
  created_at: string;
  updated_at: string;
  challengeStart: InputType[];
  startNode: IStartNode;
  endNodes: IEndNode[];
  nodes: {
    [key: string]: IntermediateNode;
  };
};
