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

    // (Alertes désactivées pour l’instant)
    // createAlert: '/rh/alerts',                    // POST
};
