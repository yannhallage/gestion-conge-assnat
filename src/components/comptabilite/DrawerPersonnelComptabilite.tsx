import { useEffect, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import { useComptabiliteService } from "../../hooks/comptabilite/useComptabiliteService";
import { toast } from "sonner";
import ModalCreatePaie from "./ModalCreatePaie";

interface Personnel {
    id_personnel: string;
    nom_personnel: string;
    prenom_personnel: string;
    email_personnel?: string;
    email_travail?: string;
    matricule_personnel?: string;
    poste?: string;
    service?: {
        nom_service: string;
        code_service: string;
    };
}

interface Contrat {
    id_contrat: string;
    type_contrat: string;
    date_debut: string;
    date_fin?: string;
    salaire_reference?: number;
    statut?: string;
    url_contrat?: string;
}

interface Paie {
    id_paie: string;
    mois: number;
    annee: number;
    salaire_net: number;
    salaire_brut: number;
    primes?: number;
    deductions?: number;
    url_bulletin?: string;
}

interface BulletinPaie {
    id_bulletin: string;
    id_paie: string;
    url_pdf: string;
    date_emission: string;
    note_rh?: string;
    paie?: Paie;
}

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    personnel: Personnel | null;
}

export default function DrawerPersonnelComptabilite({ isOpen, onClose, personnel }: DrawerProps) {
    const [activeTab, setActiveTab] = useState<"contrats" | "paies" | "bulletins" | "export">("contrats");
    const [contrats, setContrats] = useState<Contrat[]>([]);
    const [paies, setPaies] = useState<Paie[]>([]);
    const [bulletins, setBulletins] = useState<BulletinPaie[]>([]);
    const [loadingContrats, setLoadingContrats] = useState(false);
    const [loadingPaies, setLoadingPaies] = useState(false);
    const [loadingBulletins, setLoadingBulletins] = useState(false);
    const [isModalCreatePaieOpen, setIsModalCreatePaieOpen] = useState(false);
    const [loadingModalOpen, setLoadingModalOpen] = useState(false);
    const [initialLoading, setInitialLoading] = useState(false);

    const {
        getContratsByPersonnel,
        getPaiesByPersonnel,
        getBulletinsPaieByPersonnel,
        updateBulletinPaie,
        deleteBulletinPaie,
    } = useComptabiliteService();

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setInitialLoading(true);
            const timer = setTimeout(() => setInitialLoading(false), 500);
            return () => clearTimeout(timer);
        } else {
            setActiveTab("contrats");
            setInitialLoading(false);
        }
    }, [isOpen]);

    useEffect(() => {
        const fetchContrats = async () => {
            if (!personnel?.id_personnel || !isOpen) return;
            try {
                setLoadingContrats(true);
                const data = await getContratsByPersonnel(personnel.id_personnel);
                setContrats(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erreur lors de la récupération des contrats:", err);
                setContrats([]);
            } finally {
                setLoadingContrats(false);
            }
        };

        if (activeTab === "contrats") {
            fetchContrats();
        }
    }, [personnel?.id_personnel, isOpen, activeTab, getContratsByPersonnel]);

    useEffect(() => {
        const fetchPaies = async () => {
            if (!personnel?.id_personnel || !isOpen) return;
            try {
                setLoadingPaies(true);
                const data = await getPaiesByPersonnel(personnel.id_personnel);
                setPaies(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Erreur lors de la récupération des paies:", err);
                setPaies([]);
            } finally {
                setLoadingPaies(false);
            }
        };

        if (activeTab === "paies") {
            fetchPaies();
        }
    }, [personnel?.id_personnel, isOpen, activeTab, getPaiesByPersonnel]);

    const fetchBulletins = useCallback(async () => {
        if (!personnel?.id_personnel) return;
        try {
            setLoadingBulletins(true);
            const data = await getBulletinsPaieByPersonnel(personnel.id_personnel);
            setBulletins(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Erreur lors de la récupération des bulletins:", err);
            setBulletins([]);
        } finally {
            setLoadingBulletins(false);
        }
    }, [personnel?.id_personnel, getBulletinsPaieByPersonnel]);

    const handlePaieCreated = useCallback(() => {
        // Rafraîchir les paies et les bulletins après création
        if (activeTab === "paies") {
            const fetchPaies = async () => {
                if (!personnel?.id_personnel) return;
                try {
                    setLoadingPaies(true);
                    const data = await getPaiesByPersonnel(personnel.id_personnel);
                    setPaies(Array.isArray(data) ? data : []);
                } catch (err) {
                    console.error("Erreur lors de la récupération des paies:", err);
                    setPaies([]);
                } finally {
                    setLoadingPaies(false);
                }
            };
            fetchPaies();
        }
        if (activeTab === "bulletins") {
            fetchBulletins();
        }
        toast.success("Paie créée avec succès");
    }, [activeTab, personnel?.id_personnel, getPaiesByPersonnel, fetchBulletins]);

    useEffect(() => {
        if (activeTab === "bulletins" && isOpen && personnel?.id_personnel) {
            fetchBulletins();
        }
    }, [activeTab, isOpen, personnel?.id_personnel, fetchBulletins]);

    const handleExport = useCallback(() => {
        if (!personnel) return;
        
        const data = {
            personnel: {
                nom: personnel.nom_personnel,
                prenom: personnel.prenom_personnel,
                matricule: personnel.matricule_personnel,
                email: personnel.email_travail || personnel.email_personnel,
                poste: personnel.poste,
                service: personnel.service?.nom_service,
            },
            contrats,
            paies,
            bulletins,
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `personnel_${personnel.matricule_personnel || personnel.id_personnel}_${new Date().toISOString().split("T")[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [personnel, contrats, paies, bulletins]);

    if (!personnel) return null;

    const fullName = `${personnel.prenom_personnel} ${personnel.nom_personnel}`.trim();
    const initials = fullName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase() || "P";

    const formatDate = (dateString?: string) => {
        if (!dateString) return "—";
        try {
            return new Date(dateString).toLocaleDateString("fr-FR");
        } catch {
            return dateString;
        }
    };

    const formatCurrency = (amount?: number) => {
        if (amount === undefined || amount === null) return "—";
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "XOF",
        }).format(amount);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-[70%] max-w-4xl bg-white shadow-xl z-50 transform transition-transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                } flex flex-col`}
            >
                {/* Header */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                        <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#27a082]/10 text-[#27a082] text-sm font-semibold uppercase flex-shrink-0">
                            {initials}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl font-semibold text-gray-800 truncate">{fullName}</h1>
                            <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                {personnel.matricule_personnel && (
                                    <span className="truncate">{personnel.matricule_personnel}</span>
                                )}
                                {personnel.email_travail || personnel.email_personnel ? (
                                    <span className="truncate">
                                        {personnel.email_travail || personnel.email_personnel}
                                    </span>
                                ) : null}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        title="Fermer"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    </button>
                </header>

                {/* Tabs */}
                <div className="border-b border-gray-200 bg-gray-50">
                    <div className="flex gap-1 px-6">
                        {[
                            {
                                id: "contrats",
                                label: "Contrats",
                                icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        <path
                                            d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                id: "paies",
                                label: "Paies",
                                icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                id: "bulletins",
                                label: "Bulletins",
                                icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ),
                            },
                            {
                                id: "export",
                                label: "Export",
                                icon: (
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                ),
                            },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 flex items-center gap-2 ${
                                    activeTab === tab.id
                                        ? "border-[#27a082] text-[#27a082] bg-white"
                                        : "border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-300"
                                }`}
                            >
                                <span className={activeTab === tab.id ? "text-[#27a082]" : "text-gray-600"}>
                                    {tab.icon}
                                </span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto relative">
                    {initialLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <ClipLoader
                                color="#27a082"
                                loading={initialLoading}
                                size={40}
                                speedMultiplier={3}
                                aria-label="Chargement..."
                                data-testid="loader"
                            />
                        </div>
                    )}
                    <div className={`p-6 ${initialLoading ? "opacity-0" : "opacity-100 transition-opacity duration-300"}`}>
                        {activeTab === "contrats" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Contrats</h2>
                                </div>
                                {loadingContrats ? (
                                    <div className="flex items-center justify-center py-12">
                                        <ClipLoader size={24} color="#27a082" />
                                    </div>
                                ) : contrats.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>Aucun contrat trouvé</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {contrats.map((contrat) => (
                                            <div
                                                key={contrat.id_contrat}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-[#27a082]/40 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-semibold text-gray-800">
                                                                {contrat.type_contrat}
                                                            </span>
                                                            {contrat.statut && (
                                                                <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                                                                    {contrat.statut}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                            <div>
                                                                <span className="font-medium">Début:</span>{" "}
                                                                {formatDate(contrat.date_debut)}
                                                            </div>
                                                            {contrat.date_fin && (
                                                                <div>
                                                                    <span className="font-medium">Fin:</span>{" "}
                                                                    {formatDate(contrat.date_fin)}
                                                                </div>
                                                            )}
                                                            {contrat.salaire_reference && (
                                                                <div>
                                                                    <span className="font-medium">Salaire:</span>{" "}
                                                                    {formatCurrency(contrat.salaire_reference)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {contrat.url_contrat && (
                                                        <a
                                                            href={contrat.url_contrat}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="ml-4 p-2 text-[#27a082] hover:bg-[#27a082]/10 rounded transition-colors"
                                                            title="Voir le contrat"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "paies" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Paies</h2>
                                </div>
                                {loadingPaies ? (
                                    <div className="flex items-center justify-center py-12">
                                        <ClipLoader size={24} color="#27a082" />
                                    </div>
                                ) : paies.length === 0 ? (
                                    <div className="text-center py-12 text-gray-500">
                                        <p>Aucune paie trouvée</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {paies.map((paie) => (
                                            <div
                                                key={paie.id_paie}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-[#27a082]/40 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-semibold text-gray-800">
                                                                {new Date(paie.annee, paie.mois - 1).toLocaleDateString("fr-FR", {
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </span>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                                                            <div>
                                                                <span className="font-medium">Salaire brut:</span>{" "}
                                                                {formatCurrency(paie.salaire_brut)}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">Salaire net:</span>{" "}
                                                                {formatCurrency(paie.salaire_net)}
                                                            </div>
                                                            {paie.primes && (
                                                                <div>
                                                                    <span className="font-medium">Primes:</span>{" "}
                                                                    {formatCurrency(paie.primes)}
                                                                </div>
                                                            )}
                                                            {paie.deductions && (
                                                                <div>
                                                                    <span className="font-medium">Déductions:</span>{" "}
                                                                    {formatCurrency(paie.deductions)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "bulletins" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Bulletins de paie</h2>
                                    <button
                                        className="px-4 py-2 bg-[#27a082] text-white rounded-lg text-sm font-medium hover:bg-[#27a082]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            setLoadingModalOpen(true);
                                            setTimeout(() => {
                                                setIsModalCreatePaieOpen(true);
                                                setLoadingModalOpen(false);
                                            }, 300);
                                        }}
                                        disabled={loadingModalOpen}
                                    >
                                        {loadingModalOpen ? (
                                            <>
                                                <ClipLoader size={14} color="#fff" />
                                                <span>Ouverture...</span>
                                            </>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                </svg>
                                                Créer une paie
                                            </>
                                        )}
                                    </button>
                                </div>
                                {loadingBulletins ? (
                                    <div className="flex items-center justify-center py-12">
                                        <ClipLoader size={24} color="#27a082" />
                                    </div>
                                ) : bulletins.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <svg
                                            width="120"
                                            height="120"
                                            viewBox="0 0 120 120"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="mb-4"
                                        >
                                            {/* Document principal */}
                                            <rect
                                                x="20"
                                                y="15"
                                                width="80"
                                                height="90"
                                                rx="2"
                                                fill="#F3F4F6"
                                                stroke="#E5E7EB"
                                                strokeWidth="2"
                                            />
                                            {/* Coin plié */}
                                            <path
                                                d="M20 15L35 15L20 30V15Z"
                                                fill="#E5E7EB"
                                                stroke="#D1D5DB"
                                                strokeWidth="2"
                                            />
                                            {/* Lignes de texte (vide) */}
                                            <line
                                                x1="30"
                                                y1="45"
                                                x2="90"
                                                y2="45"
                                                stroke="#D1D5DB"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                opacity="0.5"
                                            />
                                            <line
                                                x1="30"
                                                y1="55"
                                                x2="75"
                                                y2="55"
                                                stroke="#D1D5DB"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                opacity="0.5"
                                            />
                                            <line
                                                x1="30"
                                                y1="65"
                                                x2="85"
                                                y2="65"
                                                stroke="#D1D5DB"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                opacity="0.5"
                                            />
                                            <line
                                                x1="30"
                                                y1="75"
                                                x2="70"
                                                y2="75"
                                                stroke="#D1D5DB"
                                                strokeWidth="1.5"
                                                strokeLinecap="round"
                                                opacity="0.5"
                                            />
                                            {/* Icône de recherche/zoom */}
                                            <circle
                                                cx="60"
                                                cy="50"
                                                r="15"
                                                fill="white"
                                                stroke="#27a082"
                                                strokeWidth="2"
                                                opacity="0.3"
                                            />
                                            <path
                                                d="M68 58L72 62"
                                                stroke="#27a082"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                opacity="0.5"
                                            />
                                        </svg>
                                        <p className="text-gray-500 text-sm font-medium">Aucun bulletin trouvé</p>
                                        <p className="text-gray-400 text-xs mt-1">Créez un nouveau bulletin pour commencer</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {bulletins.map((bulletin) => (
                                            <div
                                                key={bulletin.id_bulletin}
                                                className="border border-gray-200 rounded-lg p-4 hover:border-[#27a082]/40 transition-colors"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-sm font-semibold text-gray-800">
                                                                Bulletin du {formatDate(bulletin.date_emission)}
                                                            </span>
                                                        </div>
                                                        {bulletin.paie && (
                                                            <div className="text-sm text-gray-600 mb-2">
                                                                <span className="font-medium">Période:</span>{" "}
                                                                {new Date(bulletin.paie.annee, bulletin.paie.mois - 1).toLocaleDateString("fr-FR", {
                                                                    month: "long",
                                                                    year: "numeric",
                                                                })}
                                                            </div>
                                                        )}
                                                        {bulletin.note_rh && (
                                                            <div className="text-sm text-gray-600">
                                                                <span className="font-medium">Note:</span> {bulletin.note_rh}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 ml-4">
                                                        <a
                                                            href={bulletin.url_pdf}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-2 text-[#27a082] hover:bg-[#27a082]/10 rounded transition-colors"
                                                            title="Voir le bulletin"
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M14 2v6h6M16 13H8M16 17H8M10 9H8"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </a>
                                                        <button
                                                            className="p-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                                            title="Modifier"
                                                            onClick={async () => {
                                                                // TODO: Implémenter le formulaire de modification
                                                                const newNote = prompt("Modifier la note RH:", bulletin.note_rh || "");
                                                                if (newNote !== null) {
                                                                    try {
                                                                        await updateBulletinPaie(bulletin.id_bulletin, { note_rh: newNote });
                                                                        await fetchBulletins(); // Rafraîchir la liste
                                                                    } catch (err) {
                                                                        console.error("Erreur lors de la modification:", err);
                                                                        alert("Erreur lors de la modification du bulletin");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                                <path
                                                                    d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Supprimer"
                                                            onClick={async () => {
                                                                if (confirm("Êtes-vous sûr de vouloir supprimer ce bulletin ?")) {
                                                                    try {
                                                                        await deleteBulletinPaie(bulletin.id_bulletin);
                                                                        await fetchBulletins(); // Rafraîchir la liste
                                                                    } catch (err) {
                                                                        console.error("Erreur lors de la suppression:", err);
                                                                        alert("Erreur lors de la suppression du bulletin");
                                                                    }
                                                                }
                                                            }}
                                                        >
                                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                                <path
                                                                    d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
                                                                    stroke="currentColor"
                                                                    strokeWidth="2"
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "export" && (
                            <div>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-lg font-semibold text-gray-800">Export des données</h2>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <p className="text-sm text-gray-600 mb-4">
                                        Exportez toutes les données du personnel au format JSON, incluant les contrats, paies et bulletins.
                                    </p>
                                    <button
                                        onClick={handleExport}
                                        className="px-4 py-2 bg-[#27a082] text-white rounded-lg text-sm font-medium hover:bg-[#27a082]/90 transition-colors flex items-center gap-2"
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                            <path
                                                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        Exporter les données
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal de création de paie */}
            {personnel && (
                <ModalCreatePaie
                    isOpen={isModalCreatePaieOpen}
                    onClose={() => setIsModalCreatePaieOpen(false)}
                    personnelId={personnel.id_personnel}
                    personnelName={`${personnel.prenom_personnel} ${personnel.nom_personnel}`}
                    onSuccess={handlePaieCreated}
                />
            )}
        </>
    );
}

