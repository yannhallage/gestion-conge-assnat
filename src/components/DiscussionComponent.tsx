import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useDiscussion, type DiscussionMessage } from "../hooks/employes/useDiscussion";
import { useChefDiscussion } from "../hooks/chefdeservice/useChefDiscussion";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

interface DiscussionComponentProps {
    demandeId: string | null | undefined;
    messages?: DiscussionMessage[]; // Optionnel : pour compatibilité avec l'ancien code
    readOnly?: boolean; // Si true, cache le champ input et les boutons d'envoi
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export default function DiscussionComponent({ demandeId, messages: messagesProp, readOnly = false }: DiscussionComponentProps) {
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const userRole = user?.role ?? "user";
    const [newMessage, setNewMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Déterminer si l'utilisateur est admin/chef ou user
    const isAdminOrChef = userRole === "admin" || userRole === "chef";

    // Utiliser le hook approprié selon le rôle
    const userDiscussion = useDiscussion({
        demandeId,
        userId,
        autoFetch: !isAdminOrChef, // Récupérer automatiquement seulement si user
    });

    const chefDiscussion = useChefDiscussion({
        demandeId,
        chefId: userId,
        autoFetch: isAdminOrChef, // Récupérer automatiquement seulement si admin/chef
    });

    // Sélectionner le bon hook selon le rôle
    const {
        messages: hookMessages,
        loading: loadingMessages,
        error: messagesError,
        addDiscussion,
        fetchDiscussions,
    } = isAdminOrChef ? chefDiscussion : userDiscussion;

    // Utiliser les messages du hook si disponibles, sinon utiliser les props (pour compatibilité)
    const messages = hookMessages.length > 0 ? hookMessages : (messagesProp ?? []);

    const formattedMessages = useMemo(() => {
        if (!messages || !messages.length) {
            return [];
        }
        // Déterminer le nom par défaut selon le rôle
        const defaultName = isAdminOrChef ? "Chef de service" : "Utilisateur";
        
        return messages.map((msg) => {
            let dateStr = "";
            let timeStr = "";

            if (msg.heure_message) {
                const parsedDate = new Date(msg.heure_message);
                if (!Number.isNaN(parsedDate.valueOf())) {
                    dateStr = DATE_FORMATTER.format(parsedDate);
                    timeStr = parsedDate.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                }
            }

            return {
                id: msg.id_discussion ?? msg.heure_message ?? msg.message,
                nom: msg.auteur ?? defaultName,
                message: msg.message,
                date: dateStr,
                heure: timeStr,
                auteur_message: msg.auteur_message ?? msg.auteur ?? defaultName,
            };
        });
    }, [messages, isAdminOrChef]);

    const handleSubmit = async () => {
        if (!newMessage.trim()) {
            return;
        }

        if (!demandeId) {
            toast.error("ID de demande non défini");
            return;
        }

        if (!userId) {
            toast.error("Vous devez être connecté pour envoyer un message");
            return;
        }

        if (!user?.nom || !user?.prenom) {
            toast.error("Informations utilisateur incomplètes");
            return;
        }

        try {
            setIsSubmitting(true);
            const auteurMessage = `${user.prenom} ${user.nom}`.trim();
            await addDiscussion({
                message: newMessage.trim(),
                auteur_message: auteurMessage,
            });
            setNewMessage("");
            toast.success("Message envoyé avec succès");
        } catch (err: any) {
            toast.error(err.message || "Erreur lors de l'envoi du message");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setNewMessage("");
    };

    const handleRefresh = async () => {
        if (!demandeId) {
            toast.error("ID de demande non défini");
            return;
        }

        try {
            await fetchDiscussions();
            toast.success("Discussion rafraîchie");
        } catch (err: any) {
            toast.error(err.message || "Erreur lors du rafraîchissement");
        }
    };

    return (
        <div className={`relative ${readOnly ? 'flex-1 flex' : 'mt-6 flex h-[400px]'} flex-col text-sm text-gray-500`}>
            <div className="mb-2 flex items-center justify-between">
                <div className="text-xl font-semibold text-[#27a082]">Commentaires</div>
                <button
                    onClick={handleRefresh}
                    disabled={loadingMessages || !demandeId}
                    className="flex items-center gap-2 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    type="button"
                    title="Rafraîchir les discussions"
                >
                    <RefreshCw 
                        className={`h-4 w-4 ${loadingMessages ? 'animate-spin' : ''}`} 
                    />
                    <span>Rafraîchir</span>
                </button>
            </div>

            <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto rounded border border-gray-100 bg-white p-4">
                {loadingMessages ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Chargement des discussions...
                    </div>
                ) : messagesError ? (
                    <div className="flex h-full items-center justify-center text-sm text-red-500">
                        {messagesError}
                    </div>
                ) : formattedMessages.length ? (
                    formattedMessages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <MessageCard data={msg} />
                        </motion.div>
                    ))
                ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                        Aucune discussion pour le moment.
                    </div>
                )}
            </div>

            {!readOnly && (
                <div className="mt-3 space-y-2">
                    <textarea
                        placeholder="Écrire un message..."
                        value={newMessage}
                        onChange={(event) => setNewMessage(event.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                                handleSubmit();
                            }
                        }}
                        disabled={isSubmitting || !demandeId || !userId}
                        className="h-20 w-full resize-none rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#27a082] disabled:bg-gray-50 disabled:cursor-not-allowed"
                    />
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="rounded border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !newMessage.trim() || !demandeId || !userId}
                            className="rounded bg-[#27a082] px-4 py-2 text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                            type="button"
                        >
                            {isSubmitting ? "Envoi..." : "Envoyer"}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

interface Message {
    nom: string;
    message: string;
    date: string;
    heure: string;
    auteur_message: string;
}

interface MessageCardProps {
    data: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ data }) => {
    const displayName = data.auteur_message?.trim() || "Utilisateur";
    const initials = displayName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "??";

    return (
        <div className="flex items-start gap-3 w-fit">
            <div className="w-8 h-8 rounded-full bg-[#8dc572] flex items-center justify-center text-sm font-semibold text-white">
                {initials}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{displayName}</span>
                    <span className="text-xs text-gray-500">
                        {data.date} {data.heure}
                    </span>
                </div>
                <p className="text-[13px] text-gray-700 mt-1">{data.message}</p>
            </div>
        </div>
    );
};
