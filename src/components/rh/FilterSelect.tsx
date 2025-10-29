import React from "react";
import { ChevronDown } from "lucide-react";

interface FilterSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: string[];
    label?: string;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
    value,
    onChange,
    options,
    label = "Choisir une option",
}) => {
    return (
        <div className="relative inline-block w-full">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-200 hover:border-gray-300 transition-colors rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400"
            >
                <option value="">{label}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>

            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
        </div>
    );
};

export default FilterSelect;
