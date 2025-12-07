// src/hooks/comptabilite/useComptabiliteService.ts
import { useState, useCallback } from "react";
import { comptabiliteService } from "../../services/comptabilite/comptabilite.service";

export function useComptabiliteService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // -----------------------------
    // Personnel
    // -----------------------------
    const getAllPersonnel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getAllPersonnel();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPersonnelById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getPersonnelById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Contrats
    // -----------------------------
    const getAllContrats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getAllContrats();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des contrats");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getContratById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getContratById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du contrat");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getContratsByPersonnel = useCallback(async (idPersonnel: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getContratsByPersonnel(idPersonnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des contrats du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Paies
    // -----------------------------
    const createPaie = useCallback(async (payload: FormData) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.createPaie(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création de la paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllPaies = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getAllPaies();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des paies");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPaieById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getPaieById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération de la paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPaiesByPersonnel = useCallback(async (idPersonnel: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getPaiesByPersonnel(idPersonnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des paies du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Bulletins de paie
    // -----------------------------
    const createBulletinPaie = useCallback(async (payload: FormData) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.createBulletinPaie(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du bulletin de paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllBulletinsPaie = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getAllBulletinsPaie();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des bulletins de paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getBulletinPaieById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getBulletinPaieById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du bulletin de paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateBulletinPaie = useCallback(async (id: string, payload: any) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.updateBulletinPaie(id, payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour du bulletin de paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteBulletinPaie = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.deleteBulletinPaie(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression du bulletin de paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getBulletinsPaieByPersonnel = useCallback(async (idPersonnel: string) => {
        try {
            setLoading(true);
            setError(null);
            return await comptabiliteService.getBulletinsPaieByPersonnel(idPersonnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des bulletins de paie du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        // Personnel
        getAllPersonnel,
        getPersonnelById,
        // Contrats
        getAllContrats,
        getContratById,
        getContratsByPersonnel,
        // Paies
        createPaie,
        getAllPaies,
        getPaieById,
        getPaiesByPersonnel,
        // Bulletins de paie
        createBulletinPaie,
        getAllBulletinsPaie,
        getBulletinPaieById,
        updateBulletinPaie,
        deleteBulletinPaie,
        getBulletinsPaieByPersonnel,
    };
}

