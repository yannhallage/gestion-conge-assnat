export const ENDPOINTS_NOTIFICATIONS = {
    // Récupérer toutes les notifications de l'utilisateur connecté
    getNotifications: '/notifications',                     // GET (query: isLu?)
    
    // Récupérer le nombre de notifications non lues
    getUnreadCount: '/notifications/unread/count',         // GET
    
    // Marquer une notification comme lue
    markAsRead: (id: string) => `/notifications/${id}/read`, // PUT
    
    // Marquer toutes les notifications comme lues
    markAllAsRead: '/notifications/read-all',              // PUT
};

