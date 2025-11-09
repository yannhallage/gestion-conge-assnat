export const ENDPOINTS_EMPLOYE = {
    // Demandes
    createDemande: '/user/demandes',                         // POST : créer une nouvelle demande (query: id_personnel)
    getMyDemandes: '/user/demandes',                        // GET : récupérer toutes mes demandes
    getDemandeDetails: (id: string) => `/user/demandes/${id}`, // GET : détails d'une demande
    addDiscussion: (demandeId: string) => `/user/demandes/${demandeId}/discussions`, // POST : ajouter une discussion (query: id_personnel)
    getDiscussions: (demandeId: string) => `/user/demandes/${demandeId}/discussions`, // GET : récupérer les discussions

    // Types de congé
    getTypesConge: '/user/types-conge',                     // GET : récupérer tous les types de congé actifs

    // Historique
    getHistoriqueDemandes: '/user/historique-demandes',

    // (Pour les futures fonctionnalités)
    // createPeriodeConge: '/user/periodes-conge',          // POST : créer une période de congé
};
