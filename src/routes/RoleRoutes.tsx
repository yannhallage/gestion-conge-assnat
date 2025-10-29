import { Route } from "react-router-dom";

// import LoginAssnat from "./pages/LoginAssnat";
// import Presence from "./pages/assnat/user/Presence";
// import DemandesFeature from "./pages/assnat/user/features-user/Demandes.feature";
// import HistoriquesFeature from "./pages/assnat/user/features-user/Historiques.feature";
// import ApprobationFeature from "./pages/assnat/user/features-user/Approbations.feature";
// import DemanderFeature from "./pages/assnat/user/features-user/Demander.feature.";
// import DisponibilitesFeature from "./pages/assnat/user/features-user/Disponibilité.feature";
// import CalendarFeature from "./pages/assnat/user/features-user/Calendar.feature";
// import RapportFeature from "./pages/assnat/user/features-user/Rapport.feature";

import Layout from "../layout/Layout"
import Presence from "../pages/assnat/user/Presence";
import DemandesFeature from "../pages/assnat/user/features-user/Demandes.feature";
import HistoriquesFeature from "../pages/assnat/user/features-user/Historiques.feature";
import ApprobationFeature from "../pages/assnat/user/features-user/Approbations.feature";
import DemanderFeature from "../pages/assnat/user/features-user/Demander.feature.";
import DisponibilitesFeature from "../pages/assnat/user/features-user/Disponibilité.feature";
import CalendarFeature from "../pages/assnat/user/features-user/Calendar.feature";
import RapportFeature from "../pages/assnat/user/features-user/Rapport.feature";

import PresenceAdmin from "../pages/assnat/admin/Presence";
import DemandesFeatureAdmin from "../pages/assnat/admin/features-admin/Demandes.feature";
import HistoriquesFeatureAdmin from "../pages/assnat/admin/features-admin/Historiques.feature";
import ApprobationFeatureAdmin from "../pages/assnat/admin/features-admin/Approbations.feature";
import DemanderFeatureAdmin from "../pages/assnat/admin/features-admin/Demander.feature.";
import DisponibilitesFeatureAdmin from "../pages/assnat/admin/features-admin/Disponibilité.feature";
import CalendarFeatureAdmin from "../pages/assnat/admin/features-admin/Calendar.feature";
import RapportFeatureAdmin from "../pages/assnat/admin/features-admin/Rapport.feature";
import AjouterPersonnel from "../pages/assnat/admin/features-admin/AjouterPersonnel.feature";
import DirectionFeatures from "../pages/assnat/rh/features-rh/Direction.feature";
import ServicesFeatures from "../pages/assnat/rh/features-rh/Service.feature";
import EmployesFeatures from "../pages/assnat/rh/features-rh/Employes.feature";
import DemandesFeatureRh from "../pages/assnat/rh/features-rh/Demandes.feature";
import DashboardFeatures from "../pages/assnat/rh/features-rh/Dashbboard.feature"
import InteractionRhFeatures from "../pages/assnat/rh/features-rh/Interaction.feature";
import RapportFeatureRh from "../pages/assnat/rh/features-rh/Rapport.feature";
import PresenceRh from "../pages/assnat/rh/Presence";
import InteractionUser from "../pages/assnat/user/features-user/Interaction.feature";
import TypeCongeFeature from "../pages/assnat/rh/features-rh/TypeConge.feature";
import CalendarFeatureRH from "../pages/assnat/rh/features-rh/Calendar.feature";
// import CalendarView from "../components/rh/CalendarView";



export default function RoleRoutes(role: "user" | "admin" | "rh") {
    const base = `assnat-${role}/dashboard`;

    if (role === "user") {
        return (
            <>
                <Route path={`${base}/presence`} element={<Layout><Presence /></Layout>} />
                <Route path={`${base}/demandes`} element={<Layout><DemandesFeature /></Layout>} />
                <Route path={`${base}/demander`} element={<Layout><DemanderFeature /></Layout>} />
                <Route path={`${base}/calendrier`} element={<Layout><CalendarFeature /></Layout>} />
                <Route path={`${base}/approbations`} element={<Layout><ApprobationFeature /></Layout>} />
                <Route path={`${base}/disponibilites`} element={<Layout><DisponibilitesFeature /></Layout>} />
                <Route path={`${base}/historique`} element={<Layout><HistoriquesFeature /></Layout>} />
                <Route path={`${base}/rapport`} element={<Layout><RapportFeature /></Layout>} />
                <Route path={`${base}/interaction`} element={<Layout><InteractionUser /></Layout>} />
            </>
        );
    }
    if (role === "admin") {
        return (
            <>
                <Route path={`${base}/presence`} element={<Layout><PresenceAdmin /></Layout>} />
                <Route path={`${base}/demandes`} element={<Layout><DemandesFeatureAdmin /></Layout>} />
                <Route path={`${base}/demander`} element={<Layout><DemanderFeatureAdmin /></Layout>} />
                <Route path={`${base}/calendrier`} element={<Layout><CalendarFeatureAdmin /></Layout>} />
                <Route path={`${base}/approbations`} element={<Layout><ApprobationFeatureAdmin /></Layout>} />
                <Route path={`${base}/disponibilites`} element={<Layout><DisponibilitesFeatureAdmin /></Layout>} />
                <Route path={`${base}/historique`} element={<Layout><HistoriquesFeatureAdmin /></Layout>} />
                <Route path={`${base}/rapport`} element={<Layout><RapportFeatureAdmin /></Layout>} />
                <Route path={`${base}/interaction`} element={<Layout><InteractionUser /></Layout>} />
                <Route path={`${base}/personne`} element={<Layout><AjouterPersonnel /></Layout>} />
            </>
        );
    }
    if (role === "rh") {
        return (
            <>
                <Route path={`${base}`} element={<Layout><PresenceRh /></Layout>} />
                <Route path={`${base}/dashboard`} element={<Layout><DashboardFeatures /></Layout>} />
                <Route path={`${base}/demandes`} element={<Layout><DemandesFeatureRh /></Layout>} />
                <Route path={`${base}/calendrier`} element={<Layout><CalendarFeatureRH /></Layout>} />
                <Route path={`${base}/historique`} element={<Layout><HistoriquesFeatureAdmin /></Layout>} />
                <Route path={`${base}/rapport`} element={<Layout><RapportFeatureRh /></Layout>} />
                <Route path={`${base}/employes`} element={<Layout><EmployesFeatures /></Layout>} />
                <Route path={`${base}/direction`} element={<Layout><DirectionFeatures /></Layout>} />
                <Route path={`${base}/service`} element={<Layout><ServicesFeatures /></Layout>} />
                <Route path={`${base}/interaction`} element={<Layout><InteractionRhFeatures /></Layout>} />
                <Route path={`${base}/typeconge`} element={<Layout><TypeCongeFeature /></Layout>} />
            </>
        );
    }
    return null;
}