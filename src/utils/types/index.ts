import type { RoutePathNames } from "../constants";

export type TagType = "Draft" | "Final" | "Not started";

export type RoutePathNameType =
  (typeof RoutePathNames)[keyof typeof RoutePathNames];
