// src/hooks/chefdeservice/useChefDiscussion.ts
import { useState, useCallback, useEffect } from "react";
import { chefService } from "../../services/chefdeservice/chef.service";
import type { CreateDiscussionPayload } from '../../../src/types/validation.dto';

export interface DiscussionMessage {
    id_discussion?: string;
    message: string;
    heure_message?: string | null;
    auteur?: string | null;
    auteur_message?: string | null;
}

interface UseChefDiscussionOptions {
    demandeId: string | null | undefined;
    chefId: string | null | undefined;
    autoFetch?: boolean; // Si true, récupère automatiquement les discussions au montage
}

export function useChefDiscussion({ demandeId, chefId, autoFetch = true }: UseChefDiscussionOptions) {
    const [messages, setMessages] = useState<DiscussionMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Récupérer les discussions d'une demande
     */
    const fetchDiscussions = useCallback(async () => {
        if (!demandeId || !chefId) {
            setMessages([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await chefService.getDiscussions(demandeId, chefId);
            const discussions = Array.isArray(response) ? response : [];
            setMessages(discussions);
            return discussions;
        } catch (err: any) {
            const errorMessage = err.message || "Erreur lors de la récupération des discussions";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [demandeId, chefId]);

    /**
     * Ajouter une discussion à une demande
     */
    const addDiscussion = useCallback(async (payload: CreateDiscussionPayload) => {
        if (!demandeId) {
            throw new Error("ID de demande non défini");
        }
        if (!chefId) {
            throw new Error("ID chef non défini");
        }

        try {
            setLoading(true);
            setError(null);
            
            // Ajouter l'heure actuelle si non fournie
            const payloadWithTime: CreateDiscussionPayload = {
                ...payload,
                heure_message: payload.heure_message || new Date().toISOString(),
            };

            const response = await chefService.addDiscussion(demandeId, chefId, payloadWithTime);
            
            // Rafraîchir automatiquement les discussions après l'ajout
            await fetchDiscussions();
            
            return response;
        } catch (err: any) {
            const errorMessage = err.message || "Erreur lors de l'ajout de la discussion";
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [demandeId, chefId, fetchDiscussions]);

    // Récupération automatique des discussions au montage et quand demandeId change
    useEffect(() => {
        if (autoFetch && demandeId && chefId) {
            fetchDiscussions();
        }
    }, [autoFetch, demandeId, chefId, fetchDiscussions]);

    return {
        messages,
        loading,
        error,
        fetchDiscussions,
        addDiscussion,
        setMessages, // Pour permettre la mise à jour manuelle si nécessaire
    };
}

