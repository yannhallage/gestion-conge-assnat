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
    };
    redirect: string; // ✅ ajoute cette ligne
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


export interface CreateDemandePayload {
    type_demande: string;
    motif?: string;
    id_service?: string;
    id_periodeconge?: string;
    id_chef_service?: string;
    date_debut: string;
    date_fin: string;
    nb_jour: number;
    id_typeconge: string;
}

export interface CreateDiscussionPayload {
    message: string;
    heure_message?: string;
}
