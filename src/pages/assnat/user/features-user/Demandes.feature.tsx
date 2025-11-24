import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Tooltip } from "react-tooltip";
import { ClipLoader } from "react-spinners";
import Drawer from "../../../../components/drawer";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUserService } from "../../../../hooks/employes/useUserService";

type DemandeStatus = "EN_ATTENTE" | "APPROUVEE" | "REFUSEE" | "EN_COURS" | "ANNULEE" | string;

export type Demande = {
    id_demande: string;
    statut_demande: DemandeStatus;
    date_demande?: string;
    type_demande?: string | null;
    motif?: string | null;
    nb_jour?: number | null;
    personnel?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
        email_travail?: string | null;
        telephone_travail?: string | null;
        telephone_personnel?: string | null;
    } | null;
    periodeConge?: {
        date_debut?: string | null;
        date_fin?: string | null;
        nb_jour?: number | null;
        id_typeconge?: string | null;
        typeConge?: {
            libelle_typeconge?: string | null;
        } | null;
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

const DemandesFeature = () => (
    <div className="flex flex-col bg-white">
        <header className="border-b border-gray-200 px-5 py-3">
            <h1 className="text-xl text-gray-800">Mes demandes</h1>
        </header>
        <MesDemandes />
    </div>
);

export default DemandesFeature;

function MesDemandes() {
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const { loading: serviceLoading, error: serviceError, getMyDemandes } = useUserService(userId);

    const [demandes, setDemandes] = useState<Demande[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDemande, setSelectedDemande] = useState<Demande | null>(null);

    useEffect(() => {
        if (!userId) {
            setDemandes([]);
            setLoading(false);
            return;
        }

        const fetchDemandes = async () => {
            setLoading(true);
            setError(null);
            try {
                const result = await getMyDemandes();
                setDemandes(Array.isArray(result) ? result : []);
            } catch (err: any) {
                setError(err?.message || "Erreur lors du chargement de vos demandes.");
            } finally {
                setLoading(false);
            }
        };

        fetchDemandes();
    }, [getMyDemandes, userId]);

    useEffect(() => {
        if (!serviceLoading && serviceError) {
            setError(serviceError);
        }
    }, [serviceError, serviceLoading]);

    const openDrawerWith = (demande: Demande) => {
        setSelectedDemande(demande);
        setDrawerOpen(true);
    };

    const handleCloseDrawer = () => {
        setDrawerOpen(false);
    };

    const statusStyles = useMemo(() => STATUS_STYLES, []);

    const renderStatus = (status: DemandeStatus) => {
        const style =
            statusStyles[status] ??
            { label: status, className: "bg-gray-100 border border-gray-200 text-gray-600" };
        return (
            <span className={`${style.className} rounded-md px-2 py-0.5 text-[10px] font-medium`}>
                {style.label}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-16 text-gray-500">
                <ClipLoader size={24} color="#27a082" />
                <span className="ml-2 text-sm">Chargement de vos demandes...</span>
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
                    disabled
                    className="border border-[#ccc] px-3 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-green-200 cursor-not-allowed bg-gray-50"
                />
                <DisabledButton icon={<CalendarIcon />} label="Date : Toutes" />
                <DisabledButton icon={<StatusIcon />} label="Statut : Tous" />
                <DisabledButton icon={<TypeIcon />} label="Type d'absence : Tous" />
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
                        {demandes.map((demande) => {
                            const nbJour = demande.periodeConge?.nb_jour ?? demande.nb_jour;
                            const nbJourLabel = nbJour ? `${nbJour} j` : "—";
                            const typeLabel =
                                demande.periodeConge?.typeConge?.libelle_typeconge ??
                                demande.type_demande ??
                                "Demande";
                            const periodLabel = formatRange(
                                demande.periodeConge?.date_debut,
                                demande.periodeConge?.date_fin
                            );
                            return (
                                <tr
                                    key={demande.id_demande}
                                    className="group cursor-pointer border-b border-gray-100 transition-colors hover:bg-gray-50"
                                    onClick={() => openDrawerWith(demande)}
                                >
                                    <td className="py-3 px-4 text-[14px] text-gray-800">{typeLabel}</td>
                                    <td className="py-3 px-4">{renderStatus(demande.statut_demande)}</td>
                                    <td className="py-3 px-4 text-[14px] text-gray-800">{periodLabel}</td>
                                    <td className="flex items-center justify-between py-3 px-4 text-[14px] text-gray-800">
                                        <span>{nbJourLabel}</span>
                                        <TooltipWrapper
                                            id={`chef-${demande.id_demande}`}
                                            content="Chef de service"
                                        >
                                            <span className="text-xs text-gray-500">
                                                {formatChef(demande)}
                                            </span>
                                        </TooltipWrapper>
                                    </td>
                                </tr>
                            );
                        })}
                        {!demandes.length && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-sm text-gray-500">
                                    Vous n’avez pas encore de demande.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <Drawer isOpen={drawerOpen} onClose={handleCloseDrawer} demande={selectedDemande ?? undefined} />
        </div>
    );
}

function DisabledButton({ icon, label }: { icon: ReactNode; label: string }) {
    return (
        <button className="flex items-center bg-[#f6f7f9] gap-2 text-sm text-gray-700 rounded border-[#ccc] px-3 py-2 cursor-not-allowed select-none">
            <span className="text-gray-500">{icon}</span>
            <span>{label}</span>
        </button>
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

function formatRange(start?: string | null, end?: string | null) {
    if (!start && !end) return "—";
    if (start && !end) return DATE_FORMATTER.format(new Date(start));
    if (!start && end) return DATE_FORMATTER.format(new Date(end));

    const startDate = new Date(start as string);
    const endDate = new Date(end as string);
    return `${DATE_FORMATTER.format(startDate)} - ${DATE_FORMATTER.format(endDate)}`;
}

function formatChef(demande: Demande) {
    const nom = demande.chef_service?.nom_personnel ?? "";
    const prenom = demande.chef_service?.prenom_personnel ?? "";
    const fullName = `${prenom} ${nom}`.trim();
    return fullName || "Chef non assigné";
}

function CalendarIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 3H6V5H5.118C3.949 5 3 5.956 3 7.134V18.866C3 20.044 3.949 21 5.118 21H18.882C20.051 21 21 20.044 21 18.866V7.134C21 5.956 20.051 5 18.882 5H18V3H16V5H8V3ZM5.118 18.866V11H18.882V18.866H5.118ZM7 16V14H9V16H7ZM11 14H13V16H11V14Z" fill="currentColor" />
        </svg>
    );
}

function StatusIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.201 17.799 1.5 12 1.5C6.201 1.5 1.5 6.201 1.5 12C1.5 17.799 6.201 22.5 12 22.5ZM17 12C17 14.761 14.761 17 12 17C9.239 17 7 14.761 7 12C7 9.239 9.239 7 12 7C14.761 7 17 9.239 17 12ZM19 12C19 15.866 15.866 19 12 19C8.134 19 5 15.866 5 12C5 8.134 8.134 5 12 5C15.866 5 19 8.134 19 12Z" fill="currentColor" />
        </svg>
    );
}

function TypeIcon() {
    return (
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path d="M18.73 10.553C17.858 9.631 16.777 9.275 15.765 9.185L18.125 8.462L18.522 7.451L19.196 8.184L20.545 7.619C20.545 7.619 19.543 4.824 16.291 5.469C15.289 5.667 14.566 6.133 14.06 6.688C13.951 5.915 13.624 5.112 12.91 4.349C10.599 1.871 8.229 3.566 8.229 3.566L9.013 4.834L9.965 4.636L9.737 5.697L11.313 7.768C10.391 7.124 9.132 6.737 7.486 7.273C4.828 8.155 3.866 10.543 3.906 11.406L5.255 11.267L5.75 10.454L6.197 11.089L7.981 10.979L8.517 9.949L8.923 10.791L11.7 10.385C10.609 11.673 9.419 13.774 9.399 16.798C9.43 16.788 9.459 16.788 9.499 16.778C9.895 16.718 10.302 16.689 10.708 16.689C11.264 16.689 11.809 16.748 12.344 16.857C12.374 16.867 12.394 16.867 12.424 16.877C12.305 15.39 12.473 12.645 13.604 10.652L16.172 13.14L16.955 12.873L16.936 13.864L18.373 15.073L19.067 14.785L18.929 15.697L20.049 16.689C20.753 15.123 21.09 13.031 18.73 10.553Z" fill="currentColor" />
                <path d="M10.698 17.243C10.312 17.243 9.935 17.273 9.568 17.332C7.238 17.689 5.344 19.116 4.58 21H16.816C16.102 19.226 14.377 17.858 12.235 17.402C11.749 17.293 11.234 17.243 10.698 17.243Z" fill="currentColor" />
            </g>
        </svg>
    );
}

