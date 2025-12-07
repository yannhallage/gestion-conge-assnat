// src/hooks/employes/useDiscussion.ts
import { useState, useCallback, useEffect } from "react";
import { userService } from "../../services/employes/user.service";
import type { CreateDiscussionPayload } from '../../../src/types/validation.dto';

export interface DiscussionMessage {
    id_discussion?: string;
    message: string;
    heure_message?: string | null;
    auteur?: string | null;
    auteur_message?: string | null;
}

interface UseDiscussionOptions {
    demandeId: string | null | undefined;
    userId: string | null | undefined;
    autoFetch?: boolean; // Si true, récupère automatiquement les discussions au montage
}

export function useDiscussion({ demandeId, userId, autoFetch = true }: UseDiscussionOptions) {
    const [messages, setMessages] = useState<DiscussionMessage[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Mettre à jour l'ID utilisateur dans le service dès qu'il change
    useEffect(() => {
        userService.setUserId(userId ?? null);
    }, [userId]);

    /**
     * Récupérer les discussions d'une demande
     */
    const fetchDiscussions = useCallback(async () => {
        if (!demandeId) {
            setMessages([]);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const response = await userService.getDiscussions(demandeId);
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
    }, [demandeId]);

    /**
     * Ajouter une discussion à une demande
     */
    const addDiscussion = useCallback(async (payload: CreateDiscussionPayload) => {
        if (!demandeId) {
            throw new Error("ID de demande non défini");
        }
        if (!userId) {
            throw new Error("ID utilisateur non défini");
        }

        try {
            setLoading(true);
            setError(null);
            
            // Ajouter l'heure actuelle si non fournie
            const payloadWithTime: CreateDiscussionPayload = {
                ...payload,
                heure_message: payload.heure_message || new Date().toISOString(),
            };

            const response = await userService.addDiscussion(demandeId, payloadWithTime);
            
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
    }, [demandeId, userId, fetchDiscussions]);

    // Récupération automatique des discussions au montage et quand demandeId change
    useEffect(() => {
        if (autoFetch && demandeId) {
            fetchDiscussions();
        }
    }, [autoFetch, demandeId, fetchDiscussions]);

    return {
        messages,
        loading,
        error,
        fetchDiscussions,
        addDiscussion,
        setMessages, // Pour permettre la mise à jour manuelle si nécessaire
    };
}

