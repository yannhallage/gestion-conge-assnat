// src/api/services/auth.service.ts
import { ENDPOINTS_AUTH } from '../../api/auth/Endpoint';
import { Http } from '../../api/http';
import type { ChangePasswordPayload, LoginPayload, LoginResponse, UpdatePasswordDto, UpdatePersonalInfoDto } from '../../../src/types/validation.dto';
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
     * Mettre à jour le mot de passe avec l'ID du personnel
     * @param id ID du personnel
     * @param payload Ancien et nouveau mot de passe
     */
    async updatePassword(id: string, payload: UpdatePasswordDto) {
        return Http(ENDPOINTS_AUTH.updatePassword(id), {
            method: 'PUT',
            body: payload,
        });
    }

    /**
     * Mettre à jour les informations personnelles avec l'ID du personnel
     * @param id ID du personnel
     * @param payload Informations personnelles à mettre à jour
     */
    async updatePersonalInfo(id: string, payload: UpdatePersonalInfoDto) {
        return Http(ENDPOINTS_AUTH.updatePersonalInfo(id), {
            method: 'PUT',
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
