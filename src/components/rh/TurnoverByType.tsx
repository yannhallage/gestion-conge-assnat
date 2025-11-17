// import React from 'react';
import { motion } from 'framer-motion';

const TurnoverByType = () => {
    const establishments = [
        { name: "Congés annuels approuvés", percentage: 68, color: "bg-emerald-500" },
        { name: "Congés maladie en cours", percentage: 23, color: "bg-amber-400" },
        { name: "Absences exceptionnelles", percentage: 9, color: "bg-sky-400" },
        { name: "Demandes en attente", percentage: 14, color: "bg-gray-300" },
    ];

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 h-full">
            <h2 className="text-[13px] font-semibold text-gray-600 uppercase tracking-wide mb-6">
                TURNOVER PAR ÉTABLISSEMENT
            </h2>

            <div className="space-y-6">
                {establishments.map((establishment, index) => (
                    <motion.div
                        key={establishment.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-[13px] font-medium text-gray-700">
                                {establishment.name}
                            </span>
                            <span className="text-[13px] font-semibold text-gray-900">
                                {establishment.percentage} %
                            </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${establishment.percentage}%` }}
                                transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: "easeOut" }}
                                className={`h-full ${establishment.color} rounded-full`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TurnoverByType;