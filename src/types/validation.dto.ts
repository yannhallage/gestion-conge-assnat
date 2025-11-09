export interface LoginPayload {
    email_personnel: string;
    password: string;
}

export interface LoginResponse {
    access_token: string;
    user: {
        id: string;
        email: string;
        nom: string;
        prenom: string;
        role: string;
        id_service: string;
    };
    redirect: string; // ✅ ajoute cette ligne
}

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
}



export interface ApproveDemandePayload {
    commentaire?: string;
}

export interface RejectDemandePayload {
    motif: string;
}

export interface InvitePersonnelPayload {
    email_personnel: string;
    nom_personnel: string;
    prenom_personnel: string;
    role_personnel?: 'EMPLOYE' | 'CHEF_SERVICE' | 'RH' | 'ADMIN';
    type_personnel?: 'PERMANENT' | 'CONTRACTUEL';
}

export interface CreateDiscussionPayload {
    message: string;
    heure_message?: string;
}

export interface ChefActionPayload {
    id_personnel: string;
    id_service: string;
    email_travail?: string;
}


export interface CreateDemandePayload {
    type_demande: string;
    motif?: string;
    // id_service?: string;
    id_periodeconge?: string;
    // id_chef_service?: string;
    date_debut: string;
    date_fin: string;
    nb_jour: number;
    id_typeconge: string;
}

export interface CreateDiscussionPayload {
    message: string;
    heure_message?: string;
}




// src/types/validation.dto.ts

// -----------------------------
// Direction
// -----------------------------
export interface CreateDirectionDto {
    code_direction: string;
    nom_direction: string;
    nom_directeur: string;
    email_direction?: string;
    numero_direction?: string;
    business_email?: string;
    business_phone?: string;
    directeur_email?: string;
    directeur_phone?: string;
    nombre_bureau?: string;
    nombre_service?: string;
    motif_creation?: string;
    statut?: string;
}

// -----------------------------
// Service
// -----------------------------
export interface CreateServiceDto {
    code_service: string;
    nom_service: string;
    id_direction: string;
    nb_personnel?: number;
}

// -----------------------------
// Personnel
// -----------------------------
export type RolePersonnel = 'ADMIN' | 'RH' | 'CHEF_SERVICE' | 'EMPLOYE';
export type TypePersonnel = 'PERMANENT' | 'CONTRACTUEL' | 'STAGIAIRE';

export interface CreatePersonnelDto {
    nom_personnel: string;
    prenom_personnel: string;
    email_travail: string;
    email_personnel?: string;
    password: string;
    matricule_personnel?: string;
    telephone_travail?: string;
    telephone_personnel?: string;
    ville_personnel?: string;
    adresse_personnel?: string;
    codepostal?: string;
    pays_personnel?: string;
    telephone_contact_urgence?: string;
    nom_contact_urgence?: string;
    role_personnel: RolePersonnel;
    type_personnel: TypePersonnel;
    id_service: string;
}

export interface UpdatePersonnelDto {
    nom_personnel?: string;
    prenom_personnel?: string;
    email_travail?: string;
    email_personnel?: string;
    matricule_personnel?: string;
    telephone_travail?: string;
    telephone_personnel?: string;
    role_personnel?: RolePersonnel;
    type_personnel?: TypePersonnel;
}

// -----------------------------
// Type de congé
// -----------------------------
export interface CreateTypeCongeDto {
    libelle_typeconge: string;
    is_active?: boolean;
}



export interface Service {
    id_service: string;
    code_service: string;
    nom_service: string;
    nb_personnel: number;
    date_creation: string; // ou Date si tu veux convertir
    id_direction: string;
}

export interface Direction {
    id_direction: string;
    code_direction: string;
    nom_direction: string;
    nb_personnel: number;
    nom_directeur: string;
    email_direction: string;
    numero_direction?: string;
    business_email?: string;
    business_phone?: string;
    directeur_email?: string;
    directeur_phone?: string;
    nombre_bureau?: string;
    nombre_service?: string;
    motif_creation?: string;
    statut: "ACTIF" | "INACTIF" | string; // tu peux mettre d'autres statuts si nécessaire
    date_creation: string; // ou Date si tu convertis
    services: Service[];
}


export interface CreateDirectionForm {
    id_direction?: string;
    code_direction: string;
    nom_direction: string;
    nom_directeur: string;
    email_direction?: string;
    numero_direction?: string;
    business_email?: string;
    business_phone?: string;
    directeur_email?: string;
    directeur_phone?: string;
    nombre_bureau?: string;
    nombre_service?: string;
    motif_creation?: string;
    statut?: string;
}
