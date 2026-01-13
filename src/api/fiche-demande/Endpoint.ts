export const ENDPOINTS_FICHE_DEMANDE = {
    // Fiches de demande
    createFicheDemande: '/fiche-demande',                                    // POST
    getAllFichesDemande: '/fiche-demande',                                  // GET
    getFicheDemandeById: (id: string) => `/fiche-demande/${id}`,            // GET
    getFicheDemandeByDemandeId: (id_demande: string) => `/fiche-demande/demande/${id_demande}`, // GET
    getFichesDemandeByPersonnelId: (id_personnel: string) => `/fiche-demande/personnel/${id_personnel}`, // GET
    updateFicheDemande: (id: string) => `/fiche-demande/${id}`,             // PATCH
    deleteFicheDemande: (id: string) => `/fiche-demande/${id}`,             // DELETE
};

