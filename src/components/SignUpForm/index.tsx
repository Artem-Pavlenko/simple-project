import { useState, type FC, type FormEvent } from "react";

import * as S from "./styles";
import { useUserStore } from "../../stores/authStore";

export const SignUpForm: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signUp = useUserStore((state) => state.signUp);
  const loading = useUserStore((state) => state.loading);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await signUp(email.trim().toLowerCase(), password);
      setMessage("Check your email for confirmation link!");
    } catch (error: unknown) {
      console.log("Error signing up:", error);
      if (error instanceof Error) {
        setMessage(error.message || "Something went wrong. Please try again.");
      } else {
        setMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Title>Sign Up</S.Title>

      <S.Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <S.Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <S.Button type="submit" disabled={loading}>
        {loading ? "Signing Up..." : "Sign Up"}
      </S.Button>

      {message && <S.Message>{message}</S.Message>}
    </S.Form>
  );
};
