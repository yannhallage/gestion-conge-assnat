import { useEffect, useMemo, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { Tooltip } from "react-tooltip";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { ConfirmModal } from "../../../../components/modal-component";
import Drawer from "../../../../components/drawer";
import { useChefService } from "../../../../hooks/chefdeservice/useChefService";
import { useAuth } from "../../../../contexts/AuthContext";
import type { ApproveDemandePayload, RejectDemandePayload, ChefActionPayload } from "../../../../types/validation.dto";

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

type ModalType = "approve" | "reject" | "revoke" | "delete" | null;

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

const DemandesFeatureAdmin = () => (
    <div className="flex flex-col bg-white">
            <header className="border-b border-gray-200 px-5 py-3">
                <h1 className="text-xl text-gray-800">Mes demandes</h1>
            </header>
                    <MesDemandes />
        </div>
    );

export default DemandesFeatureAdmin;

function MesDemandes() {
    const { user } = useAuth();
    const chefId = user?.id ?? null;

    const {
        getServiceDemandes,
        approveDemande,
        rejectDemande,
        revokeDemande,
        deleteDemande,
    } = useChefService();

    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);
    const [modalType, setModalType] = useState<ModalType>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [chefServiceId, setChefServiceId] = useState<string | null>(null);
    const [approveComment, setApproveComment] = useState("");
    const [rejectReason, setRejectReason] = useState("");

    useEffect(() => {
        if (!chefId) {
            setLoading(false);
            setError("Impossible de récupérer l'identifiant du chef de service.");
            return;
        }

        const fetchDemandes = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getServiceDemandes(chefId);
                const demandesArray = Array.isArray(result) ? result : [];
                setDemandes(demandesArray);
                const derivedServiceId = demandesArray.find((demande) => demande?.id_service)?.id_service;
                if (derivedServiceId) {
                    setChefServiceId(derivedServiceId);
                }
            } catch (err: any) {
                setError(err?.message || "Erreur lors du chargement des demandes.");
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, [chefId, getServiceDemandes]);

    const statusLabels = useMemo(() => STATUS_STYLES, []);

    const openModal = (type: ModalType, demande: Demande) => {
        setModalType(type);
        setSelectedDemande(demande);
        setActionError(null);
        setApproveComment("");
        setRejectReason("");
    };

    const buildChefContext = useCallback(
        (serviceId: string): ChefActionPayload | null => {
            if (!chefId) return null;
            return {
                id_personnel: chefId,
                id_service: serviceId,
                email_travail: user?.email_personnel ?? undefined,
            };
        },
        [chefId, user?.email_personnel]
    );

    const handleAction = async () => {
        if (!modalType || !selectedDemande || !chefId) return;

        const demandeId = selectedDemande.id_demande;
        const serviceId = selectedDemande.id_service ?? chefServiceId;
        if (!serviceId) {
            setActionError("Impossible d'identifier le service du chef.");
            setActionLoading(false);
            return;
        }

        const chefContext = buildChefContext(serviceId);
        if (!chefContext) {
            setActionError("Impossible d'identifier le chef de service.");
            setActionLoading(false);
            return;
        }
        setActionLoading(true);
        setActionError(null);

        try {
            switch (modalType) {
                case "approve": {
                    const payload: ApproveDemandePayload = approveComment.trim()
                        ? { commentaire: approveComment.trim() }
                        : {};
                    await approveDemande(demandeId, chefContext, payload);
                    updateLocalDemande(demandeId, { statut_demande: "APPROUVEE" });
                    toast.success("Demande approuvée avec succès.");
                    break;
                }
                case "reject": {
                    if (!rejectReason.trim()) {
                        setActionError("Veuillez préciser le motif de refus.");
                        setActionLoading(false);
                        return;
                    }
                    const payload: RejectDemandePayload = { motif: rejectReason.trim() };
                    await rejectDemande(demandeId, chefContext, payload);
                    updateLocalDemande(demandeId, { statut_demande: "REFUSEE" });
                    toast.success("Demande refusée.");
                    break;
                }
                case "revoke": {
                    await revokeDemande(demandeId, chefContext);
                    updateLocalDemande(demandeId, { statut_demande: "REFUSEE" });
                    toast.success("Demande révoquée.");
                    break;
                }
                case "delete": {
                    await deleteDemande(demandeId, chefContext);
                    removeLocalDemande(demandeId);
                    toast.success("Demande supprimée.");
                    break;
                }
                default:
                    break;
            }
            setModalType(null);
            setSelectedDemande(null);
        } catch (err: any) {
            setActionError(err?.message || "Impossible de traiter l'action.");
        } finally {
            setActionLoading(false);
        }
    };

    const updateLocalDemande = (id: string, patch: Partial<Demande>) => {
        setDemandes((prev) =>
            prev.map((demande) => (demande.id_demande === id ? { ...demande, ...patch } : demande))
        );
    };

    const removeLocalDemande = (id: string) => {
        setDemandes((prev) => prev.filter((demande) => demande.id_demande !== id));
    };

    const renderStatusBadge = (status: DemandeStatus) => {
        const style =
            statusLabels[status] ??
            { label: status, className: "bg-gray-100 border border-gray-200 text-gray-600" };
        return (
            <span className={`${style.className} rounded-md px-2 py-0.5 text-[10px] font-medium`}>
                {style.label}
            </span>
        );
    };

    const renderActions = (demande: Demande) => {
        const isPending = demande.statut_demande === "EN_ATTENTE";
        const isApproved = demande.statut_demande === "APPROUVEE";

        return (
            <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500">
                {isPending && (
                    <TooltipWrapper id="approve" content="Approuver">
                        <button onClick={() => openModal("approve", demande)} className="hover:text-[#27a082] cursor-pointer">
                            ✓
                        </button>
                    </TooltipWrapper>
                )}
                {isPending && (
                    <TooltipWrapper id="reject" content="Refuser">
                        <button onClick={() => openModal("reject", demande)} className="hover:text-[#27a082] cursor-pointer">
                            ✕
                        </button>
                    </TooltipWrapper>
                )}
                {isApproved && (
                    <TooltipWrapper id="revoke" content="Révoquer">
                        <button onClick={() => openModal("revoke", demande)} className="hover:text-[#27a082] cursor-pointer">
                            ↺
                        </button>
                    </TooltipWrapper>
                )}
                <TooltipWrapper id="delete" content="Supprimer">
                    <button onClick={() => openModal("delete", demande)} className="hover:text-[#27a082] cursor-pointer">
                        🗑
                    </button>
                </TooltipWrapper>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-500">
                <ClipLoader size={24} color="#27a082" />
                <span className="ml-2 text-sm">Chargement des demandes...</span>
            </div>
        );
    }

    if (error) {
        return <p className="px-6 py-4 text-sm text-red-500">{error}</p>;
    }

    return (
        <div className="p-6 font-sans text-gray-800 h-screen overflow-y-auto">
            <div className="flex flex-wrap items-center gap-3 mb-6">
                <input
                    type="text"
                    placeholder="Recherche de demande"
                    className="border border-[#ccc] px-3 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-green-200"
                    disabled
                />

                <button className="flex items-center bg-[#f6f7f9] gap-2 text-sm text-gray-700 rounded border-[#ccc] px-3 py-2 cursor-not-allowed">
                    <span className="text-gray-500">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3H6V5H5.118C3.949 5 3 5.956 3 7.134V18.866C3 20.044 3.949 21 5.118 21H18.882C20.051 21 21 20.044 21 18.866V7.134C21 5.956 20.051 5 18.882 5H18V3H16V5H8V3ZM5.118 18.866V11H18.882V18.866H5.118ZM7 16V14H9V16H7ZM11 14H13V16H11V14Z" fill="currentColor" /></svg>
                    </span>
                    <span>Date : Tous</span>
                </button>
                <button className="flex items-center bg-[#f6f7f9] gap-2 text-sm text-gray-700 rounded border-[#ccc] px-3 py-2 cursor-not-allowed">
                    <span className="text-gray-500">
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.201 17.799 1.5 12 1.5C6.201 1.5 1.5 6.201 1.5 12C1.5 17.799 6.201 22.5 12 22.5ZM17 12C17 14.761 14.761 17 12 17C9.239 17 7 14.761 7 12C7 9.239 9.239 7 12 7C14.761 7 17 9.239 17 12ZM19 12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12C5 8.134 8.134 5 12 5C15.866 5 19 8.134 19 12Z" fill="currentColor" /></svg>
                    </span>
                    <span>Statut : Tous</span>
                </button>
            </div>

            <div className="overflow-hidden shadow-sm bg-white">
                <table className="w-full text-sm text-gray-800">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left py-2.5 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                Type d'absence
                            </th>
                            <th className="text-left py-2.5 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                Statut
                            </th>
                            <th className="text-left py-2.5 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                Période
                            </th>
                            <th className="text-left py-2.5 px-4 text-[13px] font-medium text-gray-600 tracking-wide">
                                Durée
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {demandes.map((demande) => (
                            <tr
                                key={demande.id_demande}
                                className="group border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                                {(() => {
                                    const nbJour = demande.periodeConge?.nb_jour ?? demande.nb_jour;
                                    const nbJourLabel = nbJour ? `${nbJour} j` : "—";
                                    const typeLabel =
                                        demande.periodeConge?.typeConge?.libelle_typeconge ??
                                        demande.type_demande ??
                                        "Demande";
                                    const startDate = demande.periodeConge?.date_debut ?? demande.date_debut;
                                    const endDate = demande.periodeConge?.date_fin ?? demande.date_fin;
                                    const periodLabel = formatDateRange(startDate, endDate);

                                    return (
                                        <>
                                            <td
                                                className="cursor-pointer py-3 px-4 text-[14px] text-gray-800"
                                                onClick={() => {
                                                    setSelectedDemande(demande);
                                                    setIsDrawerOpen(true);
                                                }}
                                            >
                                                {typeLabel}
                                            </td>
                                            <td className="py-3 px-4">{renderStatusBadge(demande.statut_demande)}</td>
                                            <td className="py-3 px-4 text-[14px] text-gray-800">{periodLabel}</td>
                                            <td className="flex items-center justify-between py-3 px-4 text-[14px] text-gray-800">
                                                <span>{nbJourLabel}</span>
                                                {renderActions(demande)}
                                            </td>
                                        </>
                                    );
                                })()}
                            </tr>
                        ))}
                        {!demandes.length && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                                    Aucune demande à afficher.
                            </td>
                        </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                    setSelectedDemande(null);
                }}
                demande={selectedDemande ?? undefined}
            />

            <ConfirmModal
                isOpen={modalType !== null}
                title={getModalTitle(modalType)}
                description={selectedDemande ? getModalDescription(modalType, selectedDemande) : ""}
                    cancelText="Annuler"
                cancel={() => {
                    setModalType(null);
                    setSelectedDemande(null);
                    setActionError(null);
                }}
                    confirmText="Confirmer"
                confirm={handleAction}
                loading={actionLoading}
            >
                {modalType === "approve" && (
                    <div className="w-full text-left">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Commentaire (optionnel)
                        </label>
                        <textarea
                            className="w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                            rows={3}
                            value={approveComment}
                            onChange={(event) => setApproveComment(event.target.value)}
                            placeholder="Ajouter un commentaire pour le collaborateur..."
                        />
                    </div>
                )}

                {modalType === "reject" && (
                    <div className="w-full text-left">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Motif du refus
                        </label>
                        <textarea
                            className="w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-200"
                            rows={3}
                            value={rejectReason}
                            onChange={(event) => setRejectReason(event.target.value)}
                            placeholder="Expliquez les raisons du refus..."
                        />
                    </div>
                )}

                {actionError && <p className="text-sm text-red-500 mt-2">{actionError}</p>}
            </ConfirmModal>
        </div>
    );
}

function TooltipWrapper({ id, content, children }: { id: string; content: string; children: ReactNode }) {
    return (
        <>
            <div data-tooltip-id={id} data-tooltip-content={content}>
                {children}
            </div>
            <Tooltip id={id} />
        </>
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

function getModalTitle(type: ModalType) {
    switch (type) {
        case "approve":
            return "Approuver la demande";
        case "reject":
            return "Refuser la demande";
        case "revoke":
            return "Révoquer la demande";
        case "delete":
            return "Supprimer la demande";
        default:
            return "";
    }
}

function getModalDescription(type: ModalType, demande: Demande) {
    const libelle =
        demande.periodeConge?.typeConge?.libelle_typeconge || demande.type_demande || "Demande";
    const owner = `${demande.personnel?.prenom_personnel ?? ""} ${demande.personnel?.nom_personnel ?? ""}`.trim();

    switch (type) {
        case "approve":
            return `Souhaitez-vous approuver la demande « ${libelle} » de ${owner || "ce collaborateur"} ?`;
        case "reject":
            return `Souhaitez-vous refuser la demande « ${libelle} » de ${owner || "ce collaborateur"} ?`;
        case "revoke":
            return `Souhaitez-vous révoquer la demande « ${libelle} » de ${owner || "ce collaborateur"} ?`;
        case "delete":
            return `Souhaitez-vous supprimer définitivement la demande « ${libelle} » de ${owner || "ce collaborateur"} ?`;
        default:
            return "";
    }
}

