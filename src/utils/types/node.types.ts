// Nodes are the building blocks of the game flow. They define structure, transitions, and logic.
// Updated: 2024-10-17 - IntermediateNode success/failure changed to string IDs, EndNode has outcome field

import type { Effect } from "./effects.types";
import type { TimerOnce, Trigger } from "./triggers.types";

export interface INodeTypes {
  Start: "start";
  End: "end";
  Node: "node";
}

export type NodeType =
  | INodeTypes["Start"]
  | INodeTypes["End"]
  | INodeTypes["Node"];

export interface INode {
  x: number;
  y: number;
  width: number;
  height: number;
  id: string;
  type: NodeType;
}

export interface IStartNode extends INode {
  type: INodeTypes["Start"];
}

export interface IEndNode extends INode {
  type: INodeTypes["End"];
  outcome: "success" | "failure"; // NEW: Indicates whether this is a success or failure end node
}

export type NodeVariants = IStartNode | IEndNode | IntermediateNode;

export interface TimeOut extends TimerOnce {
  effects: Effect[];
}

export type EventType = {
  trigger: Trigger;
  effects: Effect[];
};

export interface IntermediateNode extends INode {
  type: INodeTypes["Node"];
  title: string;
  description: string;
  entryEffects: Effect[];
  exitEffects: Effect[];
  timeOut: null | TimeOut;
  events: EventType[];
  success: string; // UPDATED: Changed from NodeVariants to string (ID reference)
  failure: string; // UPDATED: Changed from NodeVariants to string (ID reference or same as node.id for RESTART)
}
