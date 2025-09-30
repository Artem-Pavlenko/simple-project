import { useEffect, useState } from "react";
import { ForgotPasswordForm, SignInForm } from "../../components";
import { useUserStore } from "../../stores/authStore";
import { RoutePathNames } from "../../utils/constants";
import * as S from "./styles";
import { useNavigate } from "react-router-dom";

export const SignInPage = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [isForgotPass, setIsForgotPass] = useState(false);

  useEffect(() => {
    if (user?.id) {
      navigate(RoutePathNames.Home);
    }
  }, [user]);

  return (
    <S.Wrapper>
      {isForgotPass ? (
        <ForgotPasswordForm onGoBack={() => setIsForgotPass(false)} />
      ) : (
        <SignInForm />
      )}

      <S.StyledLink to={RoutePathNames.SignUp}>Go to Sign Up?</S.StyledLink>
      <S.ForgotPassword onClick={() => setIsForgotPass(true)}>
        Forgot Password ?
      </S.ForgotPassword>
    </S.Wrapper>
  );
};
