import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginAssnat from "./pages/LoginAssnat";
import RoleRoutes from "./routes/RoleRoutes";

function App() {
  return (
    <Router>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="Portail Administratif sécurisé" />
      </Helmet>

      <Routes>
        <Route path="/" element={<Navigate to="/login-assnat" replace />} />
        <Route path="/login-assnat" element={<LoginAssnat />} />
        {RoleRoutes("user")}
        {RoleRoutes("admin")}
        {RoleRoutes("rh")}
      </Routes>

    </Router>
  );
}

export default App;
