import { useState, type FC, type FormEvent } from "react";

import * as S from "./styles";
import { useUserStore } from "../../stores/authStore";

export const SignUpForm: FC = () => {
  const { signUp, loading } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const isValid =
      email.trim() && password.trim() && firstName.trim() && lastName.trim();

    if (isValid) {
      try {
        await signUp(email.trim().toLowerCase(), password, {
          firstName,
          lastName,
        });
        setMessage("");
        setMessage("Check your email for confirmation link!");
      } catch (error: unknown) {
        console.log("Error signing up:", error);
        if (error instanceof Error) {
          setMessage(
            error.message || "Something went wrong. Please try again."
          );
        } else {
          setMessage("Something went wrong. Please try again.");
        }
      }
    } else {
      setMessage("Enter all value");
    }
  };

  return (
    <S.Form onSubmit={handleSubmit}>
      <S.Title>Sign Up</S.Title>

      <S.Input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <S.Input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />

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
