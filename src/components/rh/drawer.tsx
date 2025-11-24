import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { buildDemandePdf, type DemandePdfData } from "../../utils/pdf/buildDemandePdf";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    demande?: DemandeDrawerData | null;
}

interface DemandeDrawerData {
    id_demande: string;
    statut_demande?: string | null;
    type_demande?: string | null;
    date_demande?: string | null;
    motif?: string | null;
    nb_jour?: number | null;
    personnel?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
        email_travail?: string | null;
        email_personnel?: string | null;
        telephone_travail?: string | null;
        telephone_personnel?: string | null;
        service?: {
            nom_service?: string | null;
        } | null;
    } | null;
    periodeConge?: {
        date_debut?: string | null;
        date_fin?: string | null;
        nb_jour?: number | null;
        typeConge?: {
            libelle_typeconge?: string | null;
        } | null;
    } | null;
    chef_service?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
    } | null;
}

export type { DemandeDrawerData as RhDemandeDrawerData };

const STATUS_STYLES: Record<
    string,
    { label: string; chipClass: string; textClass: string; icon?: ReactNode }
> = {
    EN_ATTENTE: {
        label: "En attente",
        chipClass: "bg-amber-50 text-amber-700 border border-amber-200",
        textClass: "text-amber-600",
    },
    EN_COURS: {
        label: "En cours",
        chipClass: "bg-sky-50 text-sky-700 border border-sky-200",
        textClass: "text-sky-600",
    },
    APPROUVEE: {
        label: "Approuvée",
        chipClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        textClass: "text-emerald-600",
    },
    APPROUVÉE: {
        label: "Approuvée",
        chipClass: "bg-emerald-50 text-emerald-700 border border-emerald-200",
        textClass: "text-emerald-600",
    },
    REFUSEE: {
        label: "Refusée",
        chipClass: "bg-rose-50 text-rose-700 border border-rose-200",
        textClass: "text-rose-600",
    },
    REFUSÉE: {
        label: "Refusée",
        chipClass: "bg-rose-50 text-rose-700 border border-rose-200",
        textClass: "text-rose-600",
    },
    ANNULEE: {
        label: "Annulée",
        chipClass: "bg-gray-100 text-gray-600 border border-gray-200",
        textClass: "text-gray-500",
    },
    ANNULÉE: {
        label: "Annulée",
        chipClass: "bg-gray-100 text-gray-600 border border-gray-200",
        textClass: "text-gray-500",
    },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
});

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
});

export default function Drawer({ isOpen, onClose, demande }: DrawerProps) {
    const [activeTab, setActiveTab] = useState<"Discussion" | "Fichier" | "Chemin">("Fichier");
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setActiveTab("Fichier");
        }
    }, [isOpen]);

    const summary = useMemo(() => {
        if (!demande) {
            return {
                reference: "—",
                fullName: "—",
                initials: "??",
                typeLabel: "Demande de congé",
                statusBadge: (
                    <span className="rounded-full border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-500">
                        Statut inconnu
                    </span>
                ),
                statusLabel: "Statut inconnu",
                periodLabel: "—",
                nbJourLabel: "—",
                createdAtLabel: "—",
                contactEmail: "—",
                contactPhone: "—",
                serviceLabel: null as string | null,
                motif: null as string | null,
                chefLabel: null as string | null,
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
        const statusStyle = STATUS_STYLES[statusKey] ?? STATUS_STYLES.EN_ATTENTE;
        const badge = (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyle.chipClass}`}>
                {statusStyle.label}
            </span>
        );

        const periode = demande.periodeConge;
        const start = periode?.date_debut ? DATE_FORMATTER.format(new Date(periode.date_debut)) : null;
        const end = periode?.date_fin ? DATE_FORMATTER.format(new Date(periode.date_fin)) : null;

        let period = "—";
        if (start && end) {
            period = `${start} - ${end}`;
        } else if (start || end) {
            period = start ?? end!;
        }

        const nbJoursValue =
            typeof periode?.nb_jour === "number" && !Number.isNaN(periode.nb_jour)
                ? periode.nb_jour
                : typeof demande.nb_jour === "number" && !Number.isNaN(demande.nb_jour)
                ? demande.nb_jour
                : null;
        const nbJours = nbJoursValue !== null ? `${nbJoursValue} jour${nbJoursValue > 1 ? "s" : ""}` : "—";

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

        const serviceLabel = person?.service?.nom_service ?? null;
        const chefLabel = [demande.chef_service?.prenom_personnel, demande.chef_service?.nom_personnel]
            .filter(Boolean)
            .join(" ")
            .trim();

        return {
            reference: demande.id_demande,
            fullName: noms,
            initials: initLetters,
            typeLabel: type,
            statusBadge: badge,
            statusLabel: statusStyle.label,
            periodLabel: period,
            nbJourLabel: nbJours,
            createdAtLabel: created,
            contactEmail: email,
            contactPhone: phone,
            serviceLabel: serviceLabel?.trim() || null,
            motif: demande.motif,
            chefLabel: chefLabel.length > 0 ? chefLabel : null,
        };
    }, [demande]);

    useEffect(() => {
        if (!demande) {
            setPdfUrl(null);
            return;
        }

        const data: DemandePdfData = {
            reference: summary.reference,
            typeDemande: summary.typeLabel,
            statut: summary.statusLabel,
            periode: {
                debut: demande.periodeConge?.date_debut
                    ? DATE_FORMATTER.format(new Date(demande.periodeConge.date_debut))
                    : null,
                fin: demande.periodeConge?.date_fin
                    ? DATE_FORMATTER.format(new Date(demande.periodeConge.date_fin))
                    : null,
            },
            nbJours: summary.nbJourLabel,
            createdAt: demande.date_demande
                ? DATE_TIME_FORMATTER.format(new Date(demande.date_demande))
                : null,
            demandeur: {
                nom: demande.personnel?.nom_personnel ?? "—",
                prenom: demande.personnel?.prenom_personnel ?? "",
                email:
                    summary.contactEmail !== "—" ? summary.contactEmail : null,
                telephone:
                    summary.contactPhone !== "—" ? summary.contactPhone : null,
                service: summary.serviceLabel,
            },
            motif: demande.motif,
            chef: demande.chef_service
                ? {
                      nom: demande.chef_service.nom_personnel ?? null,
                      prenom: demande.chef_service.prenom_personnel ?? null,
                  }
                : null,
        };

        const blob = buildDemandePdf(data);
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [demande, summary]);

    return (
        <>
            <div
                className={`fixed inset-0 z-20 bg-black/10 transition-opacity ${
                    isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
                }`}
                onClick={onClose}
            ></div>

            <div
                className={`fixed top-0 right-0 z-50 h-full w-[80%] transform bg-white shadow-xl transition-transform ${
                    isOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex h-full overflow-hidden border-l border-gray-100 shadow-lg">
                    <div className="flex w-[7%] flex-col items-center gap-6 border-r border-gray-100 py-4">
                        {(["Discussion", "Fichier", "Chemin"] as const).map((tab) => (
                            <button
                                key={tab}
                                className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                                    activeTab === tab
                                        ? "bg-emerald-50 text-emerald-600"
                                        : "text-gray-400 hover:bg-gray-100"
                                }`}
                                onClick={() => setActiveTab(tab)}
                                type="button"
                            >
                                <span className="sr-only">{tab}</span>
                                {tab === "Discussion" && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M21.17 1.99707H2.82402C2.36802 1.99707 1.99902 2.36196 1.99902 3.08274V18.2972C1.99902 18.4761 2.36802 18.841 2.82402 18.841H8.80002L11.998 21.9971L15.194 18.841H21.17C21.627 18.841 21.996 18.4761 21.996 18.2972V3.08274C21.996 2.36196 21.627 1.99707 21.17 1.99707ZM14.004 14.1884H7.33102V11.7431H14.004V14.1884ZM17.273 9.05995H7.33102V6.61568H17.273V9.05995Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                                {tab === "Fichier" && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M16.8525 3H3V21H21V7.167L16.8525 3ZM12.018 18.4545L7.7775 14.214H10.215V8.7855H13.7145V14.214H16.2585L12.018 18.4545ZM15.6435 8.214V4.203L19.6305 8.214H15.6435Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                                {tab === "Chemin" && (
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M5.7 5.7L5.7 18.3H19.2V21L5.7 21H3L3 18.3V5.7V3H5.7H19.2V5.7H5.7ZM16.5 10.65H10.2V13.35H16.5V10.65ZM21 12L16.5 7.95001V16.05L21 12Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="relative flex-1 overflow-y-auto bg-white p-6">
                        <div className="absolute right-4 top-4 flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M16.85 3H3v18h18V7.167L16.85 3z"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12.018 18.4545 7.7775 14.214H10.215V8.7855H13.7145V14.214H16.2585L12.018 18.4545Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex h-full gap-6">
                            <aside className="w-[40%] border-r border-gray-100 pr-6">
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
                                            {summary.initials}
                                        </div>
                                        {demande?.statut_demande ? (
                                            <div className="absolute -top-2 right-0 rounded bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                                                {summary.statusLabel}
                                            </div>
                                        ) : null}
                                    </div>
                                    <div className="space-y-2 pt-1">
                                        <div className="flex items-center gap-2">
                                            <h2 className="text-lg font-semibold text-gray-800">{summary.fullName}</h2>
                                            {summary.statusBadge}
                                        </div>
                                        <p className="text-sm text-gray-500">{summary.typeLabel}</p>
                                        {summary.serviceLabel && (
                                            <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
                                                {summary.serviceLabel}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <dl className="mt-8 space-y-4 text-sm text-gray-600">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400 uppercase tracking-wide">Référence</dt>
                                        <dd className="text-gray-800">{summary.reference}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400 uppercase tracking-wide">Période</dt>
                                        <dd className="text-gray-800">{summary.periodLabel}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400 uppercase tracking-wide">Demandé</dt>
                                        <dd className="text-gray-800">{summary.nbJourLabel}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-400 uppercase tracking-wide">Créée le</dt>
                                        <dd className="text-gray-800">{summary.createdAtLabel}</dd>
                                    </div>
                                </dl>

                                <div className="mt-8 space-y-4 text-sm text-gray-600">
                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Contact
                                        </h3>
                                        <div className="mt-2 space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">E-mail</span>
                                                <span className="font-medium text-gray-700">{summary.contactEmail}</span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-400">Téléphone</span>
                                                <span className="font-medium text-gray-700 whitespace-nowrap">
                                                    {summary.contactPhone}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Chef de service
                                        </h3>
                                        <div className="mt-2 rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-600">
                                            {summary.chefLabel ?? "Non renseigné"}
                                        </div>
                                    </div>

                                    {summary.motif ? (
                                        <div>
                                            <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                                Motif
                                            </h3>
                                            <div className="mt-2 rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-600">
                                                {summary.motif}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>
                            </aside>

                            <section className="flex-1 space-y-4">
                                {activeTab === "Fichier" && (
                                    <div className="flex h-full flex-col gap-4">
                                        <div className="rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-600">
                                            <h3 className="text-sm font-semibold text-gray-800">Fiche PDF générée</h3>
                                            <p className="mt-1 text-xs text-gray-400">
                                                Le document ci-dessous est généré automatiquement à partir des données de la demande.
                                            </p>
                                        </div>
                                        <div className="flex-1 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                                            <GeneratedPdfViewer pdfUrl={pdfUrl} />
                                        </div>
                                    </div>
                                )}
                                {activeTab === "Discussion" && (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
                                        Module de discussion en cours d’intégration.
                                    </div>
                                )}
                                {activeTab === "Chemin" && (
                                    <div className="rounded-lg border border-dashed border-gray-200 bg-white p-6 text-sm text-gray-500">
                                        L’historique détaillé sera disponible prochainement.
                                    </div>
                                )}
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function GeneratedPdfViewer({ pdfUrl }: { pdfUrl: string | null }) {
    if (!pdfUrl) {
        return (
            <div className="flex h-full items-center justify-center text-sm text-gray-400">
                Sélectionnez une demande pour générer le PDF.
            </div>
        );
    }

    return (
        <iframe
            title="Fiche de demande"
            src={pdfUrl}
            className="h-full w-full"
        />
    );
}