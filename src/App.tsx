import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import Layout from "./layout/Layout";
import LoginAssnat from "./pages/LoginAssnat";
import Presence from "./pages/assnat/user/Presence";
import DemandesFeature from "./pages/assnat/user/features-user/Demandes.feature";
import HistoriquesFeature from "./pages/assnat/user/features-user/Historiques.feature";
import ApprobationFeature from "./pages/assnat/user/features-user/Approbations.feature";
import DemanderFeature from "./pages/assnat/user/features-user/Demander.feature.";
import DisponibilitesFeature from "./pages/assnat/user/features-user/Disponibilité.feature";
import CalendarFeature from "./pages/assnat/user/features-user/Calendar.feature";
import RapportFeature from "./pages/assnat/user/features-user/Rapport.feature";

function App() {
  return (
    <Router>
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content="Portail Administratif sécurisé" />
      </Helmet>

      <Routes>
        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to="/login-assnat" replace />} />

        {/* Page de connexion */}
        <Route path="/login-assnat" element={<LoginAssnat />} />

        {/* Layout principal */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Presence />
            </Layout>
          }
        />

        {/* Routes enfants du dashboard */}
        {/* <Route
                    path="/dashboard/horloge"
                    element={
                        <Layout>
                            <Horloge />
                        </Layout>
                    }
                /> */}
        {/* <Route
                    path="/dashboard/presence"
                    element={
                        <Layout>
                            <Presence />
                        </Layout>
                    }
                /> */}
        <Route
          path="/dashboard/demandes"
          element={
            <Layout>
              <DemandesFeature />
            </Layout>
          }
        />
        <Route
                    path="/dashboard/demander"
                    element={
                        <Layout>
                        <DemanderFeature />
                        </Layout>
                    }
                />
                <Route
                    path="/dashboard/calendrier"
                    element={
                        <Layout>
                        <CalendarFeature />
                        </Layout>
                    }
                />
                <Route
                    path="/dashboard/approbations"
                    element={
                        <Layout>
                        <ApprobationFeature />
                        </Layout>
                    }
                />
                <Route
                    path="/dashboard/disponibilites"
                    element={
                        <Layout>
                        <DisponibilitesFeature />
                        </Layout>
                    }
                />
                <Route
                    path="/dashboard/historique"
                    element={
                        <Layout>
                        <HistoriquesFeature />
                        </Layout>
                    }
                />
                {/* <Route
                    path="/dashboard/interaction"
                    element={
                        <Layout>
                            <InteractionRH />
                        </Layout>
                    }
                /> */}
                <Route
                    path="/dashboard/rapport"
                    element={
                        <Layout>
                        <RapportFeature />
                        </Layout>
                    }
                />
      </Routes>
    </Router>
  );
}

export default App;
