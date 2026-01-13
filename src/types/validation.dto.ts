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

export interface UpdatePasswordDto {
    ancien_mot_de_passe: string;
    nouveau_mot_de_passe: string;
}

export interface UpdatePersonalInfoDto {
    telephone_travail?: string;
    telephone_personnel?: string;
    ville_personnel?: string;
    telephone_contact_urgence?: string;
    nom_contact_urgence?: string;
    date_naissance?: string;
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
    auteur_message: string;
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




// src/types/validation.dto.ts

// -----------------------------
// Direction
// -----------------------------
export interface CreateDirectionDto {
    code_direction: string;
    nom_direction: string;
    nom_directeur: string;
    email_direction: string; // Requis selon le backend (@IsEmail, @IsNotEmpty)
    nb_personnel?: number; // Optionnel selon le backend (@IsOptional)
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
    id_chefdeservice?: string;
    // nb_personnel a une valeur par défaut dans le modèle Prisma
    // et ne doit pas être envoyé au backend
}

// -----------------------------
// Personnel
// -----------------------------
export type RolePersonnel = 'ADMIN' | 'RH' | 'CHEF_SERVICE' | 'EMPLOYE';
export type TypePersonnel = 'PERMANENT' | 'CONTRACTUEL' | 'STAGIAIRE';
export type TypeContrat = 'CDI' | 'CDD' | 'STAGE' | 'FREELANCE';
export type StatutPersonnel = 'ACTIF' | 'SUSPENDU' | 'EN_CONGE' | 'DEMISSIONNE' | 'LICENCIE';

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
    poste?: string;
    type_contrat?: TypeContrat;
    date_embauche?: string;
    date_fin_contrat?: string;
    salaire_base?: number;
    niveau_hierarchique?: string;
    numero_cnps?: string;
    banque_nom?: string;
    banque_rib?: string;
    statut_professionnel?: StatutPersonnel;
}

export interface UpdatePersonnelDto {
    nom_personnel?: string;
    prenom_personnel?: string;
    email_travail?: string;
    email_personnel?: string;
    matricule_personnel?: string;
    telephone_travail?: string;
    telephone_personnel?: string;
    ville_personnel?: string;
    adresse_personnel?: string;
    codepostal?: string;
    pays_personnel?: string;
    telephone_contact_urgence?: string;
    nom_contact_urgence?: string;
    date_naissance?: string;
    role_personnel?: RolePersonnel;
    type_personnel?: TypePersonnel;
    is_active?: boolean;
    poste?: string;
    type_contrat?: TypeContrat;
    date_embauche?: string;
    date_fin_contrat?: string;
    salaire_base?: number;
    niveau_hierarchique?: string;
    numero_cnps?: string;
    banque_nom?: string;
    banque_rib?: string;
    statut_professionnel?: StatutPersonnel;
}

// -----------------------------
// Type de congé
// -----------------------------
export interface CreateTypeCongeDto {
    libelle_typeconge: string;
    is_active?: boolean;
}

export interface CreateInteractionRhDto {
    titre: string;
    message: string;
    date?: string;
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
    id_direction?: string; // Pour l'édition, pas dans le DTO backend
    code_direction: string;
    nom_direction: string;
    nom_directeur: string;
    email_direction: string; // Requis selon le backend (@IsEmail, @IsNotEmpty)
    nb_personnel?: number; // Optionnel selon le backend (@IsOptional)
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
// Contrats
// -----------------------------
export type TypeContratEnum = 'CDI' | 'CDD' | 'STAGE' | 'CONSULTANT';

export interface CreateContratDto {
    type_contrat: TypeContratEnum;
    date_debut: string; // Date au format ISO string
    date_fin?: string; // Date au format ISO string
    salaire_reference?: number;
    url_contrat?: string;
    statut?: string;
    id_personnel: string;
}

export interface UpdateContratDto {
    type_contrat?: TypeContratEnum;
    date_debut?: string;
    date_fin?: string;
    salaire_reference?: number;
    url_contrat?: string;
    statut?: string;
}

// -----------------------------
// Paies
// -----------------------------
export interface CreatePaieDto {
    mois: number; // 1-12
    annee: number; // >= 2000
    salaire_net: number;
    salaire_brut: number;
    primes?: number;
    deductions?: number;
    url_bulletin?: string;
    id_personnel: string;
}

export interface UpdatePaieDto {
    mois?: number;
    annee?: number;
    salaire_net?: number;
    salaire_brut?: number;
    primes?: number;
    deductions?: number;
    url_bulletin?: string;
}

// -----------------------------
// Documents du Personnel
// -----------------------------
export type TypeDocumentEnum = 'CNI' | 'CONTRAT' | 'DIPLOME' | 'ATTestation';

export interface CreatePersonnelDocumentDto {
    type_document: TypeDocumentEnum;
    id_personnel: string;
    url_document?: string; // Optionnel car le fichier est envoyé séparément
}

export interface UpdatePersonnelDocumentDto {
    type_document?: TypeDocumentEnum;
    url_document?: string;
}

// -----------------------------
// Fiche de Demande
// -----------------------------
export interface CreateFicheDemandeDto {
    id_demande: string;
    id_personnel: string;
    id_service?: string;
    url?: string; // URL du fichier uploadé (généré par le backend après upload)
}

export interface UpdateFicheDemandeDto {
    id_service?: string;
    url?: string; // URL du nouveau fichier uploadé (optionnel)
}