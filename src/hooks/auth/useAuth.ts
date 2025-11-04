import { useState } from "react";
import type { LoginPayload, LoginResponse } from "../../types/validation.dto";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth/auth.service";

export function useAuth() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();

    /**
     * Gestion de la connexion
     */
    const login = async () => {
        setLoading(true);
        setError(null);

        try {
            const payload: LoginPayload = {
                email_personnel: email,
                password: password,
            };

            const response: LoginResponse = await authService.login(payload);
            
            switch (response.redirect) {
                case "rh":
                    navigate("/assnat-rh/dashboard/presence");
                    break;
                case "chef":
                    navigate("/assnat-admin/dashboard/presence");
                    break;
                default:
                    navigate("/assnat-user/dashboard/presence");
            }
        } catch (err: any) {
            setError(
                err?.message || "Échec de la connexion. Vérifiez vos identifiants."
            );
        } finally {
            setLoading(false);
        }
    };

    return {
        email,
        password,
        setEmail,
        setPassword,
        loading,
        error,
        login,
    };
}
