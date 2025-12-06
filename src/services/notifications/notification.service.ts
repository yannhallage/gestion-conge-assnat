import { ENDPOINTS_NOTIFICATIONS } from "../../api/notifications/Endpoint";
import { Http } from "../../api/http";

export interface Notification {
    id: string | number;
    title: string;
    message: string;
    date: string;
    isLu?: boolean;
    created_at?: string;
}

export interface UnreadCountResponse {
    count: number;
    id_personnel: string;
}

class NotificationService {
    /**
     * Récupérer toutes les notifications de l'utilisateur connecté
     * @param isLu Filtrer par statut de lecture (optionnel)
     */
    async getNotifications(isLu?: boolean): Promise<Notification[]> {
        const queryParams: Record<string, string> = {};
        if (isLu !== undefined) {
            queryParams.isLu = isLu.toString();
        }

        return Http<Notification[]>(ENDPOINTS_NOTIFICATIONS.getNotifications, {
            method: 'GET',
            queryParams,
        });
    }

    /**
     * Récupérer le nombre de notifications non lues
     */
    async getUnreadCount(): Promise<UnreadCountResponse> {
        return Http<UnreadCountResponse>(ENDPOINTS_NOTIFICATIONS.getUnreadCount, {
            method: 'GET',
        });
    }

    /**
     * Marquer une notification comme lue
     * @param idNotification ID de la notification
     */
    async markAsRead(idNotification: string) {
        return Http(ENDPOINTS_NOTIFICATIONS.markAsRead(idNotification), {
            method: 'PUT',
        });
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    async markAllAsRead() {
        return Http(ENDPOINTS_NOTIFICATIONS.markAllAsRead, {
            method: 'PUT',
        });
    }
}

// Export d'une instance singleton
export const notificationService = new NotificationService();

