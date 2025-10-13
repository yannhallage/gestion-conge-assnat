import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

import { Plus } from 'lucide-react';
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
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
import { useState, useEffect } from "react";
// import CustomModal from "../../../../components/assnat/user/CustomModal";

const DemanderFeature = () => {
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
                <h1 className="text-xl text-gray-800">Demander</h1>
            </header>

            <div className="h-screen overflow-y-auto">
                <CongeCalendar />
            </div>
        </div>
    );
};

export default DemanderFeature;


function CongeCalendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    // const [isModalOpen, setIsModalOpen] = useState(false);
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
                        className={`h-19 flex items-center  justify-center text-sm border border-[#ccc] cursor-pointer transition-colors
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

                <div className="mt-6">
                    <div className="text-xs mb-1 text-gray-600">0 jours / 20 jours</div>
                    <div className="w-full bg-emerald-100 h-3 border-[#ccc]">
                        <div className="bg-emerald-400 h-3 border-[#ccc] w-[0%]"></div>
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-1">2025</div>

                    <div className="mt-3 text-xs mb-1 text-gray-600">0 jours / 40 jours</div>
                    <div className="w-full bg-emerald-100 h-3 border-[#ccc]">
                        <div className="bg-emerald-400 h-3 border-[#ccc] w-[0%]"></div>
                    </div>
                    <div className="text-right text-xs text-gray-400 mt-1">2026</div>
                </div>
            </div>
            <div className="w-full md:w-64 mt-6 md:mt-0 md:ml-6 space-y-3">
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Du</label>
                    <input
                        type="date"
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                    />
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Au</label>
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
                    <label className="block text-sm  text-gray-600 mb-1">Adjoint</label>
                    <select className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200">
                        <option>Manque</option>
                        <option>Présent</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Remarque</label>
                    <textarea
                        rows={2}
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                    ></textarea>
                </div>
                <div>
                    <label className="block text-sm text-gray-600 mb-1">Pièces jointes</label>
                    <div className="bg-[#fff] text-gray-600 border py-2 cursor-pointer px-4 w-14">
                        <Plus
                            size={20}
                        />
                    </div>
                </div>
                <button className="bg-[#279c83] hover:bg-emerald-700 text-white py-2 cursor-pointer px-4 w-14"
                    onClick={() => toast.success("Enregistré avec succès !")}
                >
                    OK
                </button>

                {/* <CustomModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="Informations"
                >
                    <p>Ceci est un modal réutilisable 🎉</p>
                </CustomModal> */}
            </div>
        </motion.div>
    );
}