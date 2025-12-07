export const ENDPOINTS_COMPTABILITE = {
    // Personnel
    getAllPersonnel: '/comptabilite/personnel',               // GET
    getPersonnelById: (id: string) => `/comptabilite/personnel/${id}`, // GET

    // Contrats
    getAllContrats: '/comptabilite/contrats',                // GET
    getContratById: (id: string) => `/comptabilite/contrats/${id}`, // GET
    getContratsByPersonnel: (idPersonnel: string) => `/comptabilite/personnel/${idPersonnel}/contrats`, // GET

    // Paies
    createPaie: '/comptabilite/paies',                       // POST
    getAllPaies: '/comptabilite/paies',                      // GET
    getPaieById: (id: string) => `/comptabilite/paies/${id}`, // GET
    getPaiesByPersonnel: (idPersonnel: string) => `/comptabilite/personnel/${idPersonnel}/paies`, // GET

    // Bulletins de paie
    createBulletinPaie: '/comptabilite/bulletins-paie',      // POST
    getAllBulletinsPaie: '/comptabilite/bulletins-paie',     // GET
    getBulletinPaieById: (id: string) => `/comptabilite/bulletins-paie/${id}`, // GET
    updateBulletinPaie: (id: string) => `/comptabilite/bulletins-paie/${id}`, // PUT
    deleteBulletinPaie: (id: string) => `/comptabilite/bulletins-paie/${id}`, // DELETE
    getBulletinsPaieByPersonnel: (idPersonnel: string) => `/comptabilite/personnel/${idPersonnel}/bulletins-paie`, // GET
};

