import { useState, useEffect } from "react";
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

const CalendarFeatureRH = () => {
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
                <h1 className="text-xl  text-gray-800">Calendar</h1>
            </header>
            <div className="h-screen overflow-y-auto">
                <CongeCalendar />
            </div>
        </div>
    );
};

export default CalendarFeatureRH;



function CongeCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());

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

                days.push(
                    <div
                        key={day.toString()}
                        onClick={() => setSelectedDate(cloneDay)}
                        className={`h-15 flex items-center  justify-center text-sm border border-[#ccc] cursor-pointer transition-colors
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
                    </div>
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
                {renderDays()}
                {renderCells()}
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
            </div>
        </motion.div>
    );
}