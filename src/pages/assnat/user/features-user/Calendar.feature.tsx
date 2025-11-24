import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    addMonths,
    subMonths,
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUserService } from "../../../../hooks/employes/useUserService";

type DemandeCalendar = {
    id_demande: string;
    type: string;
    start: string;
    end: string;
    nbJour?: number | null;
};

const CalendarFeature = () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader
                    color="#27a082"
                    loading={loading}
                    size={29}
                    speedMultiplier={3}
                    aria-label="Chargement..."
                    data-testid="loader"
                />
            </div>
        );
    }
    return (
        <div className="h-full flex flex-col bg-white">
            <header className="border-b border-gray-200  px-5 py-3">
                <h1 className="text-xl  text-gray-800">Calendrier des congés validés</h1>
            </header>
            <div className="h-screen overflow-y-auto">
                <CongeCalendar />
            </div>
        </div>
    );
};

export default CalendarFeature;



function CongeCalendar() {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const { getMyDemandes, error: serviceError } = useUserService(userId);

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [fetching, setFetching] = useState(true);
    const [demandes, setDemandes] = useState<DemandeCalendar[]>([]);
    const [fetchError, setFetchError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        const fetchData = async () => {
            if (!userId) {
                setDemandes([]);
                setFetching(false);
                setFetchError("Impossible d'identifier l'utilisateur.");
                return;
            }
            try {
                setFetching(true);
                setFetchError(null);
                const response = await getMyDemandes();
                if (cancelled) return;

                const mapped: DemandeCalendar[] = Array.isArray(response)
                    ? response
                        .filter((demande) => demande.statut_demande === "APPROUVEE")
                        .map((demande) => ({
                            id_demande: demande.id_demande,
                            type:
                                demande.periodeConge?.typeConge?.libelle_typeconge ??
                                demande.type_demande ??
                                "Demande",
                            start: demande.periodeConge?.date_debut ?? demande.date_debut ?? "",
                            end: demande.periodeConge?.date_fin ?? demande.date_fin ?? "",
                            nbJour: demande.periodeConge?.nb_jour ?? demande.nb_jour,
                        }))
                        .filter((item) => item.start && item.end)
                    : [];

                setDemandes(mapped);
            } catch (err: any) {
                if (!cancelled) {
                    setFetchError(err?.message || "Erreur lors du chargement des demandes approuvées.");
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
    }, [getMyDemandes, userId]);

    const demandesByDate = useMemo(() => {
        const map = new Map<string, DemandeCalendar[]>();
        for (const demande of demandes) {
            try {
                const start = new Date(demande.start);
                const end = new Date(demande.end);
                if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
                    continue;
                }
                let cursor = new Date(start);
                while (cursor <= end) {
                    const key = format(cursor, "yyyy-MM-dd");
                    const list = map.get(key) ?? [];
                    list.push(demande);
                    map.set(key, list);
                    cursor = addDays(cursor, 1);
                }
            } catch {
                /* ignore invalid date */
            }
        }
        return map;
    }, [demandes]);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const renderHeader = () => (
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-emerald-600 text-2xl ">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </h2>
            <div className="flex items-center space-x-2 text-gray-500">
                <ChevronLeft
                    className="cursor-pointer hover:text-emerald-500"
                    onClick={prevMonth}
                />
                <ChevronRight
                    className="cursor-pointer hover:text-emerald-500"
                    onClick={nextMonth}
                />
                <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="text-gray-400 text-sm hover:text-emerald-500"
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
                    className="text-center text-gray-500 font-medium py-1 border-b border-gray-200 text-sm"
                >
                    {format(addDays(start, i), "EEE", { locale: fr })
                        .replace(".", "")
                        .replace(/^\w/, (c) => c.toLowerCase())}
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
                const dayDemandes = demandesByDate.get(dayKey) ?? [];
                const isFirst = dayDemandes.some((demande) => format(new Date(demande.start), "yyyy-MM-dd") === dayKey);
                const isLast = dayDemandes.some((demande) => format(new Date(demande.end), "yyyy-MM-dd") === dayKey);

                days.push(
                    <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(cloneDay)}
                        className={`group relative flex h-19 items-center justify-center border border-[#ccc] text-sm transition-colors
                            ${isSelected
                                ? "bg-[#27a082] text-white font-semibold"
                                : isOtherMonth
                                    ? "bg-gray-50 text-gray-300"
                                    : isSunday
                                        ? "text-red-600 font-semibold"
                                        : isWeekend
                                            ? "text-red-400"
                                            : "text-gray-700 hover:bg-emerald-50"
                            }`}
                    >
                        {format(day, "d")}
                        {dayDemandes.length > 0 && (
                            <span
                                className={`pointer-events-none absolute inset-y-2 bg-emerald-400/40 ${
                                    isFirst ? "rounded-l-full" : ""
                                } ${isLast ? "rounded-r-full" : ""} ${dayDemandes.length > 0 ? "left-1 right-1" : ""}`}
                            />
                        )}
                        {dayDemandes.length > 0 && (
                            <div className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 hidden w-56 -translate-x-1/2 rounded-lg border border-emerald-200 bg-white p-3 text-xs text-gray-700 shadow-lg group-hover:block">
                                <ul className="space-y-1">
                                    {dayDemandes.map((item) => (
                                        <li key={`${item.id_demande}-${dayKey}`} className="grid gap-1">
                                            <span className="font-medium text-emerald-600">{item.type}</span>
                                            <span>
                                                {format(new Date(item.start), "dd/MM/yyyy")} →{" "}
                                                {format(new Date(item.end), "dd/MM/yyyy")}
                                            </span>
                                            {typeof item.nbJour === "number" && (
                                                <span>{item.nbJour} jour{item.nbJour > 1 ? "s" : ""}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </button>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="border border-gray-200">{rows}</div>;
    };
    return (
        <motion.div className="flex flex-col md:flex-row bg-white  p-6 text-sm"
        // initial={{ opacity: 0, x: -12 }}
        // animate={{ opacity: 1, x: 0 }}
        // transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <div className="flex-1">
                {renderHeader()}
                {serviceError && (
                    <p className="mb-3 text-sm text-red-500">
                        {serviceError}
                    </p>
                )}
                {fetchError && (
                    <p className="mb-3 text-sm text-red-500">
                        {fetchError}
                    </p>
                )}
                {fetching ? (
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
            <div className="w-full md:w-64 mt-6 md:mt-0 md:ml-6 space-y-3">
                <div className="">
                    <h3 className="block text-2xl text-emerald-600 text-2xl  mb-1">Rechercher</h3>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Aller à la date du</label>
                    <input
                        type="date"
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                        onChange={(event) => {
                            const value = event.target.value;
                            if (!value) return;
                            const parsed = new Date(value);
                            if (!Number.isNaN(parsed.valueOf())) {
                                setCurrentMonth(parsed);
                                setSelectedDate(parsed);
                            }
                        }}
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Type de congé</label>
                    <select className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200">
                        <option>Annual leave</option>
                        <option>Maladie</option>
                        <option>Sans solde</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm  text-gray-600 mb-1">Catégorie d’absence</label>
                    <select className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200">
                        <option>Manque</option>
                        <option>Présent</option>
                    </select>
                </div>
                <div className="pt-4">
                    <QuotaProgress demandes={demandes} />
                </div>
            </div>
        </motion.div>
    );
}

function QuotaProgress({ demandes }: { demandes: DemandeCalendar[] }) {
    const QUOTA = 45;
    const totalDays = useMemo(() => {
        return demandes.reduce((acc, demande) => {
            if (typeof demande.nbJour === "number") {
                return acc + demande.nbJour;
            }
            const start = new Date(demande.start);
            const end = new Date(demande.end);
            if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) {
                return acc;
            }
            const difference = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
            return acc + Math.max(difference, 0);
        }, 0);
    }, [demandes]);

    const used = Math.min(totalDays, QUOTA);
    const remaining = Math.max(QUOTA - totalDays, 0);
    const usedPercent = Math.min(Math.round((used / QUOTA) * 100), 100);
    const remainingPercent = Math.min(Math.round((remaining / QUOTA) * 100), 100);

    return (
        <div className="space-y-4">
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Jours demandés</span>
                    <span className="font-medium text-gray-700">
                        {used} / {QUOTA} jours
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div
                        className="h-full rounded-full bg-emerald-500 transition-all"
                        style={{ width: `${usedPercent}%` }}
                    />
                </div>
            </div>

            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Jours restants</span>
                    <span className="font-medium text-gray-700">
                        {remaining} / {QUOTA} jours
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div
                        className="h-full rounded-full bg-gray-500 transition-all"
                        style={{ width: `${remainingPercent}%` }}
                    />
                </div>
            </div>
        </div>
    );
}