// src/hooks/useRhService.ts
import { useState, useCallback } from "react";
import type {
    CreateDirectionDto,
    CreateServiceDto,
    CreatePersonnelDto,
    UpdatePersonnelDto,
    CreateTypeCongeDto
} from '../../../src/types/validation.dto';
import { rhServiceFront } from "../../services/rh/rh.service";

export function useRhService() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // -----------------------------
    // Directions
    // -----------------------------
    const createDirection = useCallback(async (payload: CreateDirectionDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createDirection(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création de la direction");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllDirections = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getAllDirections();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des directions");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDirectionById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getDirectionById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération de la direction");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Services
    // -----------------------------
    const createService = useCallback(async (payload: CreateServiceDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createService(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du service");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllServices = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getAllServices();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des services");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getServiceById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getServiceById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du service");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Personnel
    // -----------------------------
    const createPersonnel = useCallback(async (payload: CreatePersonnelDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createPersonnel(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllPersonnel = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getAllPersonnel();
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
            return await rhServiceFront.getPersonnelById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePersonnel = useCallback(async (id: string, payload: UpdatePersonnelDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.updatePersonnel(id, payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePersonnel = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.deletePersonnel(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Type de congé
    // -----------------------------
    const createTypeConge = useCallback(async (payload: CreateTypeCongeDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createTypeConge(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du type de congé");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Statistiques RH
    // -----------------------------
    const getStatistics = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getStatistics();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des statistiques RH");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Demandes de congé
    // -----------------------------
    const getDemandes = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getDemandes();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des demandes");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        createDirection,
        getAllDirections,
        getDirectionById,
        createService,
        getAllServices,
        getServiceById,
        createPersonnel,
        getAllPersonnel,
        getPersonnelById,
        updatePersonnel,
        deletePersonnel,
        createTypeConge,
        getStatistics,
        getDemandes
    };
}
