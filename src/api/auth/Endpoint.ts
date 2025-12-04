export const ENDPOINTS_AUTH = {
    login: '/auth/login', // POST : Connexion du personnel, retourne un token JWT
    changePassword: '/auth/change-password', // PATCH : Mettre à jour le mot de passe de l'utilisateur connecté
    updatePassword: (id: string) => `/user/password/${id}`, // PUT : Mettre à jour le mot de passe avec ID
    updatePersonalInfo: (id: string) => `/user/info/${id}`, // PUT : Mettre à jour les informations personnelles avec ID
};
