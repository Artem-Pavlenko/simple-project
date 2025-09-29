import { useState } from "react";
import * as S from "./styles";
import { useUserStore } from "../../stores/authStore";

interface SignInFormProps {
  onLoginSuccess?: () => void;
}

export const SignInForm: React.FC<SignInFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const signIn = useUserStore((state) => state.signIn);
  const loading = useUserStore((state) => state.loading);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    if (!email || !password) {
      setMessage("Please enter both email and password.");
      return;
    }
    try {
      await signIn(email, password);
      setMessage("Logged in successfully!");
      onLoginSuccess?.();
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
      <S.Title>Sign In</S.Title>
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
        {loading ? "Signing In..." : "Sign In"}
      </S.Button>
      {message && <S.Message>{message}</S.Message>}
    </S.Form>
  );
};
