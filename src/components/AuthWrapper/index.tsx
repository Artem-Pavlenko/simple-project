import type { FC, PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";

import { RoutePathNames } from "../../utils/constants";
import { useUserStore } from "../../stores/authStore";
import * as S from "./styles";

export const AuthWrapper: FC<PropsWithChildren> = ({ children }) => {
  const user = useUserStore((state) => state.user);
  const initializing = useUserStore((state) => state.initializing);

  if (initializing) {
    return null;
  }

  if (!user) {
    return <Navigate to={RoutePathNames.SignIn} replace />;
  }

  return <S.ComponentWrapper>{children}</S.ComponentWrapper>;
};
