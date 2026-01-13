import { useState, useEffect } from "react";

import { Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useChefService } from "../../../../hooks/chefdeservice/useChefService";
import { useUserService } from "../../../../hooks/employes/useUserService";
import { useAuth } from "../../../../contexts/AuthContext";
// import DropDownMenu from "../../../../components/drop-down";

type PersonnelWithDispo = {
    id_personnel?: string;
    nom_personnel?: string;
    prenom_personnel?: string;
    email_travail?: string;
    disponibilité_day?: number | null;
    loading?: boolean;
};

const DisponibilitesFeatureAdmin = () => {
    const { user } = useAuth();
    const { getServicePersonnel, error: errorPersonnel } = useChefService();
    const { getDisponibilite } = useUserService(null);
    const [personnel, setPersonnel] = useState<PersonnelWithDispo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                // Récupérer le serviceId depuis le user
                let storedServiceId: string | null = null;

                if (user?.id_service) {
                    storedServiceId = user.id_service;
                } else {
                    // Essayer depuis localStorage comme fallback
                    try {
                        const storedUserRaw = localStorage.getItem("user");
                        if (storedUserRaw) {
                            const parsedUser = JSON.parse(storedUserRaw);
                            storedServiceId = parsedUser?.id_service ?? null;
                        }
                    } catch (parseError) {
                        console.error("Erreur de parsing du user localStorage :", parseError);
                    }
                }

                if (!storedServiceId) {
                    throw new Error("Aucun service associé trouvé pour ce chef de service.");
                }

                // Récupérer le personnel
                const personnelsRes = await getServicePersonnel(storedServiceId);
                const personnelsArray = Array.isArray(personnelsRes) ? personnelsRes : [];

                // Initialiser le personnel avec loading
                const personnelWithLoading: PersonnelWithDispo[] = personnelsArray.map((p: any) => ({
                    id_personnel: p.id_personnel,
                    nom_personnel: p.nom_personnel,
                    prenom_personnel: p.prenom_personnel,
                    email_travail: p.email_travail,
                    disponibilité_day: null,
                    loading: true,
                }));

                if (isMounted) {
                    setPersonnel(personnelWithLoading);
                }

                // Récupérer la disponibilité pour chaque membre du personnel
                const disponibilitePromises = personnelsArray.map(async (p: any, index: number) => {
                    if (!p.id_personnel) return null;
                    try {
                        const dispoData = await getDisponibilite(p.id_personnel);
                        const dispoValue = dispoData?.disponibilité_day ?? dispoData?.disponibilite ?? dispoData?.jours_disponibles ?? null;
                        return {
                            index,
                            disponibilité_day: dispoValue !== null ? Number(dispoValue) : null,
                        };
                    } catch (err) {
                        console.error(`Erreur lors de la récupération de la disponibilité pour ${p.id_personnel}:`, err);
                        return {
                            index,
                            disponibilité_day: null,
                        };
                    }
                });

                const disponibiliteResults = await Promise.all(disponibilitePromises);

                if (isMounted) {
                    setPersonnel((prev) =>
                        prev.map((p, index) => {
                            const result = disponibiliteResults[index];
                            return result
                                ? { ...p, disponibilité_day: result.disponibilité_day, loading: false }
                                : { ...p, loading: false };
                        })
                    );
                }
            } catch (err: any) {
                if (isMounted) {
                    setError(err?.message || "Erreur lors du chargement des disponibilités.");
                    setPersonnel([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            isMounted = false;
        };
    }, [getServicePersonnel, getDisponibilite, user?.id_service]);

    return (
        <div className="h-full flex flex-col bg-white">
            <header className="border-b border-gray-200  px-5 py-3">
                <h1 className="text-xl text-gray-800">Disponibilités</h1>
            </header>

            <div className="">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <ClipLoader size={40} color="#27a082" speedMultiplier={1.5} />
                    </div>
                ) : error || errorPersonnel ? (
                    <div className="mx-auto mt-6 p-4 text-red-600">
                        {error || errorPersonnel}
                    </div>
                ) : (
                    <AbsenceTypes personnel={personnel} />
                )}
            </div>
        </div>
    );
};

export default DisponibilitesFeatureAdmin;

interface AbsenceTypesProps {
    personnel: PersonnelWithDispo[];
}

function AbsenceTypes({ personnel }: AbsenceTypesProps) {
    const [year] = useState(2025);

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
                    Les personnes: <span className="font-medium">{personnel.length}</span>
                </div>
            </div>

            <div className="flex font-semibold justify-between text-xs text-gray-500 uppercase border-b border-gray-200 pb-1">
                <span>Personnel</span>
                <span>Disponibilité (jours)</span>
            </div>

            <motion.div
                className="mt-3 font-semibold divide-y divide-gray-100"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                {personnel.length === 0 ? (
                    <div className="py-6 text-center text-gray-500">
                        Aucun personnel trouvé
                    </div>
                ) : (
                    personnel.map((p, i) => {
                        const nomComplet = `${p.nom_personnel ?? ""} ${p.prenom_personnel ?? ""}`.trim() || "N/A";
                        const dispoValue = Number(p.disponibilité_day ?? 0);
                        const displayDispo = p.loading ? "..." : dispoValue;

                        return (
                            <div key={p.id_personnel || i} className="flex items-center space-y-4 justify-between py-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm bg-[#2b4c7e]"></div>
                                    <span>{nomComplet}</span>
                                </div>

                                <div className="flex-1 max-w-[60%] ml-6">
                                    <div className="w-full bg-gray-100 h-8 flex items-center justify-center overflow-hidden">
                                        {p.loading ? (
                                            <ClipLoader size={16} color="#2b4c7e" />
                                        ) : (
                                            <div
                                                className={`h-8 ${dispoValue > 0 ? "bg-emerald-100" : "bg-gray-200"} flex items-center justify-center`}
                                                style={{
                                                    width: dispoValue > 0 ? `${Math.min((dispoValue / 45) * 100, 100)}%` : "100%",
                                                }}
                                            >
                                                <span className="text-[13px] text-[#2b4c7e] font-medium">
                                                    {displayDispo}j
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </motion.div>
        </div>
    );
}
