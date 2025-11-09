import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Drawer from "../../../../components/drawer";
import { useRhService } from "../../../../hooks/rh/useRhService";

type TeamLeave = {
    id_demande: string;
    type: string;
    start: string;
    end: string;
    nbJour?: number | null;
    personnel?: {
        nom_personnel?: string | null;
        prenom_personnel?: string | null;
    } | null;
    raw?: any;
};

const CalendarFeatureRH = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <ClipLoader color="#27a082" loading size={29} speedMultiplier={3} aria-label="Chargement..." />
            </div>
        );
    }

    return (
        <div className="flex h-full flex-col bg-white">
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">Calendrier des congés validés</h1>
                    <p className="text-sm text-gray-500">Vue globale des absences validées dans l&apos;organisation.</p>
                </div>
            </header>
            <div className="h-screen overflow-y-auto">
                <CongeCalendar />
            </div>
        </div>
    );
};

export default CalendarFeatureRH;

function CongeCalendar() {
    const { getDemandes, loading: serviceLoading, error: serviceError } = useRhService();

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDemande, setSelectedDemande] = useState<any | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [demandes, setDemandes] = useState<TeamLeave[]>([]);

    useEffect(() => {
        let cancelled = false;

        const fetchData = async () => {
            try {
                setFetching(true);
                setFetchError(null);
                const response = await getDemandes();
                if (cancelled) return;

                const parsed: TeamLeave[] = Array.isArray(response)
                    ? response
                        .filter((demande: any) => demande.statut_demande === "APPROUVEE")
                        .map((demande: any) => ({
                            id_demande: demande.id_demande,
                            type:
                                demande.periodeConge?.typeConge?.libelle_typeconge ??
                                demande.type_demande ??
                                "Congé",
                            start: demande.periodeConge?.date_debut ?? demande.date_debut ?? "",
                            end: demande.periodeConge?.date_fin ?? demande.date_fin ?? "",
                            nbJour: demande.periodeConge?.nb_jour ?? demande.nb_jour,
                            personnel: demande.personnel,
                            raw: demande,
                        }))
                        .filter((item: TeamLeave) => item.start && item.end)
                    : [];
                setDemandes(parsed);
            } catch (err: any) {
                if (!cancelled) {
                    setFetchError(err?.message || "Erreur lors du chargement des demandes validées.");
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
    }, [getDemandes]);

    const bandesParDate = useMemo(() => {
        const map = new Map<string, TeamLeave[]>();
        for (const demande of demandes) {
            const start = new Date(demande.start);
            const end = new Date(demande.end);
            if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) continue;
            let cursor = new Date(start);
            while (cursor <= end) {
                const key = format(cursor, "yyyy-MM-dd");
                const list = map.get(key) ?? [];
                list.push(demande);
                map.set(key, list);
                cursor = addDays(cursor, 1);
            }
        }
        return map;
    }, [demandes]);

    const eventsForSelectedDay = useMemo(() => {
        const key = format(selectedDate, "yyyy-MM-dd");
        return bandesParDate.get(key) ?? [];
    }, [selectedDate, bandesParDate]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const openDrawer = (demande: any) => {
        setSelectedDemande(demande?.raw ?? null);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedDemande(null);
    };

    const renderHeader = () => (
        <div className="flex items-center justify-between rounded-2xl bg-emerald-50 px-4 py-3 shadow-sm">
            <div>
                <p className="text-xs font-medium uppercase tracking-wide text-emerald-500">Vue mensuelle</p>
                <h2 className="text-emerald-700 text-xl font-semibold">
                    {format(currentMonth, "MMMM yyyy", { locale: fr })}
                </h2>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={prevMonth}
                    className="rounded-full border border-emerald-200 bg-white p-2 text-emerald-500 transition hover:bg-emerald-100"
                >
                    <ChevronLeft size={18} />
                </button>
                <button
                    onClick={nextMonth}
                    className="rounded-full border border-emerald-200 bg-white p-2 text-emerald-500 transition hover:bg-emerald-100"
                >
                    <ChevronRight size={18} />
                </button>
                <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600"
                >
                    Aujourd’hui
                </button>
            </div>
        </div>
    );

    const renderDays = () => {
        const start = startOfWeek(currentMonth, { locale: fr });
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(
                <div
                    key={i}
                    className="flex h-10 items-center justify-center text-xs font-semibold uppercase tracking-wide text-emerald-600"
                >
                    {format(addDays(start, i), "EEE", { locale: fr })
                        .replace(".", "")
                        .replace(/^\w/, (c) => c.toUpperCase())}
                </div>
            );
        }
        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { locale: fr });
        const endDate = endOfWeek(monthEnd, { locale: fr });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isWeekend = [6, 0].includes(day.getDay());
                const isSunday = day.getDay() === 0;
                const isOtherMonth = !isSameMonth(day, monthStart);
                const isSelected = selectedDate && isSameDay(day, selectedDate);
                const dayKey = format(day, "yyyy-MM-dd");
                const events = bandesParDate.get(dayKey) ?? [];
                const isStart = events.some(
                    (demande) => format(new Date(demande.start), "yyyy-MM-dd") === dayKey
                );
                const isEnd = events.some(
                    (demande) => format(new Date(demande.end), "yyyy-MM-dd") === dayKey
                );

                days.push(
                    <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(cloneDay)}
                        className={`group relative flex h-24 flex-col items-center justify-start rounded-2xl border border-transparent px-3 py-2 text-left transition
                            ${isSelected
                                ? "bg-[#0f5132] text-white shadow-lg ring-2 ring-emerald-400"
                                : isOtherMonth
                                    ? "bg-gray-50 text-gray-300"
                                    : isSunday
                                        ? "bg-emerald-50 text-emerald-600"
                                        : isWeekend
                                            ? "bg-emerald-50 text-emerald-500"
                                            : "bg-white text-gray-700 hover:border-emerald-200 hover:bg-emerald-50"
                            }`}
                    >
                        <div className="flex w-full items-center justify-between">
                            <span className="text-sm font-semibold">{format(day, "d")}</span>
                            {events.length > 0 && (
                                <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                                    {events.length}
                                </span>
                            )}
                        </div>
                        {events.length > 0 && (
                            <span
                                className={`pointer-events-none absolute inset-x-2 top-8 h-7 bg-gradient-to-r from-emerald-500/70 to-emerald-400/70 ${isStart ? "rounded-l-full" : ""
                                    } ${isEnd ? "rounded-r-full" : ""}`}
                            />
                        )}
                        <div className="pointer-events-none absolute left-1/2 top-full z-20 hidden w-60 -translate-x-1/2 rounded-xl border border-emerald-200 bg-white/95 p-3 text-xs text-gray-700 shadow-xl backdrop-blur group-hover:block">
                            {events.length ? (
                                <ul className="space-y-2">
                                    {events.map((event) => (
                                        <li key={`${event.id_demande}-${dayKey}`} className="grid gap-1">
                                            <span className="font-semibold text-emerald-600">
                                                {event.personnel?.prenom_personnel} {event.personnel?.nom_personnel}
                                            </span>
                                            <span className="text-gray-500">
                                                {event.type} • {format(new Date(event.start), "dd/MM")} →{" "}
                                                {format(new Date(event.end), "dd/MM")}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-center text-[11px] text-gray-400">
                                    Aucun congé pour cette date.
                                </p>
                            )}
                        </div>
                    </button>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7 gap-3" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="space-y-3">{rows}</div>;
    };

    const totalDays = useMemo(() => {
        return demandes.reduce((acc, demande) => {
            if (typeof demande.nbJour === "number") {
                return acc + demande.nbJour;
            }
            const start = new Date(demande.start);
            const end = new Date(demande.end);
            if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return acc;
            const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            return acc + Math.max(diff, 0);
        }, 0);
    }, [demandes]);

    const eventsForSelected = eventsForSelectedDay.slice(0, 4);

    return (
        <motion.div className="flex flex-col gap-6 bg-gray-50 px-6 py-6 text-sm md:flex-row">
            <div className="flex-1 rounded-3xl bg-white p-6 shadow-sm">
                <div className="space-y-4">
                    {renderHeader()}
                    {serviceError && <p className="text-sm text-red-500">{serviceError}</p>}
                    {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}
                    {fetching || serviceLoading ? (
                        <div className="flex items-center justify-center py-12 text-gray-500">
                            <ClipLoader size={24} color="#27a082" />
                            <span className="ml-2 text-sm">Chargement des congés validés...</span>
                        </div>
                    ) : (
                        <>
                            {renderDays()}
                            {renderCells()}
                        </>
                    )}
                </div>
            </div>

            <aside className="w-full space-y-4 rounded-3xl bg-white p-6 shadow-sm md:w-80">
                <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {format(selectedDate, "EEEE d MMMM yyyy", { locale: fr })}
                    </h3>
                    <p className="text-xs text-gray-500">
                        {eventsForSelectedDay.length} congé(s) approuvé(s) ce jour-là.
                    </p>
                </div>

                <div className="space-y-3">
                    {eventsForSelected.length ? (
                        eventsForSelected.map((event) => (
                            <div
                                key={`${event.id_demande}-side`}
                                className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
                            >
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-emerald-700">
                                            {event.personnel?.prenom_personnel} {event.personnel?.nom_personnel}
                                        </p>
                                        <p className="text-xs text-emerald-500">
                                            {event.type}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => openDrawer(event)}
                                        className="rounded-full border border-emerald-300 px-3 py-1 text-[11px] font-semibold text-emerald-600 hover:bg-emerald-100"
                                    >
                                        Consulter
                                    </button>
                                </div>
                                <div className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-gray-600">
                                    {format(new Date(event.start), "dd/MM/yyyy")} →{" "}
                                    {format(new Date(event.end), "dd/MM/yyyy")}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/30 p-6 text-center text-xs text-emerald-500">
                            Aucune absence validée pour cette journée.
                        </div>
                    )}
                    {eventsForSelectedDay.length > eventsForSelected.length && (
                        <p className="text-center text-[11px] text-gray-400">
                            {eventsForSelectedDay.length - eventsForSelected.length} congé(s) supplémentaire(s) non affiché(s).
                        </p>
                    )}
                </div>

                <div className="space-y-2 rounded-2xl border border-gray-100 bg-gray-50 p-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Volume total approuvé
                    </h4>
                    <p className="text-2xl font-semibold text-emerald-600">{totalDays} jours</p>
                    <p className="text-xs text-gray-500">
                        Nombre de jours validés tous services confondus.
                    </p>
                </div>
            </aside>

            <Drawer isOpen={drawerOpen} onClose={closeDrawer} demande={selectedDemande ?? undefined} />
        </motion.div>
    );
}