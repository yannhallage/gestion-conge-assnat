import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import HeaderComptabilite from "../components/comptabilite/HeaderComptabilite";
import AppGrid from "../components/comptabilite/AppGrid";

interface ComptabiliteLayoutProps {
    children: ReactNode;
}

export default function ComptabiliteLayout({ children }: ComptabiliteLayoutProps) {
    const location = useLocation();
    const isBaseRoute = location.pathname === "/assnat-compta_admin/dashboard" || 
                        location.pathname.endsWith("/assnat-compta_admin/dashboard");
    
    // Si c'est la route comptabilite, ne pas utiliser le layout avec header (le composant a son propre header)
    const isComptabiliteRoute = location.pathname.includes("/comptabilite");

    if (isComptabiliteRoute) {
        return <>{children}</>;
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-purple-50 via-white to-purple-50 relative overflow-hidden">
            {/* Pattern de fond subtil */}
            <div 
                className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: `repeating-linear-gradient(
                        45deg,
                        transparent,
                        transparent 10px,
                        rgba(0,0,0,0.1) 10px,
                        rgba(0,0,0,0.1) 20px
                    )`
                }}
            ></div>

            {/* Header */}
            <HeaderComptabilite />

            {/* Main content */}
            <main className="flex-1 overflow-y-auto relative z-10">
                {/* Afficher la grille d'applications sur la route de base, sinon afficher children */}
                {isBaseRoute ? (
                    <AppGrid />
                ) : (
                    <div className="h-full">
                        {children}
                    </div>
                )}
            </main>
        </div>
    );
}

