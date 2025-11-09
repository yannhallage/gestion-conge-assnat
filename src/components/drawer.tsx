import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import DiscussionComponent from "./DiscussionComponent";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    demande?: DemandeDrawerData | null;
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
}

const STATUS_STYLES: Record<
    string,
    { label: string; chipClass: string; textClass: string; icon?: string }
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
    REFUSEE: {
        label: "Refusée",
        chipClass: "bg-rose-50 text-rose-700 border border-rose-200",
        textClass: "text-rose-600",
    },
    ANNULEE: {
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
    const [activeTab, setActiveTab] = useState<"Discussion" | "Fichier" | "Chemin">("Discussion");

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            setActiveTab("Discussion");
        }
    }, [isOpen]);

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

        const nbJours =
            typeof periode?.nb_jour === "number" && !Number.isNaN(periode.nb_jour)
                ? `${periode.nb_jour} jour${periode.nb_jour > 1 ? "s" : ""}`
                : "—";

        const created =
            demande.date_demande && !Number.isNaN(new Date(demande.date_demande).valueOf())
                ? DATE_TIME_FORMATTER.format(new Date(demande.date_demande))
                : "—";

        const email = person?.email_travail || "—";
        const phone = person?.telephone_travail || person?.telephone_personnel || "—";

        const type =
            periode?.typeConge?.libelle_typeconge ||
            demande.type_demande ||
            "Demande de congé";

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
        };
    }, [demande]);

    const discussionMessages = useMemo(() => {
        if (!demande?.discussions || !demande.discussions.length) {
            return [];
        }
        return demande.discussions.map((discussion) => ({
            id_discussion: discussion.id_discussion,
            message: discussion.message,
            heure_message: discussion.heure_message ?? undefined,
            auteur: discussion.auteur ?? demande.personnel?.prenom_personnel ?? demande.personnel?.nom_personnel ?? null,
        }));
    }, [demande]);

    const ficheDisponible = Boolean(demande?.ficheDeConge?.url);

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
                    <nav className="flex w-[7%] flex-col items-center gap-6 border-r border-[#ccc] py-4">
                        <DrawerNavButton
                            label="Informations"
                            icon={
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#ccc]">
                                    <path
                                        d="M11.998 1.99902C6.47605 1.99902 1.99805 6.47602 1.99805 11.999C1.99805 17.522 6.47605 21.999 11.998 21.999C17.521 21.999 21.998 17.522 21.998 11.999C21.998 6.47602 17.521 1.99902 11.998 1.99902ZM13.248 17.35H10.748V10.574H13.248V17.35ZM13.248 9.25802H10.748V6.89002H13.248V9.25802Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            }
                            active
                        />
                        <DrawerNavButton
                            label="Discussion"
                            active={activeTab === "Discussion"}
                            onClick={() => setActiveTab("Discussion")}
                        />
                        <DrawerNavButton
                            label="Fichiers"
                            active={activeTab === "Fichier"}
                            onClick={() => setActiveTab("Fichier")}
                        />
                        <DrawerNavButton
                            label="Historique"
                            active={activeTab === "Chemin"}
                            onClick={() => setActiveTab("Chemin")}
                        />
                    </nav>

                    <div className="relative flex-1 overflow-y-auto bg-white p-6">
                        <div className="absolute right-4 top-4 flex items-center gap-3">
                            <button
                                className={`flex h-9 w-9 items-center justify-center rounded-md ${
                                    ficheDisponible ? "text-emerald-600 hover:bg-emerald-50" : "cursor-not-allowed text-gray-400"
                                }`}
                                type="button"
                                disabled={!ficheDisponible}
                            >
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
                            </button>

                            <button
                                onClick={onClose}
                                className="flex h-9 w-9 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100"
                                type="button"
                            >
                                ✕
                            </button>
                        </div>

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

                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                                            Informations supplémentaires
                                        </h4>
                                        <div className="mt-2 rounded-lg border border-dashed border-gray-200 bg-white p-4 text-xs text-gray-400">
                                            Données analytiques à venir.
                                        </div>
                                    </div>
                                </aside>
                            </div>

                            <div className="flex-1">
                                {activeTab === "Discussion" && <DiscussionComponent messages={discussionMessages} />}

                                {activeTab === "Fichier" && (
                                    <div className="rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-500">
                                        {ficheDisponible ? (
                                            <div className="space-y-3">
                                                <p className="text-gray-600">Fiche de congé disponible.</p>
                                                <a
                                                    href={demande?.ficheDeConge?.url ?? "#"}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                                                >
                                                    Télécharger la fiche
                                                </a>
                                            </div>
                                        ) : (
                                            <div className="text-sm text-gray-400">Aucun document disponible pour cette demande.</div>
                                        )}
                                        <div className="mt-4 text-xs text-gray-400">
                                            Module de gestion des pièces jointes en cours d’intégration.
                                        </div>
                                    </div>
                                )}

                                {activeTab === "Chemin" && (
                                    <div className="rounded-lg border border-gray-100 bg-white p-4 text-sm text-gray-500">
                                        <p className="text-gray-600">Historique des actions</p>
                                        <ul className="mt-3 space-y-2 text-xs text-gray-400">
                                            <li>Le suivi de statut détaillé sera disponible prochainement.</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

interface DrawerNavButtonProps {
    label: string;
    icon?: ReactNode;
    active?: boolean;
    onClick?: () => void;
}

function DrawerNavButton({ label, icon, active = false, onClick }: DrawerNavButtonProps) {
    return (
        <button
            className={`flex h-9 w-9 items-center justify-center rounded-md transition ${
                active ? "bg-emerald-600 text-white shadow-lg" : "text-gray-400 hover:bg-gray-100"
            }`}
            onClick={onClick}
            type="button"
            title={label}
        >
            {icon ?? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-inherit" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.2" />
                </svg>
            )}
        </button>
    );
}