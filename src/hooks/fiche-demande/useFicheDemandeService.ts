// src/hooks/fiche-demande/useFicheDemandeService.ts
import { useState, useCallback } from "react";
import type {
    CreateFicheDemandeDto,
    UpdateFicheDemandeDto
} from '../../types/validation.dto';
import { ficheDemandeService } from "../../services/fiche-demande/fiche-demande.service";

export function useFicheDemandeService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // -----------------------------
    // Créer une fiche de demande avec upload de fichier
    // -----------------------------
    const createFicheDemande = useCallback(async (payload: CreateFicheDemandeDto, file: File) => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.createFicheDemande(payload, file);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création de la fiche de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Récupérer toutes les fiches de demande
    // -----------------------------
    const getAllFichesDemande = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.getAllFichesDemande();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des fiches de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Récupérer une fiche de demande par ID
    // -----------------------------
    const getFicheDemandeById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.getFicheDemandeById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération de la fiche de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Récupérer une fiche de demande par ID de demande
    // -----------------------------
    const getFicheDemandeByDemandeId = useCallback(async (id_demande: string) => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.getFicheDemandeByDemandeId(id_demande);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération de la fiche de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Récupérer les fiches de demande par ID de personnel
    // -----------------------------
    const getFichesDemandeByPersonnelId = useCallback(async (id_personnel: string) => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.getFichesDemandeByPersonnelId(id_personnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des fiches de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Mettre à jour une fiche de demande (avec ou sans nouveau fichier)
    // -----------------------------
    const updateFicheDemande = useCallback(async (id: string, payload: UpdateFicheDemandeDto, file?: File) => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.updateFicheDemande(id, payload, file);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour de la fiche de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Supprimer une fiche de demande
    // -----------------------------
    const deleteFicheDemande = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await ficheDemandeService.deleteFicheDemande(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression de la fiche de demande");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createFicheDemande,
        getAllFichesDemande,
        getFicheDemandeById,
        getFicheDemandeByDemandeId,
        getFichesDemandeByPersonnelId,
        updateFicheDemande,
        deleteFicheDemande,
    };
}

