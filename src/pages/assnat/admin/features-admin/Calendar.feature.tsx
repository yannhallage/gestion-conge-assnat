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
import Drawer from "../../../../components/drawer";
import { useAuth } from "../../../../contexts/AuthContext";
import { useChefService } from "../../../../hooks/chefdeservice/useChefService";

const CalendarFeatureAdmin = () => {
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
                <h1 className="text-xl  text-gray-800">Calendrier de l&apos;équipe</h1>
            </header>
            <div className="h-screen overflow-y-auto">
                <CongeCalendar />
            </div>
        </div>
    );
};

export default CalendarFeatureAdmin;



function CongeCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const { user } = useAuth();
    const chefId = user?.id ?? null;
    const {
        getServiceDemandes,
        loading: serviceLoading,
        error: serviceError,
    } = useChefService();

    const [fetching, setFetching] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);
    const [demandes, setDemandes] = useState<any[]>([]);
    const [selectedDemande, setSelectedDemande] = useState<any | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        if (!chefId) {
            setDemandes([]);
            setFetching(false);
            setFetchError("Impossible d'identifer le chef de service.");
            return;
        }

        let cancelled = false;
        const fetchData = async () => {
            try {
                setFetching(true);
                setFetchError(null);
                const response = await getServiceDemandes(chefId);
                if (cancelled) return;
                const filtered = Array.isArray(response)
                    ? response.filter(
                          (demande) =>
                              (demande?.statut_demande ?? "").toUpperCase() === "APPROUVEE"
                      )
                    : [];
                setDemandes(filtered);
            } catch (err: any) {
                if (!cancelled) {
                    setFetchError(err?.message || "Erreur lors du chargement des demandes de l'équipe.");
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
    }, [chefId, getServiceDemandes]);

    const demandesByDate = useMemo(() => {
        const map = new Map<string, any[]>();
        for (const demande of demandes) {
            if (!demande?.periodeConge?.date_debut || !demande?.periodeConge?.date_fin) continue;
            const start = new Date(demande.periodeConge.date_debut);
            const end = new Date(demande.periodeConge.date_fin);
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

    const dayDemandes = useMemo(() => {
        const key = format(selectedDate, "yyyy-MM-dd");
        return demandesByDate.get(key) ?? [];
    }, [selectedDate, demandesByDate]);

    const openDrawer = (demande: any) => {
        setSelectedDemande(demande);
        setDrawerOpen(true);
    };

    const closeDrawer = () => {
        setDrawerOpen(false);
        setSelectedDemande(null);
    };

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
                const events = demandesByDate.get(dayKey) ?? [];
                const isStart = events.some(
                    (demande) =>
                        format(new Date(demande.periodeConge?.date_debut ?? ""), "yyyy-MM-dd") === dayKey
                );
                const isEnd = events.some(
                    (demande) =>
                        format(new Date(demande.periodeConge?.date_fin ?? ""), "yyyy-MM-dd") === dayKey
                );

                days.push(
                    <button
                        key={day.toString()}
                        onClick={() => setSelectedDate(cloneDay)}
                        className={`group relative flex h-15 items-center justify-center border border-[#ccc] text-sm transition-colors
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
                        {events.length > 0 && (
                            <span
                                className={`pointer-events-none absolute inset-y-1 bg-emerald-400/40 ${
                                    isStart ? "rounded-l-full" : ""
                                } ${isEnd ? "rounded-r-full" : ""} left-1 right-1`}
                            />
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
                {fetching || serviceLoading ? (
                    <div className="flex items-center justify-center py-12 text-gray-500">
                        <ClipLoader size={24} color="#27a082" />
                        <span className="ml-2 text-sm">Chargement des congés de l&apos;équipe...</span>
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
                    <QuotaResume demandes={demandes} />
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                    <h4 className="mb-2 text-sm font-semibold text-gray-700">
                        Congés le {format(selectedDate, "dd MMMM yyyy", { locale: fr })}
                    </h4>
                    {dayDemandes.length ? (
                        <ul className="space-y-2 text-xs text-gray-700">
                            {dayDemandes.map((demande) => (
                                <li key={`${demande.id_demande}-selected`} className="rounded border border-emerald-100 bg-white p-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium text-emerald-600">
                                            {demande.personnel?.prenom_personnel} {demande.personnel?.nom_personnel}
                                        </span>
                                        <button
                                            onClick={() => openDrawer(demande)}
                                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
                                        >
                                            Consulter
                                        </button>
                                    </div>
                                    <p className="text-gray-500">
                                        {format(new Date(demande.periodeConge?.date_debut ?? ""), "dd/MM/yyyy")} →{" "}
                                        {format(new Date(demande.periodeConge?.date_fin ?? ""), "dd/MM/yyyy")}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-xs text-gray-400">Aucun congé enregistré pour cette date.</p>
                    )}
                </div>
            </div>
            <Drawer isOpen={drawerOpen} onClose={closeDrawer} demande={selectedDemande ?? undefined} />
        </motion.div>
    );
}

function QuotaResume({ demandes }: { demandes: any[] }) {
    const QUOTA = 45;
    const totalDays = useMemo(() => {
        return demandes.reduce((acc, demande) => {
            const nb = demande.periodeConge?.nb_jour ?? demande.nb_jour;
            if (typeof nb === "number") {
                return acc + nb;
            }
            const start = new Date(demande.periodeConge?.date_debut ?? "");
            const end = new Date(demande.periodeConge?.date_fin ?? "");
            if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf())) return acc;
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
                    <span>Jours approuvés</span>
                    <span className="font-medium text-gray-700">
                        {used} / {QUOTA} jours
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                    <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${usedPercent}%` }} />
                </div>
            </div>
            <div className="space-y-1">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Quota restant</span>
                    <span className="font-medium text-gray-700">
                        {remaining} / {QUOTA} jours
                    </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-gray-500 transition-all" style={{ width: `${remainingPercent}%` }} />
                </div>
            </div>
        </div>
    );
}