import { Route } from "react-router-dom"; 
import type { ReactNode } from "react";

import ProtectedRoute from "../secure/ProtectedRoute";
import Layout from "../layout/Layout";

// --- importations des pages comme avant ---
import Presence from "../pages/assnat/user/Presence";
import DemandesFeature from "../pages/assnat/user/features-user/Demandes.feature";
import DemanderFeature from "../pages/assnat/user/features-user/Demander.feature.";
import HistoriquesFeature from "../pages/assnat/user/features-user/Historiques.feature";
import ApprobationFeature from "../pages/assnat/user/features-user/Approbations.feature";
import DisponibilitesFeature from "../pages/assnat/user/features-user/Disponibilité.feature";
import CalendarFeature from "../pages/assnat/user/features-user/Calendar.feature";
import RapportFeature from "../pages/assnat/user/features-user/Rapport.feature";
import InteractionUser from "../pages/assnat/user/features-user/Interaction.feature";
import ProfilFeature from "../pages/assnat/user/features-user/Profil.feature";

// --- ADMIN ---
import PresenceAdmin from "../pages/assnat/admin/Presence";
import DemandesFeatureAdmin from "../pages/assnat/admin/features-admin/Demandes.feature";
import DemanderFeatureAdmin from "../pages/assnat/admin/features-admin/Demander.feature.";
import HistoriquesFeatureAdmin from "../pages/assnat/admin/features-admin/Historiques.feature";
import ApprobationFeatureAdmin from "../pages/assnat/admin/features-admin/Approbations.feature";
import DisponibilitesFeatureAdmin from "../pages/assnat/admin/features-admin/Disponibilité.feature";
import CalendarFeatureAdmin from "../pages/assnat/admin/features-admin/Calendar.feature";
import RapportFeatureAdmin from "../pages/assnat/admin/features-admin/Rapport.feature";
import AjouterPersonnel from "../pages/assnat/admin/features-admin/AjouterPersonnel.feature";

// --- RH ---
// import PresenceRh from "../pages/assnat/rh/Presence";
import DashboardFeatures from "../pages/assnat/rh/features-rh/Dashbboard.feature";
import DemandesFeatureRh from "../pages/assnat/rh/features-rh/Demandes.feature";
import CalendarFeatureRH from "../pages/assnat/rh/features-rh/Calendar.feature";
import HistoriquesFeatureRh from "../pages/assnat/rh/features-rh/Historiques.feature";
import RapportFeatureRh from "../pages/assnat/rh/features-rh/Rapport.feature";
import ReglementsFeatureRh from "../pages/assnat/rh/features-rh/Reglements.feature";
import DemandesRapportFeatureRh from "../pages/assnat/rh/features-rh/DemandesRapport.feature";
import EmployesFeatures from "../pages/assnat/rh/features-rh/Employes.feature";
import DirectionFeatures from "../pages/assnat/rh/features-rh/Direction.feature";
import ServicesFeatures from "../pages/assnat/rh/features-rh/Service.feature";
import InteractionRhFeatures from "../pages/assnat/rh/features-rh/Interaction.feature";
import TypeCongeFeature from "../pages/assnat/rh/features-rh/TypeConge.feature";

// --- COMPTABILITÉ ---
import BienvenueComptabilite from "../pages/assnat/comptabilite/features-comptabilite/Bienvenue.feature";
import ComptabiliteFeature from "../pages/assnat/comptabilite/features-comptabilite/Comptabilite.feature";
// import React from "react";

export default function RoleRoutes(role: "user" | "admin" | "rh" | "compta_admin") {
    const base = `assnat-${role}/dashboard`;

    const wrap = (element: ReactNode) => (
        <ProtectedRoute role={role}>
            <Layout role={role}>{element}</Layout>
        </ProtectedRoute>
    );


    if (role === "user") {
        return [
            <Route key="user-presence" path={`${base}/presence`} element={wrap(<Presence />)} />,
            <Route key="user-demandes" path={`${base}/demandes`} element={wrap(<DemandesFeature />)} />,
            <Route key="user-demander" path={`${base}/demander`} element={wrap(<DemanderFeature />)} />,
            <Route key="user-calendrier" path={`${base}/calendrier`} element={wrap(<CalendarFeature />)} />,
            <Route key="user-approbations" path={`${base}/approbations`} element={wrap(<ApprobationFeature />)} />,
            <Route key="user-disponibilites" path={`${base}/disponibilites`} element={wrap(<DisponibilitesFeature />)} />,
            <Route key="user-historique" path={`${base}/historique`} element={wrap(<HistoriquesFeature />)} />,
            <Route key="user-rapport" path={`${base}/rapport`} element={wrap(<RapportFeature />)} />,
            <Route key="user-interaction" path={`${base}/interaction`} element={wrap(<InteractionUser />)} />,
            <Route key="user-profil" path={`${base}/profil`} element={wrap(<ProfilFeature />)} />,
        ];
    }
    
    if (role === "admin") {
        return [
            <Route key="admin-presence" path={`${base}/presence`} element={wrap(<PresenceAdmin />)} />,
            <Route key="admin-demandes" path={`${base}/demandes`} element={wrap(<DemandesFeatureAdmin />)} />,
            <Route key="admin-demander" path={`${base}/demander`} element={wrap(<DemanderFeatureAdmin />)} />,
            <Route key="admin-calendrier" path={`${base}/calendrier`} element={wrap(<CalendarFeatureAdmin />)} />,
            <Route key="admin-approbations" path={`${base}/approbations`} element={wrap(<ApprobationFeatureAdmin />)} />,
            <Route key="admin-disponibilites" path={`${base}/disponibilites`} element={wrap(<DisponibilitesFeatureAdmin />)} />,
            <Route key="admin-historique" path={`${base}/historique`} element={wrap(<HistoriquesFeatureAdmin />)} />,
            <Route key="admin-rapport" path={`${base}/rapport`} element={wrap(<RapportFeatureAdmin />)} />,
            <Route key="admin-personne" path={`${base}/personne`} element={wrap(<AjouterPersonnel />)} />,
            <Route key="admin-interaction" path={`${base}/interaction`} element={wrap(<InteractionUser />)} />,
            <Route key="admin-profil" path={`${base}/profil`} element={wrap(<ProfilFeature />)} />,
        ];
    }

    if (role === "rh") {
        return [
            <Route key="rh-base" path={`${base}`} element={wrap(<DashboardFeatures />)} />,
            <Route key="rh-dashboard" path={`${base}/presence`} element={wrap(<DashboardFeatures />)} />,
            <Route key="rh-demandes" path={`${base}/demandes`} element={wrap(<DemandesFeatureRh />)} />,
            <Route key="rh-calendrier" path={`${base}/calendrier`} element={wrap(<CalendarFeatureRH />)} />,
            <Route key="rh-historique" path={`${base}/historique`} element={wrap(<HistoriquesFeatureRh />)} />,
            <Route key="rh-rapport" path={`${base}/rapport`} element={wrap(<RapportFeatureRh />)} />,
            <Route key="rh-reglements" path={`${base}/rapport/reglements`} element={wrap(<ReglementsFeatureRh />)} />,
            <Route key="rh-demandes-rapport" path={`${base}/rapport/demandes`} element={wrap(<DemandesRapportFeatureRh />)} />,
            <Route key="rh-employes" path={`${base}/employes`} element={wrap(<EmployesFeatures />)} />,
            <Route key="rh-direction" path={`${base}/direction`} element={wrap(<DirectionFeatures />)} />,
            <Route key="rh-service" path={`${base}/service`} element={wrap(<ServicesFeatures />)} />,
            <Route key="rh-interaction" path={`${base}/interaction`} element={wrap(<InteractionRhFeatures />)} />,
            <Route key="rh-typeconge" path={`${base}/typeconge`} element={wrap(<TypeCongeFeature />)} />,
            <Route key="rh-profil" path={`${base}/profil`} element={wrap(<ProfilFeature />)} />,
        ];
    }
    if (role === "compta_admin") {
        return [
            <Route key="compta_admin-base" path={`${base}`} element={wrap(<></>)} />,
            <Route key="compta_admin-bienvenue" path={`${base}/bienvenue`} element={wrap(<BienvenueComptabilite />)} />,
            <Route key="compta_admin-comptabilite" path={`${base}/comptabilite`} element={wrap(<ComptabiliteFeature />)} />,
        ];
    }

    return [];
}
