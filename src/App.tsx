import { useEffect } from "react";

import { supabase } from "./supabaseClient";
import { useUserStore } from "./stores/authStore";
import { Navigate, Route, Routes } from "react-router-dom";
import { routers } from "./utils/routes";
import "./index.css";
import { RoutePathNames } from "./utils/constants";

function App() {
  const { setUser, user } = useUserStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session && data.session.user) {
        setUser({ id: data.session.user.id, email: data.session.user.email });
      }
    });

    const subData = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ id: session.user.id, email: session?.user.email });
      } else {
        setUser(null);
      }
    });

    return () => subData?.data?.subscription?.unsubscribe();
  }, []);

  return (
    <div className="page-wrapper">
      <Routes>
        {routers.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        <Route
          path="*"
          element={
            <Navigate
              replace
              to={user?.id ? RoutePathNames.Home : RoutePathNames.SignIn}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
