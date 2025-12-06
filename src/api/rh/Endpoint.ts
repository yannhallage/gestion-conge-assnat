export const ENDPOINTS_RH = {
    // Directions
    createDirection: '/rh/directions',                 // POST
    getAllDirections: '/rh/directions',               // GET
    getDirectionById: (id: string) => `/rh/directions/${id}`, // GET

    // Services
    createService: '/rh/services',                    // POST
    getAllServices: '/rh/services',                   // GET
    getServiceById: (id: string) => `/rh/services/${id}`, // GET

    // Personnel
    createPersonnel: '/rh/personnels',               // POST
    getAllPersonnel: '/rh/personnels',               // GET
    getPersonnelById: (id: string) => `/rh/personnels/${id}`, // GET
    updatePersonnel: (id: string) => `/rh/personnels/${id}`,   // PUT
    deletePersonnel: (id: string) => `/rh/personnels/${id}`,   // DELETE

    // Type de congé
    createTypeConge: '/rh/types-conge',             // POST

    // Statistiques RH
    getStatistics: '/rh/statistics',                // GET

    // Demandes de congé
    getDemandes: '/rh/demandes',                    // GET

    // Interactions RH
    createInteractionRh: '/rh/interactions-rh',    // POST
    getAllInteractionsRh: '/rh/interactions-rh',   // GET
    deleteInteractionRh: (id: string) => `/rh/interactions-rh/${id}`, // DELETE

    // Contrats
    createContrat: '/rh/contrats',                 // POST
    getAllContrats: '/rh/contrats',                // GET
    getContratById: (id: string) => `/rh/contrats/${id}`, // GET
    getContratsByPersonnel: (idPersonnel: string) => `/rh/personnels/${idPersonnel}/contrats`, // GET
    updateContrat: (id: string) => `/rh/contrats/${id}`,   // PUT
    deleteContrat: (id: string) => `/rh/contrats/${id}`,   // DELETE

    // Paies
    createPaie: '/rh/paies',                       // POST
    getAllPaies: '/rh/paies',                      // GET
    getPaieById: (id: string) => `/rh/paies/${id}`, // GET
    getPaiesByPersonnel: (idPersonnel: string) => `/rh/personnels/${idPersonnel}/paies`, // GET
    getPaiesByMoisAnnee: (mois: string, annee: string) => `/rh/paies/mois/${mois}/annee/${annee}`, // GET
    updatePaie: (id: string) => `/rh/paies/${id}`, // PUT
    deletePaie: (id: string) => `/rh/paies/${id}`, // DELETE

    // Documents du Personnel
    createPersonnelDocument: '/rh/personnels/documents',                 // POST
    getAllPersonnelDocuments: '/rh/personnels/documents',                // GET
    getPersonnelDocumentById: (id: string) => `/rh/personnels/documents/${id}`, // GET
    getPersonnelDocumentsByPersonnel: (idPersonnel: string) => `/rh/personnels/${idPersonnel}/documents`, // GET
    getPersonnelDocumentsByType: (idPersonnel: string, type: string) => `/rh/personnels/${idPersonnel}/documents/type/${type}`, // GET
    updatePersonnelDocument: (id: string) => `/rh/personnels/documents/${id}`,   // PUT
    deletePersonnelDocument: (id: string) => `/rh/personnels/documents/${id}`,   // DELETE

    // (Alertes désactivées pour l'instant)
    // createAlert: '/rh/alerts',                    // POST
};
