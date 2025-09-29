import type { JSX } from "react";
import { RoutePathNames } from "./constants";
import { SignInPage, SignUpPage, PanelPage } from "../pages";
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
    path: RoutePathNames.Home,
    element: (
      <AuthWrapper>
        <PanelPage />
      </AuthWrapper>
    ),
  },
];
