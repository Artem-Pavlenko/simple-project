import { Navigate, Route, Routes } from "react-router-dom";

import { RoutePathNames } from "./utils/constants";
import { useUserStore } from "./stores/authStore";
import { routers } from "./utils/routes";
import { useAuth } from "./utils/hooks";
import "./index.css";

function App() {
  useAuth();
  const { user } = useUserStore();

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
