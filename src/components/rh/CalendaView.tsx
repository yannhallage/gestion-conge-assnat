import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSameMonth,
    isSameDay,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";

const CalendarView: React.FC = () => {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

    const handleAddEvent = () => {
        alert(
            "🚧 Cette fonctionnalité n'est pas encore implémentée — mais vous pouvez la demander dans votre prochain prompt ! 🚀"
        );
    };

    const renderHeader = () => (
        <div className="flex items-center justify-between py-4 px-2">
            <h2 className="text-2xl font-bold text-gray-800">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </h2>
            <div className="flex items-center space-x-2">
                <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
                >
                    <ChevronRight className="h-5 w-5" />
                </button>
                <button
                    onClick={handleAddEvent}
                    className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition"
                >
                    <PlusCircle className="h-4 w-4" /> Ajouter un événement
                </button>
            </div>
        </div>
    );

    const renderDays = () => {
        const days = [];
        const date = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });

        for (let i = 0; i < 7; i++) {
            days.push(
                <div
                    className="text-center text-sm font-medium text-gray-500 capitalize"
                    key={i}
                >
                    {format(addDays(date, i), "eeee", { locale: fr })}
                </div>
            );
        }
        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
        const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

        const rows: JSX.Element[] = [];
        let days: JSX.Element[] = [];
        let day = startDate;

        const dummyEvents: Record<string, { title: string; color: string }[]> = {
            "10": [{ title: "Réunion équipe", color: "bg-blue-500" }],
            "15": [{ title: "Entretien candidat", color: "bg-green-500" }],
            "25": [
                { title: "Formation sécurité", color: "bg-yellow-500" },
                { title: "Deadline rapport", color: "bg-red-500" },
            ],
        };

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, "d");
                const dayEvents =
                    dummyEvents[formattedDate] && isSameMonth(day, monthStart)
                        ? dummyEvents[formattedDate]
                        : [];

                days.push(
                    <div
                        key={day.toString()}
                        className={`relative p-2 h-36 border-t border-r border-gray-200 ${!isSameMonth(day, monthStart)
                                ? "bg-gray-50 text-gray-400"
                                : "bg-white"
                            } ${isSameDay(day, new Date()) ? "bg-blue-50" : ""}`}
                    >
                        <div
                            className={`font-semibold ${isSameDay(day, new Date()) ? "text-blue-600" : ""
                                }`}
                        >
                            {formattedDate}
                        </div>
                        <div className="mt-1 space-y-1">
                            {dayEvents.map((event, index) => (
                                <div
                                    key={index}
                                    className={`truncate text-xs text-white ${event.color} rounded px-1 py-0.5`}
                                >
                                    {event.title}
                                </div>
                            ))}
                        </div>
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

        return <div className="border-l border-b border-gray-200">{rows}</div>;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
            {renderHeader()}
            {renderDays()}
            {renderCells()}
        </motion.div>
    );
};

export default CalendarView;
