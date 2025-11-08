// src/hooks/useUserService.ts
import { useState, useCallback } from "react";
import type { CreateDemandePayload, CreateDiscussionPayload } from '../../../src/types/validation.dto';
import { userService } from "../../services/employes/user.service";

export function useUserService(userId: string) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mettre à jour l'ID utilisateur dans le service
    userService.setUserId(userId);

    const createDemande = useCallback(async (payload: CreateDemandePayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.createDemande(payload);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création de la demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const getMyDemandes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getMyDemandes();
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des demandes");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDemandeDetails = useCallback(async (demandeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getDemandeDetails(demandeId);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du détail de la demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getTypesConge = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getTypesConge();
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des types de congé");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const addDiscussion = useCallback(async (demandeId: string, payload: CreateDiscussionPayload) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.addDiscussion(demandeId, payload);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de l'ajout de discussion");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const getDiscussions = useCallback(async (demandeId: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await userService.getDiscussions(demandeId);
            return response;
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des discussions");
            throw err;
        } finally {
            setLoading(false);
        }
    }, [userId]);

    return {
        loading,
        error,
        createDemande,
        getMyDemandes,
        getDemandeDetails,
        getTypesConge,
        addDiscussion,
        getDiscussions,
    };
}
