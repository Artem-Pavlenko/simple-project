import { create } from "zustand";
import type { Session } from "@supabase/supabase-js";

import { SupabaseAPI } from "../utils/service/api";

export interface IUserProfile {
  id: string;
  email: string | null | undefined;
  firstName: string;
  lastName: string;
}

interface IUserName {
  firstName: string;
  lastName: string;
}

interface IUserStore {
  user: IUserProfile | null;
  session: Session | null;
  loading: boolean;

  signUp: (
    email: string,
    password: string,
    userData: IUserName
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  fetchUser: () => Promise<void>;
  resetPassword: (email: string, redirectTo?: string) => Promise<void>;
  setUser: (user: IUserProfile | null) => void;
}

export const useUserStore = create<IUserStore>((set) => ({
  user: null,
  session: null,
  loading: false,

  signUp: async (email, password, userData) => {
    set({ loading: true });
    try {
      const { data, error } = await SupabaseAPI.signUp({
        email,
        password,
        options: { emailRedirectTo: "http://localhost:5173", data: userData },
      });
      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            firstName: data.user.user_metadata?.firstName || "",
            lastName: data.user.user_metadata?.lastName || "",
          },
          session: data.session,
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await SupabaseAPI.signIn(email, password);
      if (error) throw error;

      if (data.user) {
        set({
          user: {
            id: data.user.id,
            email: data.user.email!,
            firstName: data.user.user_metadata?.firstName || "",
            lastName: data.user.user_metadata?.lastName || "",
          },
          session: data.session,
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    try {
      await SupabaseAPI.signOut();
      set({ user: null, session: null });
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async () => {
    set({ loading: true });
    try {
      const { data: userData, error: userError } = await SupabaseAPI.getUser();
      if (userError) throw userError;

      const { data: sessionData, error: sessionError } =
        await SupabaseAPI.getSession();
      if (sessionError) throw sessionError;

      if (userData.user) {
        set({
          user: {
            id: userData.user.id,
            email: userData.user.email!,
            firstName: userData.user.user_metadata?.firstName || "",
            lastName: userData.user.user_metadata?.lastName || "",
          },
          session: sessionData.session,
        });
      }
    } finally {
      set({ loading: false });
    }
  },

  setUser(user) {
    set({ user });
  },

  resetPassword: async (email, redirectTo) => {
    set({ loading: true });
    try {
      await SupabaseAPI.resetPassword(email, redirectTo);
    } finally {
      set({ loading: false });
    }
  },
}));
