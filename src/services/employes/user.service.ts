import { ENDPOINTS_EMPLOYE } from "../../api/employes/Endpoint";
import { Http } from "../../api/http";
import type { CreateDemandePayload, CreateDiscussionPayload } from '../../../src/types/validation.dto'


class UserService {
    private userId: string | null = null;

    /**
     * Optionnel : définir l'ID de l'utilisateur courant
     */
    setUserId(userId: string | null) {
        this.userId = userId ?? null;
    }

    /**
     * Créer une nouvelle demande
     */
    async createDemande(payload: CreateDemandePayload) {
        if (!this.userId) throw new Error('User ID non défini');

        const query = `?id_personnel=${this.userId}`;
        return Http(`${ENDPOINTS_EMPLOYE.createDemande}${query}`, {
            method: 'POST',
            body: payload,
        });
    }

    /**
     * Récupérer toutes mes demandes
     */
    async getMyDemandes() {
        return Http(ENDPOINTS_EMPLOYE.getMyDemandes, {
            method: 'GET',
        });
    }

    /**
     * Récupérer les détails d'une demande
     */
    async getDemandeDetails(demandeId: string) {
        return Http(ENDPOINTS_EMPLOYE.getDemandeDetails(demandeId), {
            method: 'GET',
        });
    }

    /**
     * Récupérer les types de congé
     */
    async getTypesConge() {
        return Http(ENDPOINTS_EMPLOYE.getTypesConge, {
            method: 'GET',
        });
    }

    /**
     * Ajouter une discussion à une demande
     */
    async addDiscussion(demandeId: string, payload: CreateDiscussionPayload) {
        if (!this.userId) throw new Error('User ID non défini');

        const query = `?id_personnel=${this.userId}`;
        return Http(`${ENDPOINTS_EMPLOYE.addDiscussion(demandeId)}${query}`, {
            method: 'POST',
            body: payload,
        });
    }

    /**
     * Récupérer les discussions d'une demande
     */
    async getDiscussions(demandeId: string) {
        if (!this.userId) throw new Error('User ID non défini');

        const query = `?id_personnel=${this.userId}`;
        return Http(`${ENDPOINTS_EMPLOYE.getDiscussions(demandeId)}${query}`, {
            method: 'GET',
        });
    }

    /**
     * Récupérer l'historique des demandes (terminées ou refusées)
     */
    async getHistoriqueDemandes() {
        return Http(ENDPOINTS_EMPLOYE.getHistoriqueDemandes, {
            method: 'GET',
        });
    }

    /**
     * Récupérer la disponibilité d'un utilisateur
     * @param id ID du personnel
     */
    async getDisponibilite(id: string) {
        return Http(ENDPOINTS_EMPLOYE.getDisponibilite(id), {
            method: 'GET',
        });
    }

    /**
     * Récupérer toutes les interactions RH
     */
    async getAllInteractionsRh() {
        return Http(ENDPOINTS_EMPLOYE.getAllInteractionsRh, {
            method: 'GET',
        });
    }
}

// Export d’une instance singleton
export const userService = new UserService();