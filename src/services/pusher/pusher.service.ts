// Déclaration globale pour Pusher
declare global {
    interface Window {
        Pusher: any;
    }
}

export interface PusherNotification {
    id_notification: string | number;
    titre: string;
    message: string;
    is_lu: boolean;
    date_creation: string;
    id_demande?: string | number;
}

class PusherService {
    private pusher: any = null;
    private channels: Map<string, any> = new Map();
    private listeners: Map<string, Set<(data: PusherNotification) => void>> = new Map();

    /**
     * Initialise Pusher
     */
    init() {
        if (typeof window === 'undefined' || !window.Pusher) {
            console.warn('Pusher non disponible');
            return;
        }

        if (this.pusher) {
            return; // Déjà initialisé
        }

        try {
            // Active logs en développement uniquement
            if (import.meta.env.DEV) {
                window.Pusher.logToConsole = true;
            }

            this.pusher = new window.Pusher("b212022df5a0f50d3ca0", {
                cluster: "mt1",
            });

            console.log('✅ Pusher initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de Pusher:', error);
        }
    }

    /**
     * S'abonner à un channel et écouter les notifications
     * @param channelName Nom du channel (ex: "user-{id_personnel}")
     * @param onNotification Callback appelé quand une notification arrive
     */
    subscribe(channelName: string, onNotification: (data: PusherNotification) => void) {
        if (!this.pusher) {
            this.init();
            if (!this.pusher) {
                console.warn('Pusher non initialisé');
                return () => {}; // Retourne une fonction de nettoyage vide
            }
        }

        try {
            // S'abonner au channel si pas déjà fait
            if (!this.channels.has(channelName)) {
                const channel = this.pusher.subscribe(channelName);
                this.channels.set(channelName, channel);
                console.log(`✅ Abonné au channel: ${channelName}`);
            }

            // Ajouter le listener
            if (!this.listeners.has(channelName)) {
                this.listeners.set(channelName, new Set());
            }
            this.listeners.get(channelName)!.add(onNotification);

            // Écouter l'événement 'notification'
            const channel = this.channels.get(channelName);
            channel.bind('notification', (data: PusherNotification) => {
                console.log('📩 Notification reçue:', data);
                // Appeler tous les listeners
                this.listeners.get(channelName)?.forEach(callback => callback(data));
            });

            // Retourner une fonction de nettoyage
            return () => {
                this.unsubscribe(channelName, onNotification);
            };
        } catch (error) {
            console.error(`❌ Erreur lors de l'abonnement au channel ${channelName}:`, error);
            return () => {}; // Retourne une fonction de nettoyage vide
        }
    }

    /**
     * Se désabonner d'un listener spécifique
     */
    unsubscribe(channelName: string, onNotification: (data: PusherNotification) => void) {
        const listeners = this.listeners.get(channelName);
        if (listeners) {
            listeners.delete(onNotification);
            if (listeners.size === 0) {
                // Plus de listeners, se désabonner du channel
                const channel = this.channels.get(channelName);
                if (channel) {
                    channel.unbind('notification');
                    channel.unsubscribe();
                    this.channels.delete(channelName);
                    this.listeners.delete(channelName);
                    console.log(`✅ Désabonné du channel: ${channelName}`);
                }
            }
        }
    }

    /**
     * Se désabonner complètement de Pusher
     */
    disconnect() {
        // Désabonner de tous les channels
        this.channels.forEach((channel, channelName) => {
            channel.unbind('notification');
            channel.unsubscribe();
        });
        this.channels.clear();
        this.listeners.clear();

        // Déconnecter Pusher
        if (this.pusher) {
            this.pusher.disconnect();
            this.pusher = null;
            console.log('✅ Pusher déconnecté');
        }
    }
}

// Export d'une instance singleton
export const pusherService = new PusherService();

