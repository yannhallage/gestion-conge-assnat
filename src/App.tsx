import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginAssnat from "./pages/LoginAssnat";
import RoleRoutes from "./routes/RoleRoutes";
import NotFound from "./errors/NotFound";
import { AuthProvider } from "./contexts/AuthContext";
import RedirectIfAuth from "./secure/RedirectIfAuth";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <meta name="description" content="Portail Administratif sécurisé" />
        </Helmet>

        <Routes>
          <Route path="/" element={<Navigate to="/login-assnat" replace />} />
          <Route
            path="/login-assnat"
            element={
              <RedirectIfAuth>
                <LoginAssnat />
              </RedirectIfAuth>
            }
          />
          {RoleRoutes("user")}
          {RoleRoutes("admin")}
          {RoleRoutes("rh")}
          {/* {RoleRoutes("chef")} */}

          {/* Page 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
