import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";

export const SupabaseAPI = {
  /** Sign up user with email & password and optional metadata */
  signUp: (credentials: SignUpWithPasswordCredentials) =>
    supabase.auth.signUp(credentials),
  /** Sign in with email & password */
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),
  /** Sign out current user */
  signOut: () => supabase.auth.signOut(),
  /** Get current user */
  getUser: () => supabase.auth.getUser(),
  /** Get current session */
  getSession: () => supabase.auth.getSession(),
  /** Reset password via email */
  resetPassword: (email: string, redirectTo?: string) =>
    supabase.auth.resetPasswordForEmail(email, { redirectTo }),
};
