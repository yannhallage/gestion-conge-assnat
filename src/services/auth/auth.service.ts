// src/api/services/auth.service.ts
import { ENDPOINTS_AUTH } from '../../api/auth/Endpoint';
import { Http } from '../../api/http';
import type { ChangePasswordPayload, LoginPayload, LoginResponse } from '../../../src/types/validation.dto';
import { ACCESS_TOKEN_KEY } from '../../secure/storageKeys';

class AuthService {
    /**
     * Connexion du personnel
     * @param payload email et mot de passe
     */
    async login(payload: LoginPayload): Promise<LoginResponse> {
        const response = await Http<LoginResponse>(ENDPOINTS_AUTH.login, {
            method: 'POST',
            body: payload,
        });

        if (response.access_token) {
            localStorage.setItem(ACCESS_TOKEN_KEY, response.access_token);
        }

        return response;
    }

    /**
     * Déconnexion
     */
    logout() {
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    }

    /**
     * Mettre à jour le mot de passe de l'utilisateur courant
     */
    async changePassword(payload: ChangePasswordPayload) {
        return Http(ENDPOINTS_AUTH.changePassword, {
            method: 'PATCH',
            body: payload,
        });
    }

    /**
     * Récupérer le token JWT stocké
     */
    getToken(): string | null {
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    }

    /**
     * Vérifier si l'utilisateur est connecté
     */
    isAuthenticated(): boolean {
        return !!this.getToken();
    }
}

export const authService = new AuthService();
