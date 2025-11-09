import { ENDPOINTS_RH } from "../../api/rh/Endpoint";
import { Http } from "../../api/http";
import type {
    CreateDirectionDto,
    CreateServiceDto,
    CreatePersonnelDto,
    UpdatePersonnelDto,
    CreateTypeCongeDto
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
        const { is_active, ...safePayload } = payload as UpdatePersonnelDto & { is_active?: boolean };
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
}

// Export d’une instance singleton
export const rhServiceFront = new RhServiceFront();
