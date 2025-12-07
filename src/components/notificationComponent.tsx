import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import { notificationService, type Notification } from "../services/notifications/notification.service";
import { usePusherNotifications } from "../hooks/notifications/usePusherNotifications";
import { useAuth } from "../contexts/AuthContext";
import { pusherService } from "../services/pusher/pusher.service";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

// Fonction pour formater la date
const formatDate = (dateString?: string): string => {
    if (!dateString) return "Date inconnue";
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInMinutes < 1) {
            return "À l'instant";
        } else if (diffInMinutes < 60) {
            return `Il y a ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''}`;
        } else if (diffInHours < 24) {
            return `Il y a ${diffInHours} heure${diffInHours > 1 ? 's' : ''}`;
        } else if (diffInDays === 1) {
            return "Hier";
        } else if (diffInDays < 7) {
            return `Il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`;
        } else {
            return date.toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            });
        }
    } catch {
        return dateString;
    }
};

export default function DrawerNotifications({ isOpen, onClose }: DrawerProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const { user } = useAuth();
    const { refreshUnreadCount } = usePusherNotifications();

    // 🧠 Chargement des notifications depuis l'API
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            setError(null);
            
            notificationService
                .getNotifications()
                .then((data) => {
                    // Transformer les données pour s'assurer qu'elles ont le bon format
                    const formattedNotifications = data.map((notif) => ({
                        ...notif,
                        date: notif.date || formatDate(notif.created_at),
                    }));
                    setNotifications(formattedNotifications);
                })
                .catch((err) => {
                    console.error("Erreur lors du chargement des notifications:", err);
                    setError(err.message || "Erreur lors du chargement des notifications");
                    setNotifications([]);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            // Réinitialiser l'état quand le drawer se ferme
            setNotifications([]);
            setError(null);
        }
    }, [isOpen]);

    // 📡 Écouter les nouvelles notifications Pusher
    useEffect(() => {
        if (!user?.id) return;

        const channelName = `user-${user.id}`;
        
        const handleNewNotification = (data: any) => {
            // Transformer la notification Pusher en format Notification
            const newNotif: Notification = {
                id: data.id_notification,
                title: data.titre,
                message: data.message,
                date: formatDate(data.date_creation),
                isLu: data.is_lu || false,
                created_at: data.date_creation,
            };

            // Ajouter la notification en haut de la liste
            setNotifications((prev) => {
                // Vérifier si elle n'existe pas déjà
                if (prev.some(n => n.id === newNotif.id)) {
                    return prev;
                }
                return [newNotif, ...prev];
            });

            // Rafraîchir le compteur de notifications non lues
            refreshUnreadCount();
        };

        // S'abonner aux notifications Pusher
        const unsubscribe = pusherService.subscribe(channelName, handleNewNotification);

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [user?.id, refreshUnreadCount]);

    // Empêche le scroll en arrière-plan
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    // Marquer une notification comme lue
    const handleMarkAsRead = async (id: string | number) => {
        try {
            await notificationService.markAsRead(id.toString());
            // Mettre à jour l'état local
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif.id === id ? { ...notif, isLu: true } : notif
                )
            );
            // Rafraîchir le compteur
            refreshUnreadCount();
        } catch (err) {
            console.error("Erreur lors du marquage de la notification:", err);
        }
    };

    // Gérer le clic sur une notification
    const handleNotificationClick = (notif: Notification) => {
        // Si la notification n'est pas encore lue, la marquer comme lue
        if (!notif.isLu) {
            handleMarkAsRead(notif.id);
        }
    };

    return (
        <>
            {/* --- Overlay --- */}
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleClose}
            />

            {/* --- Drawer --- */}
            <div
                className={`fixed top-0 right-0 h-full w-[40%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                {/* --- Header --- */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400"
                        >
                            <path
                                d="M17.9111 12.8C17.2444 12.8 16.5778 12.6222 15.9556 12.3111C14.6667 11.6444 13.8222 10.2667 13.8222 8.75556C13.8222 7.73333 14.1778 6.8 14.8889 6.04444C15.6444 5.2 16.7556 4.71111 17.9111 4.71111C20.1778 4.71111 22 6.53333 22 8.75556C22 10.9778 20.1778 12.8 17.9111 12.8ZM15.9556 13.3333C15.9556 14.0444 16.1778 16.0889 18.4 16.8444V18.9778H2V16.8444C4.71111 15.9111 4.44444 13.0667 4.44444 13.0667V10V9.86667C4.48889 7.15556 6.48889 4.88889 9.11111 4.35556C9.82222 4.22222 10.5778 4.22222 11.3333 4.35556C12.3111 4.53333 13.2444 4.97778 14.0444 5.64444C13.3333 6.53333 12.9333 7.6 12.9333 8.71111C12.9333 10.8 14.1778 12.5778 15.9556 13.3333ZM9.11111 3.64444V3.11111C9.11111 2.48889 9.6 2 10.2222 2C10.8 2 11.3333 2.48889 11.3333 3.11111V3.64444C10.9778 3.6 10.5778 3.55556 10.2222 3.55556C9.82222 3.55556 9.46667 3.6 9.11111 3.64444ZM10.5333 19.6889H12.7556C12.6667 20.9778 11.5556 22 10.2222 22C8.88889 22 7.77778 20.9778 7.68889 19.6889H10.5333Z"
                                fill="currentColor"
                            />
                        </svg>
                        <h1 className="text-xl font-normal text-gray-700">Notifications</h1>
                    </div>
                </header>

                {/* --- Contenu --- */}
                <div className="flex h-full overflow-hidden relative">
                    {/* Loader */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <ClipLoader
                                color="#27a082"
                                loading={loading}
                                size={40}
                                speedMultiplier={3}
                            />
                        </div>
                    )}

                    <main className="flex-1 p-6 overflow-y-auto">
                        {/* Affichage des erreurs */}
                        {error && (
                            <div className="p-4 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Si pas de notifications */}
                        {!loading && !error && notifications.length === 0 && <AucuneHistorique />}

                        {/* Si notifications disponibles */}
                        {!loading &&
                            !error &&
                            notifications.length > 0 && (
                                <div className="space-y-3">
                                    {notifications.map((notif) => (
                                        <div
                                            key={notif.id}
                                            onClick={() => handleNotificationClick(notif)}
                                            className={`group relative flex gap-4 p-4 rounded-lg transition-all duration-200 cursor-pointer ${
                                                !notif.isLu
                                                    ? "bg-gradient-to-r from-emerald-50/50 to-white hover:from-emerald-50 hover:to-emerald-50/30 shadow-sm border-l-4 border-l-[#27a082]"
                                                    : "bg-white hover:bg-gray-50 border-l-4 border-l-transparent hover:border-l-gray-300 shadow-sm"
                                            }`}
                                        >
                                            {/* Indicateur non lue */}
                                            {!notif.isLu && (
                                                <div className="absolute top-4 right-4">
                                                    <div className="w-2.5 h-2.5 bg-[#27a082] rounded-full animate-pulse"></div>
                                                </div>
                                            )}

                                            {/* Icône de notification */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                                !notif.isLu 
                                                    ? "bg-emerald-100 text-[#27a082]" 
                                                    : "bg-gray-100 text-gray-400"
                                            }`}>
                                                <svg
                                                    className="w-5 h-5"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                                    />
                                                </svg>
                                            </div>

                                            {/* Contenu */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className={`text-base font-semibold leading-tight ${
                                                        !notif.isLu 
                                                            ? "text-gray-900" 
                                                            : "text-gray-700"
                                                    }`}>
                                                        {notif.title}
                                                    </h3>
                                                </div>
                                                
                                                <p className={`text-sm leading-relaxed mt-1.5 ${
                                                    !notif.isLu 
                                                        ? "text-gray-700" 
                                                        : "text-gray-600"
                                                }`}>
                                                    {notif.message}
                                                </p>

                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-xs font-medium text-gray-400 flex items-center gap-1">
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                            />
                                                        </svg>
                                                        {notif.date}
                                                    </span>
                                                    
                                                    {!notif.isLu && (
                                                        <span className="px-2 py-0.5 text-xs font-medium text-[#27a082] bg-emerald-100 rounded-full">
                                                            Nouveau
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </main>
                </div>
            </div>
        </>
    );
}

// 🧩 Composant affiché quand il n’y a aucune notification
const AucuneHistorique = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-600">
        <div className="relative">
            <div className="w-[320px] h-[180px] flex items-center justify-center">
                <img
                    src="data:image/svg+xml,%3csvg%20width='272'%20height='214'%20viewBox='0%200%20272%20214'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_652_30126)'%3e%3cpath%20d='M55.1728%2085.1073L53.7656%2083.7002L35.6002%20101.866L37.0074%20103.273L55.1728%2085.1073Z'%20fill='white'/%3e%3cpath%20d='M223.208%20207.9C161.078%20207.9%20147.258%20212.71%2088.1785%20213.31C29.0885%20213.91%2040.3885%20210.52%2023.5585%20200.7C6.72849%20190.88%20-14.9915%20188.81%2014.7185%20181.47C24.6185%20179.02%2056.5785%20179.48%2068.2785%20179.08C126.258%20176.95%20162.718%20179.4%20210.748%20179.08C227.948%20178.96%20303.519%20183.89%20257.139%20189.3C210.779%20194.68%20285.349%20207.9%20223.208%20207.9Z'%20fill='%23F5F7FA'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_652_30126'%3e%3crect%20width='271.98'%20height='213.38'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                    alt="aucune donnée"
                />
            </div>
        </div>
        <h2 className="text-gray-700 text-lg mt-4 font-medium">
            Aucune notification
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
            Vous n'avez actuellement aucune notification. Les nouvelles annonces
            apparaîtront ici dès leur publication.
        </p>
    </div>
);
