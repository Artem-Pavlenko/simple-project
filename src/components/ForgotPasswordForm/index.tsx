import { useState, type FC } from "react";

import { SupabaseAPI } from "../../utils/service/api";
import * as S from "./styles";

interface IProps {
  onGoBack: () => void;
}

export const ForgotPasswordForm: FC<IProps> = ({ onGoBack }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      const res = await SupabaseAPI.resetPassword(
        email,
        `${window.location.origin}/reset-password`
      );
      if (res?.error?.message) {
        setMessage(res.error.message);
        return;
      }
      setMessage("Check your email for the password reset link.");
    } catch (error: unknown) {
      console.error("Error resetting password:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Title>Forgot Password</S.Title>
      <S.Input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <S.Button type="submit">Send Reset Link</S.Button>
      {message && <S.Message>{message}</S.Message>}

      <div onClick={onGoBack}>Go Back</div>
    </S.Form>
  );
};
