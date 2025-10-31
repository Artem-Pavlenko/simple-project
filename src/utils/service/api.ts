import type { SignUpWithPasswordCredentials } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import type { AdventureType } from "../types/adventure.types";

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

  // Adventure API methods
  /** Create a new adventure */
  createAdventure: async (
    adventure: Omit<AdventureType, "created_at" | "updated_at">
  ) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("User not authenticated");

    return supabase
      .from("adventures")
      .insert({
        id: adventure.id,
        user_id: userData.user.id,
        title: adventure.title,
        description: adventure.description,
        version: adventure.version,
        tag: adventure.tag,
        input_aliasing: adventure.input_aliasing,
        assets: adventure.assets,
        challenge_selection_settings: adventure.challengeSelectionSettings,
        challenges: adventure.challenges,
      })
      .select()
      .single();
  },

  /** Get adventure by ID */
  getAdventureById: (id: string) =>
    supabase.from("adventures").select("*").eq("id", id).single(),

  /** Update existing adventure */
  updateAdventure: (
    id: string,
    updates: Partial<Omit<AdventureType, "id" | "created_at">>
  ) => {
    const updateData: Record<string, string | number | object | null> = {};

    if (updates.title) updateData.title = updates.title;
    if (updates.description !== undefined)
      updateData.description = updates.description;
    if (updates.version) updateData.version = updates.version;
    if (updates.tag !== undefined) updateData.tag = updates.tag;
    if (updates.input_aliasing)
      updateData.input_aliasing = updates.input_aliasing;
    if (updates.assets) updateData.assets = updates.assets;
    if (updates.challengeSelectionSettings)
      updateData.challenge_selection_settings =
        updates.challengeSelectionSettings;
    if (updates.challenges) updateData.challenges = updates.challenges;

    return supabase
      .from("adventures")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();
  },

  /** Delete adventure by ID */
  deleteAdventure: (id: string) =>
    supabase.from("adventures").delete().eq("id", id),

  /** Delete challenge from adventure */
  deleteAdventureChallenge: async (
    adventureId: string,
    challengeId: string
  ) => {
    // First get the current adventure
    const { data: adventure, error: fetchError } = await supabase
      .from("adventures")
      .select("challenges")
      .eq("id", adventureId)
      .single();

    if (fetchError) throw fetchError;
    if (!adventure) throw new Error("Adventure not found");

    // Remove the challenge from challenges object
    const updatedChallenges = { ...adventure.challenges };
    delete updatedChallenges[challengeId];

    // Update the adventure with the modified challenges
    return supabase
      .from("adventures")
      .update({
        challenges: updatedChallenges,
        updated_at: new Date().toISOString(),
      })
      .eq("id", adventureId)
      .select()
      .single();
  },

  /** Get all adventures for current user */
  getUserAdventures: () =>
    supabase
      .from("adventures")
      .select("*")
      .order("created_at", { ascending: false }),

  /** Check if adventure exists */
  checkAdventureExists: (id: string) =>
    supabase.from("adventures").select("id").eq("id", id).single(),
};
