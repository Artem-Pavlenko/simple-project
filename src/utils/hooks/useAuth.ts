import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useAdventureStore } from "../../stores/adventureStore";
import { useUserStore } from "../../stores/authStore";
import { supabase } from "../../supabaseClient";
import { RoutePathNames } from "../constants";
import { parseUserData } from "../helpers";

export const useAuth = () => {
  const { setUser, setInitializing } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && data.session.user) {
        setUser(parseUserData(data.session.user));
      }
      setInitializing(false);
    });

    const subData = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(parseUserData(session.user));
      } else {
        setUser(null);
        if (event === "SIGNED_OUT") {
          useAdventureStore.getState().clearAdventures();
        }
      }
    });

    return () => subData?.data?.subscription?.unsubscribe();
  }, [setUser, setInitializing]);
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { signOut, loading } = useUserStore();

  const logout = useCallback(async () => {
    try {
      await signOut();
      navigate(RoutePathNames.SignIn);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }, [signOut, navigate]);

  return { logout, loading };
};
