import { ENDPOINTS_COMPTABILITE } from "../../api/comptabilite/Endpoint";
import { Http } from "../../api/http";

class ComptabiliteService {
    // -----------------------------
    // Personnel
    // -----------------------------
    async getAllPersonnel() {
        return Http(ENDPOINTS_COMPTABILITE.getAllPersonnel, {
            method: 'GET',
        });
    }

    async getPersonnelById(id: string) {
        return Http(ENDPOINTS_COMPTABILITE.getPersonnelById(id), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Contrats
    // -----------------------------
    async getAllContrats() {
        return Http(ENDPOINTS_COMPTABILITE.getAllContrats, {
            method: 'GET',
        });
    }

    async getContratById(id: string) {
        return Http(ENDPOINTS_COMPTABILITE.getContratById(id), {
            method: 'GET',
        });
    }

    async getContratsByPersonnel(idPersonnel: string) {
        return Http(ENDPOINTS_COMPTABILITE.getContratsByPersonnel(idPersonnel), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Paies
    // -----------------------------
    async createPaie(payload: FormData) {
        return Http(ENDPOINTS_COMPTABILITE.createPaie, {
            method: 'POST',
            body: payload,
        });
    }

    async getAllPaies() {
        return Http(ENDPOINTS_COMPTABILITE.getAllPaies, {
            method: 'GET',
        });
    }

    async getPaieById(id: string) {
        return Http(ENDPOINTS_COMPTABILITE.getPaieById(id), {
            method: 'GET',
        });
    }

    async getPaiesByPersonnel(idPersonnel: string) {
        return Http(ENDPOINTS_COMPTABILITE.getPaiesByPersonnel(idPersonnel), {
            method: 'GET',
        });
    }

    // -----------------------------
    // Bulletins de paie
    // -----------------------------
    async createBulletinPaie(payload: FormData) {
        return Http(ENDPOINTS_COMPTABILITE.createBulletinPaie, {
            method: 'POST',
            body: payload,
        });
    }

    async getAllBulletinsPaie() {
        return Http(ENDPOINTS_COMPTABILITE.getAllBulletinsPaie, {
            method: 'GET',
        });
    }

    async getBulletinPaieById(id: string) {
        return Http(ENDPOINTS_COMPTABILITE.getBulletinPaieById(id), {
            method: 'GET',
        });
    }

    async updateBulletinPaie(id: string, payload: any) {
        return Http(ENDPOINTS_COMPTABILITE.updateBulletinPaie(id), {
            method: 'PUT',
            body: payload,
        });
    }

    async deleteBulletinPaie(id: string) {
        return Http(ENDPOINTS_COMPTABILITE.deleteBulletinPaie(id), {
            method: 'DELETE',
        });
    }

    async getBulletinsPaieByPersonnel(idPersonnel: string) {
        return Http(ENDPOINTS_COMPTABILITE.getBulletinsPaieByPersonnel(idPersonnel), {
            method: 'GET',
        });
    }
}

// Export d'une instance singleton
export const comptabiliteService = new ComptabiliteService();

