import React from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";

interface StatsCardProps {
    label: string;
    value: string | number;
    change?: string;
    isPositive: boolean | null;
}

const StatsCard: React.FC<StatsCardProps> = ({ label, value, change, isPositive }) => {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-200"
        >
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
                {label}
            </div>
            <div className="flex items-end justify-between">
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {change && (
                    <div
                        className={`flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"
                            }`}
                    >
                        {isPositive ? (
                            <ArrowUp className="w-3 h-3 mr-1" />
                        ) : (
                            <ArrowDown className="w-3 h-3 mr-1" />
                        )}
                        {change}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default StatsCard;
