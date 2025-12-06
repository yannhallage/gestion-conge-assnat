import { useEffect, useState, useCallback } from "react";
import { pusherService, type PusherNotification } from "../../services/pusher/pusher.service";
import { notificationService, type Notification } from "../../services/notifications/notification.service";
import { useAuth } from "../../contexts/AuthContext";

/**
 * Hook pour gérer les notifications en temps réel via Pusher
 */
export function usePusherNotifications() {
    const { user } = useAuth();
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [newNotification, setNewNotification] = useState<PusherNotification | null>(null);

    // Charger le nombre de notifications non lues
    const loadUnreadCount = useCallback(async () => {
        try {
            const response = await notificationService.getUnreadCount();
            setUnreadCount(response.count || 0);
        } catch (error) {
            console.error("Erreur lors du chargement du nombre de notifications non lues:", error);
        }
    }, []);

    // Écouter les notifications Pusher
    useEffect(() => {
        if (!user?.id) {
            return;
        }

        // Initialiser Pusher
        pusherService.init();

        // Channel par utilisateur : format selon votre backend
        // Le backend doit déclencher l'événement 'notification' sur ce channel
        // Format possible : "user-{id_personnel}" ou "{id_personnel}" ou autre
        // Ajustez selon votre implémentation backend
        const channelName = `user-${user.id}`;

        // Callback quand une nouvelle notification arrive
        const handleNotification = (data: PusherNotification) => {
            console.log("📩 Nouvelle notification reçue via Pusher:", data);
            
            // Mettre à jour le compteur
            if (!data.is_lu) {
                setUnreadCount(prev => prev + 1);
            }
            
            // Stocker la nouvelle notification
            setNewNotification(data);

            // Optionnel : Afficher une notification toast
            // toast.success(data.titre, { description: data.message });
        };

        // S'abonner au channel
        const unsubscribe = pusherService.subscribe(channelName, handleNotification);

        // Charger le compteur initial
        loadUnreadCount();

        // Cleanup
        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user?.id, loadUnreadCount]);

    // Réinitialiser la nouvelle notification après un certain temps
    useEffect(() => {
        if (newNotification) {
            const timer = setTimeout(() => {
                setNewNotification(null);
            }, 5000); // Réinitialiser après 5 secondes

            return () => clearTimeout(timer);
        }
    }, [newNotification]);

    // Fonction pour marquer comme lu et mettre à jour le compteur
    const markAsRead = useCallback(async (notificationId: string | number) => {
        try {
            await notificationService.markAsRead(notificationId.toString());
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Erreur lors du marquage comme lu:", error);
        }
    }, []);

    // Fonction pour recharger le compteur
    const refreshUnreadCount = useCallback(() => {
        loadUnreadCount();
    }, [loadUnreadCount]);

    return {
        unreadCount,
        newNotification,
        markAsRead,
        refreshUnreadCount,
    };
}

