import { ENDPOINTS_FICHE_DEMANDE } from "../../api/fiche-demande/Endpoint";
import { Http } from "../../api/http";
import type {
    CreateFicheDemandeDto,
    UpdateFicheDemandeDto
} from '../../types/validation.dto';

class FicheDemandeService {
    // -----------------------------
    // Créer une fiche de demande avec upload de fichier
    // -----------------------------
    async createFicheDemande(payload: CreateFicheDemandeDto, file: File) {
        // Créer FormData pour l'upload de fichier
        const formData = new FormData();
        formData.append('file', file);
        formData.append('id_demande', payload.id_demande);
        formData.append('id_personnel', payload.id_personnel);
        if (payload.id_service) {
            formData.append('id_service', payload.id_service);
        }

        // Log pour débogage
        console.log('[FicheDemandeService] Création de fiche de demande:', {
            endpoint: ENDPOINTS_FICHE_DEMANDE.createFicheDemande,
            id_demande: payload.id_demande,
            id_personnel: payload.id_personnel,
            id_service: payload.id_service,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
        });

        try {
            const result = await Http(ENDPOINTS_FICHE_DEMANDE.createFicheDemande, {
                method: 'POST',
                body: formData,
            });
            console.log('[FicheDemandeService] Fiche de demande créée avec succès:', result);
            return result;
        } catch (error: any) {
            console.error('[FicheDemandeService] Erreur lors de la création de la fiche:', error);
            throw error;
        }
    }

    // -----------------------------
    // Récupérer toutes les fiches de demande
    // -----------------------------
    async getAllFichesDemande() {
        return Http(ENDPOINTS_FICHE_DEMANDE.getAllFichesDemande, {
            method: 'GET',
        });
    }

    // -----------------------------
    // Récupérer une fiche de demande par ID
    // -----------------------------
    async getFicheDemandeById(id: string) {
        return Http(ENDPOINTS_FICHE_DEMANDE.getFicheDemandeById(id), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Récupérer une fiche de demande par ID de demande
    // -----------------------------
    async getFicheDemandeByDemandeId(id_demande: string) {
        return Http(ENDPOINTS_FICHE_DEMANDE.getFicheDemandeByDemandeId(id_demande), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Récupérer les fiches de demande par ID de personnel
    // -----------------------------
    async getFichesDemandeByPersonnelId(id_personnel: string) {
        return Http(ENDPOINTS_FICHE_DEMANDE.getFichesDemandeByPersonnelId(id_personnel), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Mettre à jour une fiche de demande (avec ou sans nouveau fichier)
    // -----------------------------
    async updateFicheDemande(id: string, payload: UpdateFicheDemandeDto, file?: File) {
        if (file) {
            // Si un fichier est fourni, créer FormData
            const formData = new FormData();
            formData.append('file', file);
            if (payload.id_service) {
                formData.append('id_service', payload.id_service);
            }

            return Http(ENDPOINTS_FICHE_DEMANDE.updateFicheDemande(id), {
                method: 'PATCH',
                body: formData,
            });
        } else {
            // Sinon, envoyer les données en JSON
            return Http(ENDPOINTS_FICHE_DEMANDE.updateFicheDemande(id), {
                method: 'PATCH',
                body: payload,
            });
        }
    }

    // -----------------------------
    // Supprimer une fiche de demande
    // -----------------------------
    async deleteFicheDemande(id: string) {
        return Http(ENDPOINTS_FICHE_DEMANDE.deleteFicheDemande(id), {
            method: 'DELETE',
        });
    }
}

// Export d'une instance singleton
export const ficheDemandeService = new FicheDemandeService();

