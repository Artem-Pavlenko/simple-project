import type { FC } from "react";

import { ResetPasswordForm } from "../../components";
import { RoutePathNames } from "../../utils/constants";
import * as S from "./styles";

export const ResetPasswordPage: FC = () => (
  <S.Wrapper>
    <ResetPasswordForm />
    <S.StyledLink to={RoutePathNames.SignIn}>Go to Sign In</S.StyledLink>
  </S.Wrapper>
);
