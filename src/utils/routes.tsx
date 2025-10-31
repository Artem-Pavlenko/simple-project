import type { JSX } from "react";

import { ResetPasswordPage } from "../pages/ResetPassword";
import {
  SignInPage,
  SignUpPage,
  AdventuresPage,
  DeletedAdventuresPage,
  EditAdventure,
  ChallengePage,
} from "../pages";
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
    path: RoutePathNames.Challenge,
    element: (
      <AuthWrapper>
        <ChallengePage />
      </AuthWrapper>
    ),
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
    path: RoutePathNames.DeletedAdventures,
    element: (
      <AuthWrapper>
        <DeletedAdventuresPage />
      </AuthWrapper>
    ),
  },
  {
    path: RoutePathNames.Home,
    element: (
      <AuthWrapper>
        <AdventuresPage />
      </AuthWrapper>
    ),
  },
];
