import type { JSX } from "react";

import { ResetPasswordPage } from "../pages/ResetPassword";
import { SignInPage, SignUpPage, PanelPage, EditAdventure } from "../pages";
import { RoutePathNames } from "./constants";
import { AuthWrapper } from "../components";

interface IRouter {
  path: string;
  element: JSX.Element;
}

export const routers: IRouter[] = [
  {
    path: RoutePathNames.SignIn,
    element: <SignInPage />,
  },
  {
    path: RoutePathNames.SignUp,
    element: <SignUpPage />,
  },
  {
    path: RoutePathNames.ResetPassword,
    element: <ResetPasswordPage />,
  },
  {
    path: RoutePathNames.EditAdventure,
    element: (
      <AuthWrapper>
        <EditAdventure />
      </AuthWrapper>
    ),
  },
  {
    path: RoutePathNames.Home,
    element: (
      <AuthWrapper>
        <PanelPage />
      </AuthWrapper>
    ),
  },
];
