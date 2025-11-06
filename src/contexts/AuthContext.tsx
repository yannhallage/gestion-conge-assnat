// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/auth.service";
import { ClipLoader } from "react-spinners";

interface User {
    id: string;
    email_personnel: string;
    nom: string;
    prenom: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
    loginWithAPI: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const savedToken = localStorage.getItem("access_token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            try {
                setToken(savedToken);
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Erreur parsing user:", e);
                localStorage.removeItem("user");
            }
        }
        setLoading(false);
    }, []);

    const loginWithAPI = async (email: string, password: string) => {
        setLoading(true);
        setError(null);

        try {
            const response = await authService.login({
                email_personnel: email,
                password: password,
            });
            const roleMap: Record<string, "user" | "admin" | "rh" | "chef"> = {
                EMPLOYE: "user",
                ADMIN: "admin",
                RH: "rh",
                CHEF: "chef",
            };

            const appRole = roleMap[response.user.role?.toUpperCase()] || "user";

            const userData: User = {
                id: response.user.id,
                email_personnel: response.user.email,
                nom: response.user.nom,
                prenom: response.user.prenom,
                role: appRole,
            };

            localStorage.setItem("access_token", response.access_token);
            localStorage.setItem("user", JSON.stringify(userData));
            setToken(response.access_token);
            setUser(userData);

            switch (appRole) {
                case "rh":
                    navigate("/assnat-rh/dashboard");
                    break;
                case "admin":
                    navigate("/assnat-admin/dashboard/presence");
                    break;
                case "chef":
                    navigate("/assnat-chef/dashboard/presence");
                    break;
                default:
                    navigate("/assnat-user/dashboard/presence");
            }
        } catch (err: any) {
            setError(err?.message || "Identifiants invalides");
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setToken(null);
        navigate("/login-assnat");
    };

    if (loading) return <ClipLoader size={13} />

    return (
        <AuthContext.Provider
            value={{ user, token, loading, error, loginWithAPI, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};
