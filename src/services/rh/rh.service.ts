import { ENDPOINTS_RH } from "../../api/rh/Endpoint";
import { Http } from "../../api/http";
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

class RhServiceFront {
    // -----------------------------
    // Directions
    // -----------------------------
    async createDirection(payload: CreateDirectionDto) {
        return Http(ENDPOINTS_RH.createDirection, {
            method: 'POST',
            body: payload,
        });
    }

    async getAllDirections() {
        return Http(ENDPOINTS_RH.getAllDirections, {
            method: 'GET',
        });
    }

    async getDirectionById(id: string) {
        return Http(ENDPOINTS_RH.getDirectionById(id), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Services
    // -----------------------------
    async createService(payload: CreateServiceDto) {
        return Http(ENDPOINTS_RH.createService, {
            method: 'POST',
            body: payload,
        });
    }

    async getAllServices() {
        return Http(ENDPOINTS_RH.getAllServices, {
            method: 'GET',
        });
    }

    async getServiceById(id: string) {
        return Http(ENDPOINTS_RH.getServiceById(id), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Personnel
    // -----------------------------
    async createPersonnel(payload: CreatePersonnelDto) {
        const { is_active, ...safePayload } = payload as CreatePersonnelDto & { is_active?: boolean };
        return Http(ENDPOINTS_RH.createPersonnel, {
            method: 'POST',
            body: safePayload,
        });
    }

    async getAllPersonnel() {
        return Http(ENDPOINTS_RH.getAllPersonnel, {
            method: 'GET',
        });
    }

    async getPersonnelById(id: string) {
        return Http(ENDPOINTS_RH.getPersonnelById(id), {
            method: 'GET',
        });
    }

    async updatePersonnel(id: string, payload: UpdatePersonnelDto) {
        const { is_active, ...restPayload } = payload as UpdatePersonnelDto & { is_active?: boolean };
        
        // Filtrer les propriétés undefined et les chaînes vides pour éviter les erreurs de validation du backend
        const safePayload = Object.fromEntries(
            Object.entries(restPayload).filter(([_, value]) => {
                // Garder les valeurs non-undefined et non-vides (pour les strings)
                if (value === undefined) return false;
                if (typeof value === 'string' && value.trim() === '') return false;
                return true;
            })
        ) as UpdatePersonnelDto;
        
        return Http(ENDPOINTS_RH.updatePersonnel(id), {
            method: 'PUT',
            body: safePayload,
        });
    }

    async deletePersonnel(id: string) {
        return Http(ENDPOINTS_RH.deletePersonnel(id), {
            method: 'DELETE',
        });
    }

    // -----------------------------
    // Types de congé
    // -----------------------------
    async createTypeConge(payload: CreateTypeCongeDto) {
        return Http(ENDPOINTS_RH.createTypeConge, {
            method: 'POST',
            body: payload,
        });
    }

    // -----------------------------
    // Statistiques RH
    // -----------------------------
    async getStatistics() {
        return Http(ENDPOINTS_RH.getStatistics, {
            method: 'GET',
        });
    }

    // -----------------------------
    // Demandes de congé
    // -----------------------------
    async getDemandes() {
        return Http(ENDPOINTS_RH.getDemandes, {
            method: 'GET',
        });
    }

    async getHistoriqueDemandes() {
        return Http(ENDPOINTS_RH.getHistoriqueDemandes, {
            method: 'GET',
        });
    }

    // -----------------------------
    // Interactions RH
    // -----------------------------
    async createInteractionRh(payload: CreateInteractionRhDto) {
        return Http(ENDPOINTS_RH.createInteractionRh, {
            method: 'POST',
            body: payload,
        });
    }

    async getAllInteractionsRh() {
        return Http(ENDPOINTS_RH.getAllInteractionsRh, {
            method: 'GET',
        });
    }

    async deleteInteractionRh(id: string) {
        return Http(ENDPOINTS_RH.deleteInteractionRh(id), {
            method: 'DELETE',
        });
    }

    // -----------------------------
    // Contrats
    // -----------------------------
    async createContrat(payload: CreateContratDto, file?: File) {
        if (file) {
            // Créer FormData pour l'upload de fichier
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type_contrat', payload.type_contrat);
            formData.append('date_debut', payload.date_debut);
            if (payload.date_fin) {
                formData.append('date_fin', payload.date_fin);
            }
            if (payload.salaire_reference !== undefined) {
                formData.append('salaire_reference', payload.salaire_reference.toString());
            }
            if (payload.statut) {
                formData.append('statut', payload.statut);
            }
            formData.append('id_personnel', payload.id_personnel);

            return Http(ENDPOINTS_RH.createContrat, {
                method: 'POST',
                body: formData,
            });
        } else {
            // Fallback sans fichier (pour compatibilité)
            return Http(ENDPOINTS_RH.createContrat, {
                method: 'POST',
                body: payload,
            });
        }
    }

    async getAllContrats() {
        return Http(ENDPOINTS_RH.getAllContrats, {
            method: 'GET',
        });
    }

    async getContratById(id: string) {
        return Http(ENDPOINTS_RH.getContratById(id), {
            method: 'GET',
        });
    }

    async getContratsByPersonnel(idPersonnel: string) {
        return Http(ENDPOINTS_RH.getContratsByPersonnel(idPersonnel), {
            method: 'GET',
        });
    }

    async updateContrat(id: string, payload: UpdateContratDto) {
        return Http(ENDPOINTS_RH.updateContrat(id), {
            method: 'PUT',
            body: payload,
        });
    }

    async deleteContrat(id: string) {
        return Http(ENDPOINTS_RH.deleteContrat(id), {
            method: 'DELETE',
        });
    }

    // -----------------------------
    // Paies
    // -----------------------------
    async createPaie(payload: CreatePaieDto, file?: File) {
        if (file) {
            // Créer FormData pour l'upload de fichier
            const formData = new FormData();
            formData.append('file', file);
            formData.append('mois', payload.mois.toString());
            formData.append('annee', payload.annee.toString());
            formData.append('salaire_net', payload.salaire_net.toString());
            formData.append('salaire_brut', payload.salaire_brut.toString());
            if (payload.primes !== undefined) {
                formData.append('primes', payload.primes.toString());
            }
            if (payload.deductions !== undefined) {
                formData.append('deductions', payload.deductions.toString());
            }
            formData.append('id_personnel', payload.id_personnel);

            return Http(ENDPOINTS_RH.createPaie, {
                method: 'POST',
                body: formData,
            });
        } else {
            // Fallback sans fichier (pour compatibilité)
            return Http(ENDPOINTS_RH.createPaie, {
                method: 'POST',
                body: payload,
            });
        }
    }

    async getAllPaies() {
        return Http(ENDPOINTS_RH.getAllPaies, {
            method: 'GET',
        });
    }

    async getPaieById(id: string) {
        return Http(ENDPOINTS_RH.getPaieById(id), {
            method: 'GET',
        });
    }

    async getPaiesByPersonnel(idPersonnel: string) {
        return Http(ENDPOINTS_RH.getPaiesByPersonnel(idPersonnel), {
            method: 'GET',
        });
    }

    async getPaiesByMoisAnnee(mois: number, annee: number) {
        return Http(ENDPOINTS_RH.getPaiesByMoisAnnee(mois.toString(), annee.toString()), {
            method: 'GET',
        });
    }

    async updatePaie(id: string, payload: UpdatePaieDto) {
        return Http(ENDPOINTS_RH.updatePaie(id), {
            method: 'PUT',
            body: payload,
        });
    }

    async deletePaie(id: string) {
        return Http(ENDPOINTS_RH.deletePaie(id), {
            method: 'DELETE',
        });
    }

    // -----------------------------
    // Documents du Personnel
    // -----------------------------
    async createPersonnelDocument(payload: CreatePersonnelDocumentDto, file?: File) {
        if (file) {
            // Créer FormData pour l'upload de fichier
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type_document', payload.type_document);
            formData.append('id_personnel', payload.id_personnel);

            return Http(ENDPOINTS_RH.createPersonnelDocument, {
                method: 'POST',
                body: formData,
            });
        } else {
            // Fallback sans fichier (pour compatibilité)
            return Http(ENDPOINTS_RH.createPersonnelDocument, {
                method: 'POST',
                body: payload,
            });
        }
    }

    async getAllPersonnelDocuments() {
        return Http(ENDPOINTS_RH.getAllPersonnelDocuments, {
            method: 'GET',
        });
    }

    async getPersonnelDocumentById(id: string) {
        return Http(ENDPOINTS_RH.getPersonnelDocumentById(id), {
            method: 'GET',
        });
    }

    async getPersonnelDocumentsByPersonnel(idPersonnel: string) {
        return Http(ENDPOINTS_RH.getPersonnelDocumentsByPersonnel(idPersonnel), {
            method: 'GET',
        });
    }

    async getPersonnelDocumentsByType(idPersonnel: string, type: string) {
        return Http(ENDPOINTS_RH.getPersonnelDocumentsByType(idPersonnel, type), {
            method: 'GET',
        });
    }

    async updatePersonnelDocument(id: string, payload: UpdatePersonnelDocumentDto) {
        return Http(ENDPOINTS_RH.updatePersonnelDocument(id), {
            method: 'PUT',
            body: payload,
        });
    }

    async deletePersonnelDocument(id: string) {
        return Http(ENDPOINTS_RH.deletePersonnelDocument(id), {
            method: 'DELETE',
        });
    }
}

// Export d'une instance singleton
export const rhServiceFront = new RhServiceFront();
