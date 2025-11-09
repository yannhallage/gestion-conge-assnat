import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { Tooltip } from "react-tooltip";
import { toast } from "sonner";
import Drawer from "../../../../components/drawer";
import { ConfirmModal } from "../../../../components/modal-component";
import { useChefService } from "../../../../hooks/chefdeservice/useChefService";
import { useAuth } from "../../../../contexts/AuthContext";

type DemandeStatus = "EN_ATTENTE" | "EN_COURS" | "APPROUVEE" | "REFUSEE" | string;

type Demande = {
    id_demande: string;
    statut_demande: DemandeStatus;
    date_demande?: string;
    date_debut?: string | null;
    date_fin?: string | null;
    type_demande?: string | null;
    motif?: string | null;
    nb_jour?: number | null;
    id_service?: string | null;
    periodeConge?: {
        date_debut?: string | null;
        date_fin?: string | null;
        nb_jour?: number | null;
        id_typeconge?: string | null;
        typeConge?: {
            libelle_typeconge?: string | null;
        } | null;
    } | null;
    personnel?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
        email_travail?: string | null;
        telephone_travail?: string | null;
        telephone_personnel?: string | null;
    } | null;
    discussions?: Array<{
        id_discussion?: string;
        message: string;
        heure_message?: string | null;
        auteur?: string | null;
    }>;
    chef_service?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
    } | null;
    ficheDeConge?: {
        id_fiche?: string;
        url?: string;
    } | null;
};

type ModalType = "approve" | "reject" | null;

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
    EN_ATTENTE: { label: "En attente", className: "bg-amber-50 border border-amber-200 text-amber-700" },
    EN_COURS: { label: "En cours", className: "bg-sky-50 border border-sky-200 text-sky-700" },
    APPROUVEE: { label: "Approuvée", className: "bg-emerald-50 border border-emerald-200 text-emerald-700" },
    REFUSEE: { label: "Refusée", className: "bg-rose-50 border border-rose-200 text-rose-700" },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const ApprobationFeatureAdmin = () => (
    <div className="flex h-full flex-col bg-white">
        <header className="flex space-x-2 border-b border-gray-200 px-5 py-3">
            <h1 className="text-xl font-semibold text-gray-800">En attente d&apos;approbation</h1>
        </header>
        <MesApprobationsEnAttentes />
    </div>
);

export default ApprobationFeatureAdmin;

const AucuneDemandeApprobation = () => (
    <motion.div
        className="flex h-[80vh] flex-col items-center justify-center text-center text-gray-600"
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
    >
        <div className="relative">
            <div className="flex h-[220px] w-[520px] items-center justify-center">
                <img
                    src="data:image/svg+xml,%3csvg%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20x='0px'%20y='0px'%20width='879.883px'%20height='483.058px'%20viewBox='-447.765%202383.224%20879.883%20483.058'%20enable-background='new%20-447.765%202383.224%20879.883%20483.058'%20xml:space='preserve'%3e%3cg%20id='Warstwa_9'%3e%3c/g%3e%3cg%20id='Warstwa_8'%3e%3c/g%3e%3cg%20id='Warstwa_7'%3e%3c/g%3e%3cg%20id='Warstwa_3'%3e%3c/g%3e%3cg%20id='Warstwa_10'%3e%3c/g%3e%3cg%20id='Warstwa_1'%3e%3cpath%20fill='%234BB290'%20d='M-52.102,2093.901'/%3e%3c/g%3e%3cg%20id='Warstwa_11'%3e%3cpath%20opacity='0.4'%20fill='%23EDEFF2'%20d='M-361.54,2458.002c0,0-91.333,35.333-86,123.333s48,80.667,99.333,123.333%20c51.333,42.667,32.004,68.072,29.333,86.667c-6.644,46.25,41.333,66.667,78,66.667c0,0,79.333,10.667,147.333-32%20s112.667-34.667,165.333-11.333c52.667,23.333,156.002,55.269,118.667-39.333c-50.229-127.272,16.471-88.503,48.771-142.612%20c69.622-116.63-8.105-243.388-126.105-249.392c-78.568-3.997-99.333,104.003-178.667,86.003S-268.874,2422.669-361.54,2458.002z'/%3e%3cg%3e%3cpath%20fill='%23E8EAED'%20d='M41.691,2856.178c-14.243-39.982-29.875-101.434-33.723-112.647c-4.146-12.08,8.462-60.279,7.667-64.798%20c-17.024-37.72-93.891-38.418-93.891-38.418c2.814,10.361-3.677,16.365-23.812,10.237c-21.392-6.511-49.825-23.229-49.825-23.229%20c-14.601-4.303-28.897-6.589-38.241-7.745l0,0c0,0-23.854,13.483-14.576,17.664c0,0-82.764,56.052,23.236,139.491%20c0,0,47.228,1.695,19.706,18.362c-27.522,16.667-7.094,31.646,29.572,60.979h-74.24c-0.002,0.063-0.003,0.105-0.003,0.105H41.691z%20'/%3e%3c/g%3e%3c/g%3e%3c/svg%3e"
                    alt="Illustration aucune demande"
                />
            </div>
        </div>

        <div className="mt-4">
            <h2 className="mt-6 text-lg text-gray-700">Aucune demande en attente</h2>
        </div>

        <p className="mt-2 max-w-md text-sm text-gray-400">
            Il n’y a actuellement aucune demande en attente nécessitant votre approbation.
        </p>
    </motion.div>
);

function MesApprobationsEnAttentes() {
    const { user } = useAuth();
    const chefId = user?.id ?? null;
    const {
        loading: serviceLoading,
        error: serviceError,
        getServiceDemandes,
        approveDemande,
        rejectDemande,
    } = useChefService();

    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [modalType, setModalType] = useState<ModalType>(null);
    const [approveComment, setApproveComment] = useState("");
    const [rejectReason, setRejectReason] = useState("");
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        if (!chefId) {
            setFetchError("Impossible de récupérer l'identifiant du chef de service.");
            setLoading(false);
            return;
        }

        let cancelled = false;

        const fetchData = async () => {
            try {
                setLoading(true);
                setFetchError(null);
                const response = await getServiceDemandes(chefId);
                if (cancelled) return;
                setDemandes(Array.isArray(response) ? response : []);
            } catch (err: any) {
                if (!cancelled) {
                    setFetchError(err?.message || "Erreur lors du chargement des demandes.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [chefId, getServiceDemandes]);

    const filteredDemandes = useMemo(() => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        return demandes.filter((demande) => {
            if (demande.statut_demande !== "EN_ATTENTE") return false;
            if (!normalizedSearch) return true;

            const type = demande.periodeConge?.typeConge?.libelle_typeconge || demande.type_demande || "";
            const owner = `${demande.personnel?.prenom_personnel ?? ""} ${demande.personnel?.nom_personnel ?? ""}`;

            return (
                type.toLowerCase().includes(normalizedSearch) ||
                owner.toLowerCase().includes(normalizedSearch)
            );
        });
    }, [demandes, searchTerm]);

    const openDrawerWith = (demande: Demande) => {
        setSelectedDemande(demande);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedDemande(null);
    };

    const openModal = (type: ModalType, demande: Demande) => {
        setModalType(type);
        setSelectedDemande(demande);
        setApproveComment("");
        setRejectReason("");
        setActionError(null);
    };

    const closeModal = () => {
        setModalType(null);
        setSelectedDemande(null);
        setApproveComment("");
        setRejectReason("");
        setActionError(null);
    };

    const updateLocalDemande = (id: string, patch: Partial<Demande>) => {
        setDemandes((prev) =>
            prev.map((demande) => (demande.id_demande === id ? { ...demande, ...patch } : demande))
        );
    };

    const handleApproveReject = async () => {
        if (!modalType || !selectedDemande || !chefId) return;

        const demandeId = selectedDemande.id_demande;
        const serviceId = selectedDemande.id_service;
        if (!serviceId) {
            setActionError("Impossible d'identifier le service du chef.");
            return;
        }

        const chefPayload = {
            id_personnel: chefId,
            id_service: serviceId,
            email_travail: user?.email_personnel ?? undefined,
        };

        try {
            setActionLoading(true);
            setActionError(null);

            if (modalType === "approve") {
                const payload = approveComment.trim()
                    ? { commentaire: approveComment.trim() }
                    : {};
                await approveDemande(demandeId, chefPayload, payload);
                updateLocalDemande(demandeId, { statut_demande: "APPROUVEE" });
                toast.success("Demande approuvée avec succès.");
            } else if (modalType === "reject") {
                if (!rejectReason.trim()) {
                    setActionError("Veuillez préciser le motif de refus.");
                    return;
                }
                await rejectDemande(demandeId, chefPayload, { motif: rejectReason.trim() });
                updateLocalDemande(demandeId, { statut_demande: "REFUSEE" });
                toast.success("Demande refusée.");
            }

            closeModal();
        } catch (err: any) {
            setActionError(err?.message || "Impossible de traiter l'action.");
        } finally {
            setActionLoading(false);
        }
    };

    const renderStatusBadge = (status: DemandeStatus) => {
        const style =
            STATUS_STYLES[status] ??
            { label: status, className: "bg-gray-100 border border-gray-200 text-gray-600" };
        return (
            <span className={`${style.className} rounded-md px-2 py-0.5 text-[10px] font-medium`}>
                {style.label}
            </span>
        );
    };

    if (loading || serviceLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <ClipLoader color="#27a082" size={32} />
            </div>
        );
    }

    if (fetchError || serviceError) {
        return (
            <div className="flex h-full items-center justify-center px-6 py-16 text-sm text-red-500">
                {fetchError || serviceError}
            </div>
        );
    }

    if (!filteredDemandes.length) {
        return <AucuneDemandeApprobation />;
    }

    return (
        <div className="h-screen overflow-y-auto px-6 pb-8 pt-4 font-sans text-gray-800">
            <div className="mb-6 flex flex-wrap items-center gap-3">
                <input
                    type="text"
                    placeholder="Recherche de demande"
                    className="w-64 border border-[#ccc] px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-green-200"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
            </div>

            <div className="overflow-hidden bg-white shadow-sm">
                <table className="w-full text-sm text-gray-800">
                    <thead className="border-b border-gray-200 bg-gray-50">
                        <tr>
                            <th className="px-4 py-2.5 text-left text-[13px] font-medium tracking-wide text-gray-600">
                                Type d&apos;absence
                            </th>
                            <th className="px-4 py-2.5 text-left text-[13px] font-medium tracking-wide text-gray-600">
                                Statut
                            </th>
                            <th className="px-4 py-2.5 text-left text-[13px] font-medium tracking-wide text-gray-600">
                                Période d&apos;absence
                            </th>
                            <th className="px-4 py-2.5 text-left text-[13px] font-medium tracking-wide text-gray-600">
                                Demandé
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDemandes.map((demande) => {
                            const nbJour = demande.periodeConge?.nb_jour ?? demande.nb_jour;
                            const nbJourLabel = nbJour ? `${nbJour} j` : "—";
                            const typeLabel =
                                demande.periodeConge?.typeConge?.libelle_typeconge ??
                                demande.type_demande ??
                                "Demande";
                            const startDate = demande.periodeConge?.date_debut ?? demande.date_debut;
                            const endDate = demande.periodeConge?.date_fin ?? demande.date_fin;
                            const periodLabel = formatDateRange(startDate, endDate);
                            const demandIdSuffix = demande.id_demande;

                            return (
                                <tr
                                    key={demande.id_demande}
                                    className="group border-b border-gray-100 transition-colors hover:bg-gray-50"
                                >
                                    <td
                                        className="cursor-pointer px-4 py-3 text-[14px] text-gray-800"
                                        onClick={() => openDrawerWith(demande)}
                                    >
                                        {typeLabel}
                                    </td>
                                    <td className="px-4 py-3">{renderStatusBadge(demande.statut_demande)}</td>
                                    <td className="px-4 py-3 text-[14px] text-gray-800">{periodLabel}</td>
                                    <td className="flex items-center justify-between px-4 py-3 text-[14px] text-gray-800">
                                        <span>{nbJourLabel}</span>
                                        <div className="flex translate-x-9 items-center gap-3 text-gray-500 opacity-0 transition-all duration-150 group-hover:translate-x-0 group-hover:opacity-100">
                                            <button
                                                className="cursor-pointer hover:text-[#27a082]"
                                                data-tooltip-id={`delete-${demandIdSuffix}`}
                                                data-tooltip-content="Supprimer"
                                                onClick={() => toast.info("Suppression disponible depuis la liste principale.")}
                                            >
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <g id="r-u/trash">
                                                        <g id="Union">
                                                            <path d="M15 3H9V4H4V6H20V4H15V3Z" fill="currentColor"></path>
                                                            <path d="M5 7H19V19C19 20.1046 18.1046 21 17 21H7C5.89545 21 5 20.1046 5 19V7Z" fill="currentColor"></path>
                                                        </g>
                                                    </g>
                                                </svg>
                                                <Tooltip id={`delete-${demandIdSuffix}`} />
                                            </button>
                                            <button
                                                className="cursor-pointer hover:text-[#27a082]"
                                                data-tooltip-id={`download-${demandIdSuffix}`}
                                                data-tooltip-content="Télécharger le PDF"
                                                onClick={() => {
                                                    if (demande.ficheDeConge?.url) {
                                                        window.open(demande.ficheDeConge.url, "_blank");
                                                    } else {
                                                        toast.info("Aucune fiche disponible pour cette demande.");
                                                    }
                                                }}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M16.8525 3H3V21H21V7.167L16.8525 3ZM12.018 18.4545L7.7775 14.214H10.215V8.7855H13.7145V14.214H16.2585L12.018 18.4545ZM15.6435 8.214V4.203L19.6305 8.214H15.6435Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <Tooltip id={`download-${demandIdSuffix}`} />
                                            </button>
                                            <button
                                                className="cursor-pointer hover:text-[#27a082]"
                                                data-tooltip-id={`cancel-${demandIdSuffix}`}
                                                data-tooltip-content="Annuler la demande"
                                                onClick={() => toast.info("Révocation disponible depuis la liste principale.")}
                                            >
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M5.7 5.7V18.3H19.2V21H5.7H3V18.3V5.7V3H5.7H19.2V5.7H5.7ZM16.5 10.65H10.2V13.35H16.5V10.65ZM21 12L16.5 7.95001V16.05L21 12Z"
                                                        fill="currentColor"
                                                    />
                                                </svg>
                                                <Tooltip id={`cancel-${demandIdSuffix}`} />
                                            </button>
                                            <button
                                                onClick={() => openModal("reject", demande)}
                                                className="flex cursor-pointer border border-[#ccc] p-2 pl-6 pr-6 text-[#555] hover:border-[#555]"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                                                    <g id="r-u/reject">
                                                        <path
                                                            id="Union"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M14.6034 12.2069L20.4145 6.39579L18.0166 4L12.2072 9.80934L6.39787 4L4 6.39575L9.80966 12.2069L4.00011 18.0165L6.39776 20.4141L12.2072 14.6031L18.0167 20.4141L20.4144 18.0164L14.6034 12.2069Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                Rejeter
                                            </button>
                                            <button
                                                onClick={() => openModal("approve", demande)}
                                                className="flex cursor-pointer bg-[#27a082] p-2 pl-6 pr-6 text-white hover:bg-emerald-600"
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mt-1">
                                                    <g id="a-d/approve">
                                                        <path
                                                            id="Union"
                                                            fillRule="evenodd"
                                                            clipRule="evenodd"
                                                            d="M3.2959 11.1294L10.6341 18.71L20.7041 8.79857L18.0166 6.2901L12.6934 13.7509L5.7817 8.68004L3.2959 11.1294ZM18.2656 7.00006L19.9998 8.79022L10.6427 17.9999L19.9998 8.79019L18.2656 7L18.2656 7.00006ZM5.77342 9.39014L10.6849 14.4608L10.6849 14.4608L5.77336 9.3902L5.77342 9.39014Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </g>
                                                </svg>
                                                Accepter
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <Drawer isOpen={drawerOpen} onClose={closeDrawer} demande={selectedDemande ?? undefined} />

            <ConfirmModal
                isOpen={modalType !== null}
                title={modalType === "approve" ? "Approuver la demande" : "Rejeter la demande"}
                description={
                    selectedDemande
                        ? `Souhaites-tu ${modalType === "approve" ? "approuver" : "refuser"} la demande « ${
                              selectedDemande.periodeConge?.typeConge?.libelle_typeconge ?? selectedDemande.type_demande ?? "Demande"
                          } » de ${`${selectedDemande.personnel?.prenom_personnel ?? ""} ${
                              selectedDemande.personnel?.nom_personnel ?? ""
                          }`.trim() || "ce collaborateur"} ?`
                        : ""
                }
                cancelText="Annuler"
                confirmText="Confirmer"
                confirm={handleApproveReject}
                cancel={closeModal}
                loading={actionLoading}
            >
                {modalType === "approve" && (
                    <div className="w-full text-left">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Commentaire (optionnel)</label>
                        <textarea
                            className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            value={approveComment}
                            onChange={(event) => setApproveComment(event.target.value)}
                            placeholder="Ajouter un commentaire pour le collaborateur..."
                        />
                    </div>
                )}

                {modalType === "reject" && (
                    <div className="w-full text-left">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Motif du refus</label>
                        <textarea
                            className="h-24 w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
                            value={rejectReason}
                            onChange={(event) => setRejectReason(event.target.value)}
                            placeholder="Explique les raisons du refus..."
                        />
                    </div>
                )}

                {actionError && <p className="mt-2 text-sm text-red-500">{actionError}</p>}
            </ConfirmModal>
        </div>
    );
}

function formatDateRange(start?: string | null, end?: string | null) {
    if (!start && !end) return "—";
    if (start && !end) return DATE_FORMATTER.format(new Date(start));
    if (!start && end) return DATE_FORMATTER.format(new Date(end));
    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    return `${DATE_FORMATTER.format(startDate)} - ${DATE_FORMATTER.format(endDate)}`;
}

