import { useEffect, useMemo, useState } from "react";
// import type { ReactNode } from "react";
import DiscussionComponent from "./DiscussionComponent";
import { useUserService } from "../hooks/employes/useUserService";
import { useAuth } from "../contexts/AuthContext";
import { ClipLoader } from "react-spinners";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface HistoriqueDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    demandeId: string | null;
}

interface DemandeDrawerData {
    id_demande: string;
    type_demande?: string | null;
    statut_demande?: string | null;
    date_demande?: string | null;
    motif?: string | null;
    personnel?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
        email_travail?: string | null;
        email_personnel?: string | null;
        telephone_travail?: string | null;
        telephone_personnel?: string | null;
    } | null;
    periodeConge?: {
        date_debut?: string | null;
        date_fin?: string | null;
        nb_jour?: number | null;
        typeConge?: {
            libelle_typeconge?: string | null;
        } | null;
    } | null;
    service?: {
        nom_service?: string | null;
    } | null;
}

const STATUS_STYLES: Record<
    string,
    { label: string; chipClass: string; textClass: string }
> = {
    TERMINEE: {
        label: "Terminée",
        chipClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        textClass: "text-emerald-600",
    },
    REFUSEE: {
        label: "Refusée",
        chipClass: "bg-rose-50 text-rose-700 border border-rose-200",
        textClass: "text-rose-600",
    },
};

// const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
//     day: "2-digit",
//     month: "2-digit",
//     year: "numeric",
// });

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export default function HistoriqueDrawer({ isOpen, onClose, demandeId }: HistoriqueDrawerProps) {
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const { getDemandeDetails, loading: serviceLoading } = useUserService(userId);
    const [demande, setDemande] = useState<DemandeDrawerData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && demandeId) {
            const fetchDemandeDetails = async () => {
                setLoading(true);
                setError(null);
                try {
                    const response = await getDemandeDetails(demandeId);
                    setDemande(response);
                } catch (err: any) {
                    setError(err?.message || "Erreur lors du chargement des détails");
                } finally {
                    setLoading(false);
                }
            };
            fetchDemandeDetails();
        } else {
            setDemande(null);
        }
    }, [isOpen, demandeId, getDemandeDetails]);

    const {
        fullName,
        initials,
        typeLabel,
        statusBadge,
        periodLabel,
        nbJourLabel,
        createdAtLabel,
        contactEmail,
        contactPhone,
        motif,
        serviceName,
    } = useMemo(() => {
        if (!demande) {
            return {
                fullName: "—",
                initials: "??",
                typeLabel: "Demande de congé",
                statusBadge: (
                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                        Statut inconnu
                    </span>
                ),
                periodLabel: "—",
                nbJourLabel: "—",
                createdAtLabel: "—",
                contactEmail: "—",
                contactPhone: "—",
                motif: null as string | null,
                serviceName: "—",
            };
        }

        const person = demande.personnel;
        const noms = [person?.prenom_personnel, person?.nom_personnel].filter(Boolean).join(" ").trim() || "Personnel";
        const initLetters =
            noms
                .split(" ")
                .filter(Boolean)
                .map((part) => part[0]?.toUpperCase())
                .join("")
                .slice(0, 2) || "??";

        const statusKey = (demande.statut_demande ?? "").toUpperCase();
        const statusStyle = STATUS_STYLES[statusKey] ?? STATUS_STYLES.TERMINEE;
        const badge = (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.chipClass}`}>
                {statusStyle.label}
            </span>
        );

        const periode = demande.periodeConge;
        const start = periode?.date_debut
            ? format(new Date(periode.date_debut), "dd MMM yyyy", { locale: fr })
            : null;
        const end = periode?.date_fin ? format(new Date(periode.date_fin), "dd MMM yyyy", { locale: fr }) : null;
        let period = "—";
        if (start && end) {
            period = `${start} → ${end}`;
        } else if (start || end) {
            period = start ?? end!;
        }

        const nbJours =
            typeof periode?.nb_jour === "number" && !Number.isNaN(periode.nb_jour)
                ? `${periode.nb_jour} jour${periode.nb_jour > 1 ? "s" : ""}`
                : "—";

        const created =
            demande.date_demande && !Number.isNaN(new Date(demande.date_demande).valueOf())
                ? DATE_TIME_FORMATTER.format(new Date(demande.date_demande))
                : "—";

        const email =
            [person?.email_travail, person?.email_personnel]
                .map((value) => (typeof value === "string" ? value.trim() : ""))
                .find((value) => value.length > 0) || "—";

        const phone =
            [person?.telephone_travail, person?.telephone_personnel]
                .map((value) => (typeof value === "string" ? value.trim() : ""))
                .find((value) => value.length > 0) || "—";

        const type =
            periode?.typeConge?.libelle_typeconge ||
            demande.type_demande ||
            "Demande de congé";

        const service = demande.service?.nom_service ?? "—";

        return {
            fullName: noms,
            initials: initLetters,
            typeLabel: type,
            statusBadge: badge,
            periodLabel: period,
            nbJourLabel: nbJours,
            createdAtLabel: created,
            contactEmail: email,
            contactPhone: phone,
            motif: demande.motif,
            serviceName: service,
        };
    }, [demande]);

    return (
        <>
            <div
                className={`fixed inset-0 z-20 bg-black/10 transition-opacity ${
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
            ></div>

            <div
                className={`fixed top-0 right-0 z-50 h-full w-full max-w-[55%] transform bg-white shadow-xl transition-transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex h-full overflow-hidden border-gray-100 shadow-lg">
                    <div className="relative flex-1 overflow-y-auto bg-white p-6">
                        <div className="absolute right-4 top-4 flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>

                        {loading || serviceLoading ? (
                            <div className="flex h-full items-center justify-center">
                                <ClipLoader size={26} color="#27a082" />
                            </div>
                        ) : error ? (
                            <div className="flex h-full items-center justify-center">
                                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                                    {error}
                                </div>
                            </div>
                        ) : (
                            <div className="flex h-full flex-col gap-6">
                                <div className="flex flex-col gap-6 border-b border-gray-100 pb-6 md:flex-row">
                                    <div className="flex w-full items-start gap-4 md:w-[45%] md:border-r md:border-gray-100 md:pr-6">
                                        <div className="relative">
                                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                                                {initials}
                                            </div>
                                        </div>
                                        <div className="space-y-2 pt-1">
                                            <div className="flex items-center gap-2">
                                                <h2 className="text-lg font-semibold text-gray-800">{fullName}</h2>
                                                {statusBadge}
                                            </div>
                                            <p className="text-sm text-gray-500">{typeLabel}</p>
                                            <dl className="mt-4 space-y-3 text-sm text-gray-600">
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-400">Période</dt>
                                                    <dd className="text-gray-700">{periodLabel}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-400">Durée</dt>
                                                    <dd className="text-gray-700">{nbJourLabel}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-400">Service</dt>
                                                    <dd className="text-gray-700">{serviceName}</dd>
                                                </div>
                                                <div className="flex justify-between">
                                                    <dt className="text-gray-400">Créée le</dt>
                                                    <dd className="text-gray-700">{createdAtLabel}</dd>
                                                </div>
                                                {motif ? (
                                                    <div>
                                                        <dt className="text-gray-400">Motif</dt>
                                                        <dd className="mt-1 text-gray-700">{motif}</dd>
                                                    </div>
                                                ) : null}
                                            </dl>
                                        </div>
                                    </div>

                                    <aside className="flex-1 space-y-4 text-sm text-gray-600">
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Contact
                                        </h3>
                                        <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">E-mail</span>
                                                <span className="font-medium text-gray-700">{contactEmail}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Téléphone</span>
                                                <span className="font-medium text-gray-700 whitespace-nowrap">
                                                    {contactPhone}
                                                </span>
                                            </div>
                                        </div>
                                    </aside>
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <div className="h-full">
                                        <DiscussionComponent 
                                            demandeId={demandeId}
                                            readOnly={true}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

