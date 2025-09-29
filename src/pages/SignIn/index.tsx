import { useEffect } from "react";
import { SignInForm } from "../../components";
import { useUserStore } from "../../stores/authStore";
import { RoutePathNames } from "../../utils/constants";
import * as S from "./styles";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.id) {
      navigate(RoutePathNames.Home);
    }
  }, [user]);

  return (
    <S.Wrapper>
      <SignInForm />
      <S.StyledLink to={RoutePathNames.SignUp}>sign up ?</S.StyledLink>
    </S.Wrapper>
  );
};
