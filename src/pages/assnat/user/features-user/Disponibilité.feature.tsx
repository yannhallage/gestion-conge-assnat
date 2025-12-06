import { useState, useEffect } from "react";
import { Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ClipLoader } from "react-spinners";
import { useUserService } from "../../../../hooks/employes/useUserService";
import { USER_STORAGE_KEY } from "../../../../secure/storageKeys";
// import DropDownMenu from "../../../../components/drop-down";

const DisponibilitesFeature = () => {
    const [userId, setUserId] = useState<string | null>(null);
    const { getDisponibilite, error } = useUserService(userId);
    const [disponibilite, setDisponibilite] = useState<number | null>(null);
    const [loadingData, setLoadingData] = useState(true);

    const DEFAULT_DISPO = 45; // Disponibilité par défaut

    useEffect(() => {
        // Récupérer l'ID utilisateur depuis le localStorage
        try {
            const userData = localStorage.getItem(USER_STORAGE_KEY);
            if (userData) {
                const parsed = JSON.parse(userData);
                setUserId(parsed.id);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'utilisateur :", error);
        }
    }, []);

    useEffect(() => {
        const loadDisponibilite = async () => {
            if (!userId) return;
            try {
                setLoadingData(true);
                const data = await getDisponibilite(userId);

                // La réponse du backend est sous la forme {"disponibilité_day": 40}
                const dispoValue = data?.disponibilité_day ?? data?.disponibilite ?? data?.jours_disponibles ?? 0;
                setDisponibilite(Number(dispoValue) || 0);
            } catch (err: any) {
                console.error("Erreur lors du chargement de la disponibilité :", err);
            } finally {
                setLoadingData(false);
            }
        };

        if (userId) {
            loadDisponibilite();
        }
    }, [userId, getDisponibilite]);

    const dispoRestante = disponibilite !== null ? Number(disponibilite) : DEFAULT_DISPO;
    const dispoUtilisee = disponibilite !== null ? DEFAULT_DISPO - Number(disponibilite) : 0;

    const chartData = [
        { name: "Disponibilité restante", value: dispoRestante, color: "#27a082" },
        { name: "Disponibilité utilisée", value: dispoUtilisee, color: "#e5e7eb" },
    ];

    return (
        <div className="h-full flex flex-col bg-white">
            <header className="border-b border-gray-200  px-5 py-3">
                <h1 className="text-xl text-gray-800">Disponibilités</h1>
            </header>

            <div className="p-6">
                {loadingData ? (
                    <div className="flex items-center justify-center py-12">
                        <ClipLoader size={40} color="#27a082" speedMultiplier={1.5} />
                    </div>
                ) : error ? (
                    <div className="bg-rose-50 border border-rose-400 text-rose-700 px-4 py-3 rounded">
                        {error}
                    </div>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Vue d'ensemble</h2>
                            <div className="flex flex-col md:flex-row items-center gap-8">
                                <div className="flex-1">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="value"
                                                startAngle={90}
                                                endAngle={-270}
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value: number) => [`${value} jours`, ""]}
                                                contentStyle={{
                                                    backgroundColor: "#fff",
                                                    border: "1px solid #e5e7eb",
                                                    borderRadius: "6px",
                                                }}
                                            />
                                            <Legend
                                                verticalAlign="bottom"
                                                height={36}
                                                formatter={(value) => (
                                                    <span className="text-sm text-gray-700">{value}</span>
                                                )}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                                        <div className="text-sm text-emerald-600 font-medium mb-1">
                                            Disponibilité restante
                                        </div>
                                        <div className="text-3xl font-bold text-emerald-700">
                                            {dispoRestante} jours
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                                        <div className="text-sm text-gray-600 font-medium mb-1">
                                            Disponibilité utilisée
                                        </div>
                                        <div className="text-3xl font-bold text-gray-700">
                                            {dispoUtilisee} jours
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                        <div className="text-sm text-blue-600 font-medium mb-1">
                                            Disponibilité totale
                                        </div>
                                        <div className="text-3xl font-bold text-blue-700">
                                            {DEFAULT_DISPO} jours
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <AbsenceTypes 
                            dispoAnnuelle={DEFAULT_DISPO}
                            dispoUtilisee={dispoUtilisee}
                            dispoRestante={dispoRestante}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default DisponibilitesFeature;

interface AbsenceTypesProps {
    dispoAnnuelle: number;
    dispoUtilisee: number;
    dispoRestante: number;
}

function AbsenceTypes({ dispoAnnuelle, dispoUtilisee, dispoRestante }: AbsenceTypesProps) {
    const [year] = useState(new Date().getFullYear());
    const [person] = useState("admin orathsa");

    const absences = [
        { type: "Congés annuels", color: "bg-[#2b4c7e]", days: dispoAnnuelle, total: dispoAnnuelle },
        { type: "Congés pris", color: "bg-[#cfd8f0]", days: dispoUtilisee, total: dispoAnnuelle },
        { type: "Congés restants", color: "bg-[#3b9d78]", days: dispoRestante, total: dispoAnnuelle },
    ];

    return (
        <div className=" mx-auto mt-6 text-[15px]  font-semibold p-4 text-gray-700">
            <div className="flex items-center gap-4 mb-3">
                <input
                    type="text"
                    placeholder="Nom du type"
                    className="border border-gray-200 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <div className="flex items-center bg-[#f6f7f9] border-gray-200 px-3 py-1 text-sm gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    Année d'absence: <span className="font-medium">{year}</span>
                </div>
                <div className="flex items-center bg-[#f6f7f9] border-gray-200 px-3 py-1 text-sm gap-2">
                    <User size={16} className="text-gray-500" />
                    Les personnes: <span className="font-medium">{person}</span>
                </div>
            </div>

            <div className="flex font-semibold justify-between text-xs text-gray-500 uppercase border-b border-gray-200 pb-1">
                <span>Types</span>
                <span>Disponible dès le 14/10/2025</span>
            </div>

            <motion.div className="mt-3 font-semibold divide-y divide-gray-100"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                {absences.map((a, i) => (
                    <div key={i} className="flex items-center space-y-4 justify-between py-3">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-sm ${i === 0 ? "bg-[#2b4c7e]" : i === 1 ? "bg-[#cfd8f0]" : "bg-[#3b9d78]"
                                    }`}
                            ></div>
                            <span>{a.type}</span>
                        </div>

                        <div className="flex-1 max-w-[60%] ml-6">
                            <div className="w-full bg-gray-100  h-8 flex items-center justify-center overflow-hidden">
                                <div
                                    className={`h-8 ${a.color} flex items-center justify-center`}
                                    style={{
                                        width: typeof a.days === "number" && a.total > 0
                                            ? `${(a.days / a.total) * 100}%` 
                                            : "100%",
                                    }}
                                >
                                    <span className="text-[13px] text-white font-medium">
                                        {a.days}d
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}