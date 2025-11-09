export const ENDPOINTS_CHEFDESERVICE = {
  invitePersonnel: '/chef/personnel/invite',          // POST : Inviter un personnel
  getServiceDemandes: '/chef/demandes',              // GET : Consulter toutes les demandes du service (query param id_chef)
  approveDemande: (id: string) => `/chef/demandes/${id}/approve`,  // PUT : Approuver une demande
  rejectDemande: (id: string) => `/chef/demandes/${id}/reject`,    // PUT : Refuser une demande
  revokeDemande: (id: string) => `/chef/demandes/${id}/revoke`,    // PUT : Révoquer une demande
  deleteDemande: (id: string) => `/chef/demandes/${id}`,           // DELETE : Supprimer une demande
  getServicePersonnel: (serviceId: string) => `/chef/personnel/${serviceId}`, // GET : Consulter le personnel du service
  addDiscussion: (demandeId: string) => `/chef/demandes/${demandeId}/discussions`, // POST : Ajouter discussion à une demande
  getHistoriqueDemandes: '/chef/historique-demandes', // GET : Historique des demandes (terminées/refusées) du chef
};
