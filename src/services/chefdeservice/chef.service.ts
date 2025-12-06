import { ENDPOINTS_CHEFDESERVICE } from "../../api/chefdeservice/Endpoint";
import { Http } from "../../api/http";
import type {
    InvitePersonnelPayload,
    ApproveDemandePayload,
    RejectDemandePayload,
    CreateDiscussionPayload,
    ChefActionPayload
} from '../../../src/types/validation.dto'

class ChefService {
    /**
     * Inviter un nouveau personnel dans le service
     */
    async invitePersonnel(payload: InvitePersonnelPayload) {
        return Http(ENDPOINTS_CHEFDESERVICE.invitePersonnel, {
            method: 'POST',
            body: payload,
        });
    }

    /**
     * Consulter toutes les demandes du service
     */
    async getServiceDemandes(id_chef: string) {
        return Http(`${ENDPOINTS_CHEFDESERVICE.getServiceDemandes}?id_chef=${id_chef}`, {
            method: 'GET',
        });
    }

    /**
     * Récupérer l'historique des demandes (terminées / refusées) du chef
     */
    async getHistoriqueDemandes() {
        return Http(ENDPOINTS_CHEFDESERVICE.getHistoriqueDemandes, {
            method: 'GET',
        });
    }

    /**
     * Approuver une demande
     */
    async approveDemande(demandeId: string, chef: ChefActionPayload, payload: ApproveDemandePayload) {
        return Http(ENDPOINTS_CHEFDESERVICE.approveDemande(demandeId), {
            method: 'PUT',
            body: { ...payload, chef },
        });
    }

    /**
     * Refuser une demande
     */
    async rejectDemande(demandeId: string, chef: ChefActionPayload, payload: RejectDemandePayload) {
        return Http(ENDPOINTS_CHEFDESERVICE.rejectDemande(demandeId), {
            method: 'PUT',
            body: { ...payload, chef },
        });
    }

    /**
     * Révoquer une demande approuvée
     */
    async revokeDemande(demandeId: string, chef: ChefActionPayload) {
        return Http(ENDPOINTS_CHEFDESERVICE.revokeDemande(demandeId), {
            method: 'PUT',
            body: { chef },
        });
    }

    /**
     * Supprimer une demande
     */
    async deleteDemande(demandeId: string, chef: ChefActionPayload) {
        return Http(ENDPOINTS_CHEFDESERVICE.deleteDemande(demandeId), {
            method: 'DELETE',
            body: { chef },
        });
    }

    /**
     * Consulter le personnel d’un service
     */
    async getServicePersonnel(serviceId: string) {
        return Http(ENDPOINTS_CHEFDESERVICE.getServicePersonnel(serviceId), {
            method: 'GET',
        });
    }

    /**
     * Ajouter une discussion à une demande
     */
    async addDiscussion(demandeId: string, chefId: string, payload: CreateDiscussionPayload) {
        const query = `?id_chef=${chefId}`;
        return Http(`${ENDPOINTS_CHEFDESERVICE.addDiscussion(demandeId)}${query}`, {
            method: 'POST',
            body: payload,
        });
    }

    /**
     * Récupérer les discussions d'une demande
     */
    async getDiscussions(demandeId: string, chefId: string) {
        const query = `?id_chef=${chefId}`;
        return Http(`${ENDPOINTS_CHEFDESERVICE.getDiscussions(demandeId)}${query}`, {
            method: 'GET',
        });
    }
}

// Export d’une instance singleton
export const chefService = new ChefService();
