import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import type { Direction } from "../../types/validation.dto";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    direction: Direction | null;
}

const STATUS_VARIANTS: Record<string, { bg: string; text: string }> = {
    ACTIF: {
        bg: "bg-emerald-100",
        text: "text-emerald-700",
    },
    INACTIF: {
        bg: "bg-rose-100",
        text: "text-rose-700",
    },
    DEFAULT: {
        bg: "bg-slate-100",
        text: "text-slate-600",
    },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
});

export default function DrawerSeeDirectionData({ isOpen, onClose, direction }: DrawerProps) {
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            setShowSkeleton(false);
            return;
        }

        setShowSkeleton(true);
        const timer = setTimeout(() => setShowSkeleton(false), 250);
        return () => clearTimeout(timer);
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return undefined;
        }

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const statusVariant = useMemo(() => {
        if (!direction?.statut) {
            return STATUS_VARIANTS.DEFAULT;
        }

        return STATUS_VARIANTS[direction.statut.toUpperCase()] ?? STATUS_VARIANTS.DEFAULT;
    }, [direction?.statut]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={handleClose}
            />

            <aside
                className={`fixed top-0 right-0 h-full w-full max-w-4xl bg-white shadow-2xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <header className="border-b border-gray-200 px-6 py-4 flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs uppercase tracking-widest text-gray-400">Direction</p>
                        <h1 className="text-lg font-semibold text-gray-800">
                            {direction?.nom_direction ?? "Aucune direction sélectionnée"}
                        </h1>
                        {direction?.code_direction ? (
                            <p className="text-sm text-gray-500">Code : {direction.code_direction}</p>
                        ) : null}
                    </div>
                    <div className="flex items-center gap-3">
                        {direction?.statut ? (
                            <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusVariant.bg} ${statusVariant.text}`}
                            >
                                {direction.statut}
                            </span>
                        ) : null}
                        <button
                            type="button"
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                            aria-label="Fermer la fenêtre"
                        >
                            ✕
                        </button>
                    </div>
                </header>

                <div className="relative h-[calc(100%-73px)] overflow-y-auto px-6 py-6">
                    {showSkeleton ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-white">
                            <ClipLoader color="#27a082" loading size={38} speedMultiplier={2.4} />
                        </div>
                    ) : null}

                    {!showSkeleton && !direction ? <EmptyState /> : null}

                    {!showSkeleton && direction ? <DirectionDetails direction={direction} /> : null}
                </div>
            </aside>
        </>
    );
}

function DirectionDetails({ direction }: { direction: Direction }) {
    const generalInfo = [
        { label: "Nom de la direction", value: direction.nom_direction },
        { label: "Nom du directeur", value: direction.nom_directeur },
        { label: "Email direction", value: direction.email_direction },
        { label: "Numéro direction", value: direction.numero_direction },
        { label: "Créée le", value: formatDate(direction.date_creation) },
    ];

    const professionalInfo = [
        { label: "Business email", value: direction.business_email },
        { label: "Business phone", value: direction.business_phone },
        { label: "Directeur email", value: direction.directeur_email },
        { label: "Directeur phone", value: direction.directeur_phone },
    ];

    const activityInfo = [
        { label: "Nombre de personnel", value: formatNumber(direction.nb_personnel) },
        { label: "Nombre de bureaux", value: direction.nombre_bureau },
        { label: "Nombre de services", value: direction.nombre_service ?? direction.services?.length },
        { label: "Statut", value: direction.statut },
    ];

    return (
        <div className="space-y-8">
            <InfoSection title="Informations générales">
                <InfoGrid items={generalInfo} />
            </InfoSection>

            <InfoSection title="Coordonnées professionnelles">
                <InfoGrid items={professionalInfo} />
            </InfoSection>

            <InfoSection title="Données d&apos;activité">
                <InfoGrid items={activityInfo} />
            </InfoSection>

            {direction.motif_creation ? (
                <InfoSection title="Motif de création">
                    <p className="text-sm leading-6 text-gray-700 whitespace-pre-line">
                        {direction.motif_creation}
                    </p>
                </InfoSection>
            ) : null}

            <InfoSection title="Services rattachés">
                <ServicesList services={direction.services} />
            </InfoSection>
        </div>
    );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-gray-500">{title}</h2>
            <div className="rounded-lg border border-gray-100 bg-white p-5 shadow-sm">{children}</div>
        </section>
    );
}

interface InfoItem {
    label: string;
    value: string | number | null | undefined;
}

function InfoGrid({ items }: { items: InfoItem[] }) {
    return (
        <dl className="grid grid-cols-1 gap-y-3 gap-x-6 sm:grid-cols-2">
            {items.map((item) => (
                <div key={item.label} className="space-y-1">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-400">
                        {item.label}
                    </dt>
                    <dd className="text-sm text-gray-800">
                        {formatValue(item.value)}
                    </dd>
                </div>
            ))}
        </dl>
    );
}

function ServicesList({ services }: { services: Direction["services"] }) {
    if (!services?.length) {
        return <p className="text-sm text-gray-500">Aucun service rattaché pour l’instant.</p>;
    }

    return (
        <ul className="space-y-3">
            {services.map((service) => (
                <li
                    key={service.id_service}
                    className="rounded-md border border-gray-100 p-4 hover:border-teal-200 transition-colors"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-gray-800">{service.nom_service}</p>
                            <p className="text-xs text-gray-500">Code : {service.code_service}</p>
                        </div>
                        <span className="text-xs text-gray-400">
                            Créé le {formatDate(service.date_creation) ?? "date inconnue"}
                        </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                        {formatNumber(service.nb_personnel)} personnel(s) rattaché(s)
                    </p>
                </li>
            ))}
        </ul>
    );
}

function EmptyState() {
    return (
        <div className="flex h-full flex-col items-center justify-center text-center text-sm text-gray-500">
            <p>Aucune direction sélectionnée pour le moment.</p>
            <p>Sélectionnez une ligne dans la liste pour consulter ses détails.</p>
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) {
        return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return DATE_FORMATTER.format(date);
}

function formatValue(value: string | number | null | undefined) {
    if (value === null || value === undefined) {
        return "Non renseigné";
    }

    if (typeof value === "number") {
        return value.toString();
    }

    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : "Non renseigné";
}

function formatNumber(value: number | string | undefined | null) {
    if (value === null || value === undefined) {
        return "Non renseigné";
    }

    const numberValue = Number(value);
    if (Number.isNaN(numberValue)) {
        return String(value);
    }

    return new Intl.NumberFormat("fr-FR").format(numberValue);
}

