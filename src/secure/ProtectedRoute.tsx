import React from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export interface ProtectedRouteProps {
    children: ReactNode;
    role?: "user" | "admin" | "rh" | "chef";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, role }) => {
    const { user, token, loading } = useAuth();

    // ⏳ Tant que l'état d'authentification se charge
    if (loading) {
        return <div>Chargement...</div>; // Tu peux mettre un vrai spinner si tu veux
    }

    // 🚫 Pas connecté → redirection vers la page de login
    if (!token || !user) {
        return <Navigate to="/login-assnat" replace />;
    }

    // 🚫 Mauvais rôle → redirection vers le dashboard correspondant
    if (role && user.role !== role) {
        return <Navigate to={`/assnat-${user.role}/dashboard/presence`} replace />;
    }

    // ✅ Tout est bon → on affiche le contenu protégé
    return <>{children}</>;
};

export default ProtectedRoute;
