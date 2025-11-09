import { useEffect, useMemo, useState } from "react";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useChefService } from "../../../../hooks/chefdeservice/useChefService";

type HistoriqueStatus = "TERMINEE" | "REFUSEE" | string;

type HistoriqueDemande = {
    id_demande: string;
    statut_demande: HistoriqueStatus;
    type_demande?: string | null;
    motif?: string | null;
    date_demande?: string | null;
    nb_jour?: number | null;
    periodeConge?: {
        date_debut?: string | null;
        date_fin?: string | null;
        nb_jour?: number | null;
        typeConge?: { libelle_typeconge?: string | null } | null;
    } | null;
    service?: { nom_service?: string | null } | null;
    personnel?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
        email_travail?: string | null;
    } | null;
};

const STATUS_STYLES: Record<string, { label: string; className: string; dot: string }> = {
    TERMINEE: {
        label: "Terminée",
        className: "border-emerald-200 text-emerald-700 bg-emerald-50",
        dot: "bg-emerald-500",
    },
    REFUSEE: {
        label: "Refusée",
        className: "border-rose-200 text-rose-700 bg-rose-50",
        dot: "bg-rose-500",
    },
};

const DATE_FORMATTER = new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
});

const HistoriquesFeatureAdmin = () => (
    <div className="flex h-full flex-col bg-white">
        <header className="border-b border-gray-200 px-5 py-3">
            <h1 className="text-xl font-semibold text-gray-800">Historique du service</h1>
        </header>
        <section className="flex-1 overflow-y-auto">
            <HistoriqueDemandes />
        </section>
    </div>
);

export default HistoriquesFeatureAdmin;

function HistoriqueDemandes() {
    const { getHistoriqueDemandes, loading: serviceLoading, error: serviceError } = useChefService();
    const [demandes, setDemandes] = useState<HistoriqueDemande[]>([]);
    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<HistoriqueStatus | "ALL">("ALL");

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setFetching(true);
                setFetchError(null);
                const response = await getHistoriqueDemandes();
                if (cancelled) return;

                const mapped: HistoriqueDemande[] = Array.isArray(response)
                    ? response.filter((demande) =>
                          ["TERMINEE", "REFUSEE"].includes(
                              (demande?.statut_demande ?? "").toUpperCase()
                          )
                      )
                    : [];

                setDemandes(mapped);
            } catch (err: any) {
                if (!cancelled) {
                    setFetchError(err?.message || "Impossible de charger l'historique.");
                }
            } finally {
                if (!cancelled) {
                    setFetching(false);
                }
            }
        };

        fetchData();
        return () => {
            cancelled = true;
        };
    }, [getHistoriqueDemandes]);

    const filteredDemandes = useMemo(() => {
        const search = searchTerm.trim().toLowerCase();
        return demandes.filter((demande) => {
            const statusMatches =
                selectedStatus === "ALL" ||
                (demande.statut_demande ?? "").toUpperCase() === selectedStatus;

            if (!search) return statusMatches;

            const collaborateur = `${demande.personnel?.prenom_personnel ?? ""} ${
                demande.personnel?.nom_personnel ?? ""
            }`.toLowerCase();
            const typeLabel =
                demande.periodeConge?.typeConge?.libelle_typeconge ??
                demande.type_demande ??
                "";
            const motif = demande.motif ?? "";
            const service = demande.service?.nom_service ?? "";

            const matchesSearch =
                collaborateur.includes(search) ||
                typeLabel.toLowerCase().includes(search) ||
                motif.toLowerCase().includes(search) ||
                service.toLowerCase().includes(search);

            return statusMatches && matchesSearch;
        });
    }, [demandes, searchTerm, selectedStatus]);

    if (fetching || serviceLoading) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center text-gray-500">
                <ClipLoader size={26} color="#27a082" />
                <span className="mt-3 text-sm">Chargement de l'historique du service…</span>
            </div>
        );
    }

    if (fetchError || serviceError) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center">
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {fetchError ?? serviceError}
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-6">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">
                        Demandes clôturées ou refusées
                    </h2>
                    <p className="text-sm text-gray-500">
                        Retrouvez l&apos;ensemble des demandes historisées pour votre service.
                    </p>
                </div>
                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <input
                        type="text"
                        placeholder="Rechercher par collaborateur, type, motif…"
                        value={searchTerm}
                        onChange={(event) => setSearchTerm(event.target.value)}
                        className="w-full border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 md:w-80"
                    />
                    <div className="flex rounded-full border border-gray-200 bg-gray-50 p-1 text-xs text-gray-600">
                        {[
                            { label: "Toutes", value: "ALL" as const },
                            { label: "Terminées", value: "TERMINEE" as const },
                            { label: "Refusées", value: "REFUSEE" as const },
                        ].map((option) => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedStatus(option.value)}
                                className={`rounded-full px-4 py-1 font-medium transition ${
                                    selectedStatus === option.value
                                        ? "bg-emerald-500 text-white shadow-sm"
                                        : "text-gray-600 hover:bg-white"
                                }`}
                                type="button"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {filteredDemandes.length === 0 ? (
                <AucuneHistorique />
            ) : (
                <HistoriqueTable demandes={filteredDemandes} />
            )}
        </div>
    );
}

function HistoriqueTable({ demandes }: { demandes: HistoriqueDemande[] }) {
    return (
        <div className="overflow-hidden border border-gray-100 bg-white shadow-sm rounded-2xl">
            <table className="w-full table-fixed text-sm text-gray-700">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                        <th className="px-5 py-3 text-left">Collaborateur</th>
                        <th className="px-5 py-3 text-left">Type</th>
                        <th className="px-5 py-3 text-left">Période</th>
                        <th className="px-5 py-3 text-left">Durée</th>
                        <th className="px-5 py-3 text-left">Service</th>
                        <th className="px-5 py-3 text-left">Créée le</th>
                        <th className="px-5 py-3 text-left">Motif</th>
                        <th className="px-5 py-3 text-left">Statut</th>
                    </tr>
                </thead>
                <tbody>
                    {demandes.map((demande) => {
                        const statusKey = (demande.statut_demande ?? "").toUpperCase();
                        const statusStyle = STATUS_STYLES[statusKey] ?? STATUS_STYLES.REFUSEE;
                        const collaborateur = `${demande.personnel?.prenom_personnel ?? ""} ${
                            demande.personnel?.nom_personnel ?? ""
                        }`.trim() || "Collaborateur";
                        const typeLabel =
                            demande.periodeConge?.typeConge?.libelle_typeconge ??
                            demande.type_demande ??
                            "Demande de congé";
                        const nbJour = demande.periodeConge?.nb_jour ?? demande.nb_jour ?? null;
                        const service = demande.service?.nom_service ?? "—";
                        const createdAt =
                            demande.date_demande &&
                            !Number.isNaN(new Date(demande.date_demande).valueOf())
                                ? DATE_FORMATTER.format(new Date(demande.date_demande))
                                : "—";
                        const start = demande.periodeConge?.date_debut
                            ? format(new Date(demande.periodeConge.date_debut), "dd MMM yyyy", {
                                  locale: fr,
                              })
                            : null;
                        const end = demande.periodeConge?.date_fin
                            ? format(new Date(demande.periodeConge.date_fin), "dd MMM yyyy", {
                                  locale: fr,
                              })
                            : null;
                        const periodLabel = start && end ? `${start} → ${end}` : start || end || "—";

                        return (
                            <tr
                                key={demande.id_demande}
                                className="border-b border-gray-100 last:border-none transition-colors hover:bg-gray-50"
                            >
                                <td className="px-5 py-4 font-medium text-gray-800">{collaborateur}</td>
                                <td className="px-5 py-4 text-gray-600">{typeLabel}</td>
                                <td className="px-5 py-4 text-gray-600">{periodLabel}</td>
                                <td className="px-5 py-4 text-gray-600">
                                    {nbJour ? `${nbJour} jour${nbJour > 1 ? "s" : ""}` : "—"}
                                </td>
                                <td className="px-5 py-4 text-gray-600">{service}</td>
                                <td className="px-5 py-4 text-gray-600">{createdAt}</td>
                                <td className="px-5 py-4 text-gray-600">
                                    {demande.motif ? (
                                        <div className="max-w-xs truncate" title={demande.motif}>
                                            {demande.motif}
                                        </div>
                                    ) : (
                                        "—"
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.className}`}
                                    >
                                        <span className={`mr-2 h-2 w-2 rounded-full ${statusStyle.dot}`} />
                                        {statusStyle.label}
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

const AucuneHistorique = () => (
    <motion.div
        className="flex h-[60vh] flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center text-gray-600"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
    >
        <div className="relative">
            <div className="flex h-40 w-72 items-center justify-center">
                <img
                    src="data:image/svg+xml,%3csvg%20width='200'%20height='160'%20viewBox='0%200%20272%20214'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='M223.208%20207.9C161.078%20207.9%20147.258%20212.71%2088.1785%20213.31C29.0885%20213.91%2040.3885%20210.52%2023.5585%20200.7C6.72849%20190.88%20-14.9915%20188.81%2014.7185%20181.47C24.6185%20179.02%2056.5785%20179.48%2068.2785%20179.08C126.258%20176.95%20162.718%20179.4%20210.748%20179.08C227.948%20178.96%20303.519%20183.89%20257.139%20189.3C210.779%20194.68%20285.349%20207.9%20223.208%20207.9Z'%20fill='%23F5F7FA'/%3e%3cpath%20d='M208.269%200.0898438H62.8086V198.66H208.269V0.0898438Z'%20fill='%23E9ECEF'/%3e%3cpath%20d='M42.0112%2098.6703C38.0112%2099.5703%2034.0212%2097.0103%2033.1212%2093.0203C32.2212%2089.0303%2034.7912%2085.0403%2038.7812%2084.1403C42.7812%2083.2403%2046.7712%2085.8003%2047.6712%2089.7903C48.5412%2093.7803%2046.0012%2097.7703%2042.0112%2098.6703Z'%20fill='%23D8DDE2'/%3e%3c/svg%3e"
                    alt="Empty state"
                />
            </div>
        </div>

        <div className="mt-4">
            <h2 className="mt-6 text-lg text-gray-700">Aucune demande historique</h2>
        </div>
        <p className="mt-2 max-w-md text-sm text-gray-400">
            Aucune demande terminée ou refusée n&apos;est disponible pour le moment. Les demandes clôturées
            apparaîtront automatiquement dans cet historique.
        </p>
    </motion.div>
);
