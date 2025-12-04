// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth/auth.service";
import { ClipLoader } from "react-spinners";
import { ACCESS_TOKEN_KEY, USER_STORAGE_KEY } from "../secure/storageKeys";

interface User {
    id: string;
    email_personnel: string;
    nom: string;
    prenom: string;
    role: string;
    id_service?: string;
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
        const savedToken = localStorage.getItem(ACCESS_TOKEN_KEY);
        const savedUser = localStorage.getItem(USER_STORAGE_KEY);

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
                CHEF_SERVICE: "admin",
                RH: "rh",
                // CHEF_SERVICE: "chef",
            };
            // console.log("response.user.role", response.user.role);
            const appRole = roleMap[response.user.role.toUpperCase()] || "user";
            console.log("appRole", appRole);
            const userData: User = {
                id: response.user.id,
                email_personnel: response.user.email,
                nom: response.user.nom,
                prenom: response.user.prenom,
                role: appRole,
                id_service: response.user.id_service,
            };

            localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
            setToken(response.access_token);
            setUser(userData);

            console.log("appRole", appRole);
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
        localStorage.removeItem(ACCESS_TOKEN_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
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
