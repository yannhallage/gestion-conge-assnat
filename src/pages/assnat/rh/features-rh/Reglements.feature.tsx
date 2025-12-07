import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { useComptabiliteService } from "../../../../hooks/comptabilite/useComptabiliteService";

interface Paie {
    id_paie: string;
    mois?: number;
    annee?: number;
    salaire_net?: number;
    salaire_brut?: number;
    primes?: number;
    deductions?: number;
    url_bulletin?: string;
    personnel?: {
        nom_personnel?: string;
        prenom_personnel?: string;
        matricule_personnel?: string;
    };
}

interface BulletinPaie {
    id_bulletin: string;
    id_paie?: string;
    url_pdf?: string;
    date_emission?: string;
    note_rh?: string;
    paie?: Paie;
    personnel?: {
        nom_personnel?: string;
        prenom_personnel?: string;
        matricule_personnel?: string;
    };
}

const ReglementsFeature = () => {
    const [activeTab, setActiveTab] = useState<"paies" | "bulletins">("paies");
    const [paies, setPaies] = useState<Paie[]>([]);
    const [bulletins, setBulletins] = useState<BulletinPaie[]>([]);
    const [loadingPaies, setLoadingPaies] = useState(false);
    const [loadingBulletins, setLoadingBulletins] = useState(false);
    const [errorPaies, setErrorPaies] = useState<string | null>(null);
    const [errorBulletins, setErrorBulletins] = useState<string | null>(null);

    const { getAllPaies, getAllBulletinsPaie } = useComptabiliteService();

    const fetchPaies = useCallback(async () => {
        try {
            setLoadingPaies(true);
            setErrorPaies(null);
            const data = await getAllPaies();
            setPaies(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setErrorPaies(err?.message || "Erreur lors de la récupération des paies");
        } finally {
            setLoadingPaies(false);
        }
    }, [getAllPaies]);

    const fetchBulletins = useCallback(async () => {
        try {
            setLoadingBulletins(true);
            setErrorBulletins(null);
            const data = await getAllBulletinsPaie();
            setBulletins(Array.isArray(data) ? data : []);
        } catch (err: any) {
            setErrorBulletins(err?.message || "Erreur lors de la récupération des bulletins de paie");
        } finally {
            setLoadingBulletins(false);
        }
    }, [getAllBulletinsPaie]);

    useEffect(() => {
        if (activeTab === "paies") {
            fetchPaies();
        } else {
            fetchBulletins();
        }
    }, [activeTab, fetchPaies, fetchBulletins]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        try {
            const date = new Date(dateString);
            return new Intl.DateTimeFormat("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }).format(date);
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return "—";
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XAF",
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const getMonthName = (month?: number) => {
        if (!month) return "—";
        const months = [
            "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
            "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
        ];
        return months[month - 1] || month.toString();
    };

    return (
        <motion.div
            className="h-full flex flex-col bg-white"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <header className="border-b border-gray-200 px-5 py-3">
                <h1 className="text-xl text-gray-800">Règlements</h1>
            </header>

            <div className="flex-1 overflow-y-auto">
                {/* Tabs */}
                <div className="border-b border-gray-200 px-5">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("paies")}
                            className={`py-3 px-4 font-medium text-sm transition-colors ${
                                activeTab === "paies"
                                    ? "text-emerald-600 border-b-2 border-emerald-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Paies
                        </button>
                        <button
                            onClick={() => setActiveTab("bulletins")}
                            className={`py-3 px-4 font-medium text-sm transition-colors ${
                                activeTab === "bulletins"
                                    ? "text-emerald-600 border-b-2 border-emerald-600"
                                    : "text-gray-600 hover:text-gray-800"
                            }`}
                        >
                            Bulletins de paie
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {activeTab === "paies" ? (
                        <div>
                            {loadingPaies ? (
                                <div className="flex items-center justify-center py-12">
                                    <ClipLoader color="#27a082" loading={loadingPaies} size={29} />
                                </div>
                            ) : errorPaies ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-600">{errorPaies}</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden shadow-sm bg-white rounded-lg border border-gray-200">
                                    <table className="w-full text-sm text-gray-800">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Personnel
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Période
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Salaire brut
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Primes
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Déductions
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Salaire net
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {paies.length === 0 ? (
                                                <tr>
                                                    <td colSpan={6} className="py-8 text-center text-gray-500">
                                                        Aucune paie trouvée
                                                    </td>
                                                </tr>
                                            ) : (
                                                paies.map((paie) => (
                                                    <tr
                                                        key={paie.id_paie}
                                                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                                                    >
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {paie.personnel
                                                                ? `${paie.personnel.prenom_personnel || ""} ${paie.personnel.nom_personnel || ""}`.trim() || paie.personnel.matricule_personnel || "—"
                                                                : "—"}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {paie.mois && paie.annee
                                                                ? `${getMonthName(paie.mois)} ${paie.annee}`
                                                                : "—"}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {formatCurrency(paie.salaire_brut)}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {formatCurrency(paie.primes)}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {formatCurrency(paie.deductions)}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] font-medium text-gray-800">
                                                            {formatCurrency(paie.salaire_net)}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div>
                            {loadingBulletins ? (
                                <div className="flex items-center justify-center py-12">
                                    <ClipLoader color="#27a082" loading={loadingBulletins} size={29} />
                                </div>
                            ) : errorBulletins ? (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <p className="text-sm text-red-600">{errorBulletins}</p>
                                </div>
                            ) : (
                                <div className="overflow-hidden shadow-sm bg-white rounded-lg border border-gray-200">
                                    <table className="w-full text-sm text-gray-800">
                                        <thead className="bg-gray-50 border-b border-gray-200">
                                            <tr>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Personnel
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Date d'émission
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Période
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Note RH
                                                </th>
                                                <th className="text-left py-3 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bulletins.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="py-8 text-center text-gray-500">
                                                        Aucun bulletin de paie trouvé
                                                    </td>
                                                </tr>
                                            ) : (
                                                bulletins.map((bulletin) => (
                                                    <tr
                                                        key={bulletin.id_bulletin}
                                                        className="border-b border-gray-100 transition-colors hover:bg-gray-50"
                                                    >
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {bulletin.personnel
                                                                ? `${bulletin.personnel.prenom_personnel || ""} ${bulletin.personnel.nom_personnel || ""}`.trim() || bulletin.personnel.matricule_personnel || "—"
                                                                : bulletin.paie?.personnel
                                                                ? `${bulletin.paie.personnel.prenom_personnel || ""} ${bulletin.paie.personnel.nom_personnel || ""}`.trim() || bulletin.paie.personnel.matricule_personnel || "—"
                                                                : "—"}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {formatDate(bulletin.date_emission)}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {bulletin.paie?.mois && bulletin.paie?.annee
                                                                ? `${getMonthName(bulletin.paie.mois)} ${bulletin.paie.annee}`
                                                                : "—"}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {bulletin.note_rh || "—"}
                                                        </td>
                                                        <td className="py-3 px-4 text-[14px] text-gray-800">
                                                            {bulletin.url_pdf ? (
                                                                <a
                                                                    href={bulletin.url_pdf}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                                                                >
                                                                    Voir PDF
                                                                </a>
                                                            ) : (
                                                                "—"
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default ReglementsFeature;

