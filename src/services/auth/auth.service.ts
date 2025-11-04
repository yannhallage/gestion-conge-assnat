// src/api/services/auth.service.ts
import { ENDPOINTS_AUTH } from '../../api/auth/Endpoint';
import { Http } from '../../api/http';
import type { LoginPayload, LoginResponse } from '../../../src/types/validation.dto';

class AuthService {
    private static TOKEN_KEY = 'ACCESS_TOKEN';

    /**
     * Connexion du personnel
     * @param payload email et mot de passe
     */
    async login(payload: LoginPayload): Promise<LoginResponse> {
        const response = await Http<LoginResponse>(ENDPOINTS_AUTH.login, {
            method: 'POST',
            body: payload,
        });

        // ✅ Correction ici
        if (response.access_token) {
            localStorage.setItem(AuthService.TOKEN_KEY, response.access_token);
        }

        return response;
    }

    /**
     * Déconnexion
     */
    logout() {
        localStorage.removeItem(AuthService.TOKEN_KEY);
    }

    /**
     * Récupérer le token JWT stocké
     */
    getToken(): string | null {
        return localStorage.getItem(AuthService.TOKEN_KEY);
    }

    /**
     * Vérifier si l'utilisateur est connecté
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
