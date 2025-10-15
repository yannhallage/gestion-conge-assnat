import { useState } from "react";

import { Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
// import DropDownMenu from "../../../../components/drop-down";

const DisponibilitesFeatureAdmin = () => {
    return (
        <div className="h-full flex flex-col bg-white">
            <header className="border-b border-gray-200  px-5 py-3">
                <h1 className="text-xl text-gray-800">Disponibilités</h1>
            </header>

            <div className="">
                <AbsenceTypes />
                {/* <DropDownMenu /> */}
            </div>
        </div>
    );
};

export default DisponibilitesFeatureAdmin;

function AbsenceTypes() {
    const [year] = useState(2025);
    const [person] = useState("admin orathsa");

    const absences = [
        { type: "Annual leave", color: "bg-[#2b4c7e]", days: 16, total: 20 },
        { type: "Remote work", color: "bg-[#cfd8f0]", days: "∞" },
        { type: "Sick leave", color: "bg-[#3b9d78]", days: "∞" },
    ];

    return (
        <div className=" mx-auto mt-6 text-[15px]  font-semibold p-4 text-gray-700">
            <div className="flex items-center gap-4 mb-3">
                <input
                    type="text"
                    placeholder="Nom du type"
                    className="border border-gray-200 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300"
                />
                <div className="flex items-center bg-[#f6f7f9] border-gray-200 px-3 py-1 text-sm gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    Année d'absence: <span className="font-medium">{year}</span>
                </div>
                <div className="flex items-center bg-[#f6f7f9] border-gray-200 px-3 py-1 text-sm gap-2">
                    <User size={16} className="text-gray-500" />
                    Les personnes: <span className="font-medium">{person}</span>
                </div>
            </div>

            <div className="flex font-semibold justify-between text-xs text-gray-500 uppercase border-b border-gray-200 pb-1">
                <span>Types</span>
                <span>Disponible dès le 14/10/2025</span>
            </div>

            <motion.div className="mt-3 font-semibold divide-y divide-gray-100"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                {absences.map((a, i) => (
                    <div key={i} className="flex items-center space-y-4 justify-between py-3">
                        <div className="flex items-center gap-2">
                            <div
                                className={`w-3 h-3 rounded-sm ${i === 0 ? "bg-[#2b4c7e]" : i === 1 ? "bg-[#cfd8f0]" : "bg-[#3b9d78]"
                                    }`}
                            ></div>
                            <span>{a.type}</span>
                        </div>

                        <div className="flex-1 max-w-[60%] ml-6">
                            <div className="w-full bg-gray-100  h-8 flex items-center justify-center overflow-hidden">
                                <div
                                    className={`h-8 ${a.days !== "∞" ? "bg-emerald-100" : "bg-emerald-100"}  flex items-center justify-center`}
                                    style={{
                                        width: a.days !== "∞" ? `${(a.days / (a.total || 20)) * 100}%` : "100%",
                                    }}
                                >
                                    <span className="text-[13px] text-[#2b4c7e] font-medium">
                                        {a.days}d
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </motion.div>
        </div>
    );
}