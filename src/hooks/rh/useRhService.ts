// src/hooks/useRhService.ts
import { useState, useCallback } from "react";
import type {
    CreateDirectionDto,
    CreateServiceDto,
    CreatePersonnelDto,
    UpdatePersonnelDto,
    CreateTypeCongeDto,
    CreateInteractionRhDto,
    CreateContratDto,
    UpdateContratDto,
    CreatePaieDto,
    UpdatePaieDto,
    CreatePersonnelDocumentDto,
    UpdatePersonnelDocumentDto
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

    // -----------------------------
    // Interactions RH
    // -----------------------------
    const createInteractionRh = useCallback(async (payload: CreateInteractionRhDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createInteractionRh(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création de l'interaction RH");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllInteractionsRh = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getAllInteractionsRh();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des interactions RH");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteInteractionRh = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.deleteInteractionRh(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression de l'interaction RH");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Contrats
    // -----------------------------
    const createContrat = useCallback(async (payload: CreateContratDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createContrat(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du contrat");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllContrats = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getAllContrats();
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
            return await rhServiceFront.getContratById(id);
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
            return await rhServiceFront.getContratsByPersonnel(idPersonnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des contrats du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateContrat = useCallback(async (id: string, payload: UpdateContratDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.updateContrat(id, payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour du contrat");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteContrat = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.deleteContrat(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression du contrat");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Paies
    // -----------------------------
    const createPaie = useCallback(async (payload: CreatePaieDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createPaie(payload);
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
            return await rhServiceFront.getAllPaies();
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
            return await rhServiceFront.getPaieById(id);
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
            return await rhServiceFront.getPaiesByPersonnel(idPersonnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des paies du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPaiesByMoisAnnee = useCallback(async (mois: number, annee: number) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getPaiesByMoisAnnee(mois, annee);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des paies");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePaie = useCallback(async (id: string, payload: UpdatePaieDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.updatePaie(id, payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour de la paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePaie = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.deletePaie(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression de la paie");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // -----------------------------
    // Documents du Personnel
    // -----------------------------
    const createPersonnelDocument = useCallback(async (payload: CreatePersonnelDocumentDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.createPersonnelDocument(payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la création du document");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getAllPersonnelDocuments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getAllPersonnelDocuments();
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des documents");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPersonnelDocumentById = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getPersonnelDocumentById(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération du document");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPersonnelDocumentsByPersonnel = useCallback(async (idPersonnel: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getPersonnelDocumentsByPersonnel(idPersonnel);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des documents du personnel");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getPersonnelDocumentsByType = useCallback(async (idPersonnel: string, type: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.getPersonnelDocumentsByType(idPersonnel, type);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la récupération des documents");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const updatePersonnelDocument = useCallback(async (id: string, payload: UpdatePersonnelDocumentDto) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.updatePersonnelDocument(id, payload);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la mise à jour du document");
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const deletePersonnelDocument = useCallback(async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            return await rhServiceFront.deletePersonnelDocument(id);
        } catch (err: any) {
            setError(err.message || "Erreur lors de la suppression du document");
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
        getDemandes,
        createInteractionRh,
        getAllInteractionsRh,
        deleteInteractionRh,
        createContrat,
        getAllContrats,
        getContratById,
        getContratsByPersonnel,
        updateContrat,
        deleteContrat,
        createPaie,
        getAllPaies,
        getPaieById,
        getPaiesByPersonnel,
        getPaiesByMoisAnnee,
        updatePaie,
        deletePaie,
        createPersonnelDocument,
        getAllPersonnelDocuments,
        getPersonnelDocumentById,
        getPersonnelDocumentsByPersonnel,
        getPersonnelDocumentsByType,
        updatePersonnelDocument,
        deletePersonnelDocument
    };
}
