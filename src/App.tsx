
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import LoginAssnat from "./pages/LoginAssnat";
import Presence from "./pages/assnat/user/Presence";
import Layout from "./layout/Layout";


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
        <Route path="/dashboard" element={<Layout>
          <Presence />
        </Layout>} />
        {/* <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
