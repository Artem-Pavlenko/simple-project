import { Route, Routes } from "react-router-dom";

import { routers } from "./utils/routes";
import { useAuth } from "./utils/hooks";
import { ToastProvider } from "./components/ToastProvider";
import "./index.css";

function App() {
  useAuth();

  return (
    <div className="page-wrapper">
      <Routes>
        {routers.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* <Route
          path="*"
          element={
            <Navigate
              replace
              to={user?.id ? RoutePathNames.Home : RoutePathNames.SignIn}
            />
          }
        /> */}
      </Routes>
      <ToastProvider />
    </div>
  );
}

export default App;
