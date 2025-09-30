import type { INodeTypes } from "./types/node.types";

export const NodeTypes: INodeTypes = {
  Start: "start",
  End: "end",
  Node: "node",
};

export const RoutePathNames = {
  Home: "/",
  SignIn: "/sign-in",
  SignUp: "/sign-up",
  ConfirmEmail: "/confirm-email",
  YouAdventures: "/your-adventures",
  DeletedAdventures: "/deleted-adventures",
  EditAdventure: "/edit-adventure/:id",
  ResetPassword: "/reset-password",
};
