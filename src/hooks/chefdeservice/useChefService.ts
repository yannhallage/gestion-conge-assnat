// src/hooks/useChefService.ts
import { useState, useCallback } from "react";
import type {
    InvitePersonnelPayload,
    ApproveDemandePayload,
    RejectDemandePayload,
    CreateDiscussionPayload,
    ChefActionPayload
} from '../../../src/types/validation.dto';
import { chefService } from "../../services/chefdeservice/chef.service";

export function useChefService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const invitePersonnel = useCallback(async (payload: InvitePersonnelPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.invitePersonnel(payload);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'invitation du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getServiceDemandes = useCallback(async (id_chef: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.getServiceDemandes(id_chef);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des demandes");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const approveDemande = useCallback(async (demandeId: string, chef: ChefActionPayload, payload: ApproveDemandePayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.approveDemande(demandeId, chef, payload);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'approbation de la demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const rejectDemande = useCallback(async (demandeId: string, chef: ChefActionPayload, payload: RejectDemandePayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.rejectDemande(demandeId, chef, payload);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors du refus de la demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const revokeDemande = useCallback(async (demandeId: string, chef: ChefActionPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.revokeDemande(demandeId, chef);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la révocation de la demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteDemande = useCallback(async (demandeId: string, chef: ChefActionPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.deleteDemande(demandeId, chef);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression de la demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getServicePersonnel = useCallback(async (serviceId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.getServicePersonnel(serviceId);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du personnel du service");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addDiscussion = useCallback(async (demandeId: string, chefId: string, payload: CreateDiscussionPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await chefService.addDiscussion(demandeId, chefId, payload);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'ajout de discussion");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        invitePersonnel,
        getServiceDemandes,
        approveDemande,
        rejectDemande,
        revokeDemande,
        deleteDemande,
        getServicePersonnel,
        addDiscussion,
    };
}
