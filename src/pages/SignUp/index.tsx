import type { FC } from "react";
import * as S from "./styles";

import { SignUpForm } from "../../components";
import { RoutePathNames } from "../../utils/constants";

export const SignUpPage: FC = () => {
  return (
    <S.Wrapper>
      <SignUpForm />
      <S.StyledLink to={RoutePathNames.SignIn}>Go to Sign In</S.StyledLink>
    </S.Wrapper>
  );
};
