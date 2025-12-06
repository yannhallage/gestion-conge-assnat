import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUserService } from '../../../../hooks/employes/useUserService';
import { useAuth } from '../../../../contexts/AuthContext';
import { ClipLoader } from 'react-spinners';
import { Calendar, MessageSquare, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { toast } from 'sonner';

interface InteractionRh {
    id_interaction_rh?: string;
    titre: string;
    message: string;
    date?: string | null;
    created_at?: string | null;
}

export default function InteractionUser() {
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const { getAllInteractionsRh, loading: serviceLoading } = useUserService(userId);
    const [interactions, setInteractions] = useState<InteractionRh[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInteractions();
    }, []);

    const fetchInteractions = async () => {
        try {
            setLoading(true);
            const response = await getAllInteractionsRh();
            setInteractions(Array.isArray(response) ? response : []);
        } catch (err: any) {
            toast.error(err?.message || "Erreur lors du chargement des interactions");
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        await fetchInteractions();
        toast.success("Interactions rafraîchies avec succès");
    };

    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                <header className="border-b border-gray-200 px-5 py-3 flex items-center justify-between">
                    <h1 className="text-xl text-gray-800">Interaction RH</h1>
                    <button
                        onClick={handleRefresh}
                        disabled={loading || serviceLoading}
                        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Rafraîchir les interactions"
                    >
                        <RefreshCw
                            className={`h-4 w-4 ${loading || serviceLoading ? 'animate-spin' : ''}`}
                        />
                        <span>Rafraîchir</span>
                    </button>
                </header>
                <div className='p-6'>
                    {loading || serviceLoading ? (
                        <div className="flex items-center justify-center h-[50vh]">
                            <ClipLoader color="#27a082" size={29} />
                        </div>
                    ) : interactions.length > 0 ? (
                        <InfoDisplay interactions={interactions} />
                    ) : (
                        <AucuneHistorique />
                    )}
                </div>
            </motion.div>
        </>
    )
}



// Composant d’affichage lorsqu’il n’y a aucune annonce
const AucuneHistorique = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center h-[80vh] text-center text-gray-600"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="relative">
                <div className="w-[520px] h-[220px] flex items-center justify-center">
                    <img
                        src="data:image/svg+xml,%3csvg%20width='272'%20height='214'%20viewBox='0%200%20272%20214'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_652_30126)'%3e%3cpath%20d='M55.1728%2085.1073L53.7656%2083.7002L35.6002%20101.866L37.0074%20103.273L55.1728%2085.1073Z'%20fill='white'/%3e%3cpath%20d='M223.208%20207.9C161.078%20207.9%20147.258%20212.71%2088.1785%20213.31C29.0885%20213.91%2040.3885%20210.52%2023.5585%20200.7C6.72849%20190.88%20-14.9915%20188.81%2014.7185%20181.47C24.6185%20179.02%2056.5785%20179.48%2068.2785%20179.08C126.258%20176.95%20162.718%20179.4%20210.748%20179.08C227.948%20178.96%20303.519%20183.89%20257.139%20189.3C210.779%20194.68%20285.349%20207.9%20223.208%20207.9Z'%20fill='%23F5F7FA'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_652_30126'%3e%3crect%20width='271.98'%20height='213.38'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                        alt="aucune donnée"
                    />
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-gray-700 text-lg mt-6">
                    Aucune interaction RH
                </h2>
            </div>
            <p className="text-sm text-gray-400 mt-2 max-w-md">
                Il n'y a actuellement aucune interaction RH. Les annonces et communications de la direction des ressources humaines apparaîtront ici.
            </p>
        </motion.div>
    );
};

// Composant principal d'affichage des interactions en fil d'Ariane vertical
interface InfoDisplayProps {
    interactions: InteractionRh[];
}

const InfoDisplay = ({ interactions }: InfoDisplayProps) => {
    const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return null;
        try {
            const date = new Date(dateString);
            if (Number.isNaN(date.valueOf())) return null;
            return {
                date: format(date, "dd MMM yyyy", { locale: fr }),
                time: format(date, "HH:mm", { locale: fr }),
                full: format(date, "dd MMMM yyyy 'à' HH:mm", { locale: fr }),
            };
        } catch {
            return null;
        }
    };

    const isToday = (dateString: string | null | undefined) => {
        if (!dateString) return false;
        try {
            const date = new Date(dateString);
            const today = new Date();
            return date.toDateString() === today.toDateString();
        } catch {
            return false;
        }
    };

    return (
        <div className="relative bg-white p-8">
            {/* Ligne verticale du fil d'Ariane */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            <div className="relative space-y-8">
                {interactions.map((interaction, index) => {
                    const dateInfo = formatDate(interaction.date || interaction.created_at);
                    const today = isToday(interaction.date || interaction.created_at);
                    const isLast = index === interactions.length - 1;

                    return (
                        <motion.div
                            key={interaction.id_interaction_rh || index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="relative flex items-start gap-6"
                        >
                            {/* Point du fil d'Ariane */}
                            <div className="relative z-10 flex-shrink-0">
                                <div className="w-4 h-4 rounded-full bg-[#27a082] border-4 border-white shadow-lg"></div>
                                {!isLast && (
                                    <div className="absolute left-1/2 top-4 w-0.5 h-full bg-gray-200 transform -translate-x-1/2"></div>
                                )}
                            </div>

                            {/* Contenu de l'interaction */}
                            <div className="flex-1 pb-8">
                                <div className="bg-gray-50 rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
                                    {/* En-tête avec date */}
                                    <div className="flex items-start justify-between mb-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                                                {interaction.titre}
                                            </h3>
                                            {dateInfo && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4" />
                                                    <span>
                                                        {today ? "Aujourd'hui" : dateInfo.date} à {dateInfo.time}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Message */}
                                    <div className="flex items-start gap-2 mt-4">
                                        <MessageSquare className="h-4 w-4 text-[#27a082] mt-1 flex-shrink-0" />
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {interaction.message}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

