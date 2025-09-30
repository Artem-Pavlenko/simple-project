import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RoutePathNames } from "../../utils/constants";
import { useUserStore } from "../../stores/authStore";
import { supabase } from "../../supabaseClient";
import * as S from "./styles";

export const ResetPasswordForm = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      navigate(RoutePathNames.Home);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!password) {
      setMessage("Please enter a new password.");
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });
      if (error) throw error;
      setMessage("Password has been updated! You can sign in now.");
    } catch (error: unknown) {
      console.error("Error updating password:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Title>Reset Password</S.Title>
      <S.Input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <S.Button type="submit">Update Password</S.Button>
      {message && <S.Message>{message}</S.Message>}
    </S.Form>
  );
};
