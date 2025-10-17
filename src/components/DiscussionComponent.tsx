import { motion } from "framer-motion";
import { useState } from "react";

export default function DiscussionComponent() {
    const [newMessage, setNewMessage] = useState("");

    const messages = [
        {
            nom: "yann hallage",
            message: "J'ai terminé la tâche que vous m'avez attribuée",
            date: "17/10/2025",
            heure: "13:09",
        },
        {
            nom: "aline kouadio",
            message: "Le rapport du jour a été envoyé.",
            date: "17/10/2025",
            heure: "13:25",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
        {
            nom: "marc diallo",
            message: "J'ai mis à jour le document principal.",
            date: "17/10/2025",
            heure: "13:45",
        },
    ];

    return (
        <div className="mt-6 text-sm text-gray-500 relative h-[400px] flex flex-col">
            {/* Titre */}
            <div className="mb-2 text-xl text-[#27a082] font-semibold">Commentaires</div>

            {/* Liste de messages */}
            <div className="bg-white p-4 flex-1 overflow-y-auto no-scrollbar space-y-5 rounded border border-gray-100">
                {messages.map((msg, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <MessageCard data={msg} />
                    </motion.div>
                ))}
            </div>

            {/* Zone de saisie */}
            <div className="mt-3 space-y-2">
                <textarea
                    placeholder="Écrire un message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="w-full border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-[#27a082] focus:outline-none resize-none rounded"
                />
                <div className="space-x-2 flex justify-end">
                    <button className="px-4 py-2 bg-[#27a082] text-white rounded hover:bg-teal-600 transition">
                        Envoyer
                    </button>
                    <button className="px-4 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition">
                        Annuler
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
    const initials = data.nom
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="flex items-start gap-3 w-fit">
            <div className="w-8 h-8 rounded-full bg-[#8dc572] flex items-center justify-center text-sm font-semibold text-white">
                {initials}
            </div>
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-800">{data.nom}</span>
                    <span className="text-xs text-gray-500">
                        {data.date} {data.heure}
                    </span>
                </div>
                <p className="text-[13px] text-gray-700 mt-1">{data.message}</p>
            </div>
        </div>
    );
};
