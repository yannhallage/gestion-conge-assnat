import { motion } from "framer-motion";
import { useMemo, useState } from "react";

interface DiscussionMessage {
    id_discussion?: string;
    message: string;
    heure_message?: string;
    auteur?: string | null;
}

interface DiscussionComponentProps {
    messages?: DiscussionMessage[];
}

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

export default function DiscussionComponent({ messages }: DiscussionComponentProps) {
    const [newMessage, setNewMessage] = useState("");

    const formattedMessages = useMemo(() => {
        if (!messages || !messages.length) {
            return [];
        }
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
                nom: msg.auteur ?? "Utilisateur",
                message: msg.message,
                date: dateStr,
                heure: timeStr,
            };
        });
    }, [messages]);

    return (
        <div className="relative mt-6 flex h-[400px] flex-col text-sm text-gray-500">
            <div className="mb-2 text-xl font-semibold text-[#27a082]">Commentaires</div>

            <div className="no-scrollbar flex-1 space-y-5 overflow-y-auto rounded border border-gray-100 bg-white p-4">
                {formattedMessages.length ? (
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

            <div className="mt-3 space-y-2">
                <textarea
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(event) => setNewMessage(event.target.value)}
                    className="h-20 w-full resize-none rounded border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#27a082]"
                />
                <div className="flex justify-end space-x-2">
                    <button
                        className="rounded border border-gray-300 px-4 py-2 text-gray-600 transition hover:bg-gray-50"
                        type="button"
                    >
                        Annuler
                    </button>
                    <button
                        className="rounded bg-[#27a082] px-4 py-2 text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-emerald-300"
                        type="button"
                        disabled
                    >
                        Envoyer
                    </button>
                </div>
            </div>
        </div>
    );
}

interface Message {
    nom: string;
    message: string;
    date: string;
    heure: string;
}

interface MessageCardProps {
    data: Message;
}

const MessageCard: React.FC<MessageCardProps> = ({ data }) => {
    const displayName = data.nom?.trim() || "Utilisateur";
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
