import { useEffect } from "react";

import { useUserStore } from "../../stores/authStore";
import { supabase } from "../../supabaseClient";
import { parseUserData } from "../helpers";

export const useAuth = () => {
  const { setUser } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && data.session.user) {
        setUser(parseUserData(data.session.user));
      }
    });

    const subData = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(parseUserData(session.user));
      } else {
        setUser(null);
      }
    });

    return () => subData?.data?.subscription?.unsubscribe();
  }, []);
};
