import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { RoutePathNames } from "../../utils/constants";
import { useUserStore } from "../../stores/authStore";
import { ComponentWrapper } from "./styles";

export const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  const user = useUserStore((state) => state.user);
  if (!user) return <Navigate to={RoutePathNames.SignIn} replace />;
  return <ComponentWrapper>{children}</ComponentWrapper>;
};
