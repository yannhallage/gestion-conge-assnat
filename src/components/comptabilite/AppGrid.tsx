import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface AppItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    color: string;
    bgColor: string;
}

const apps: AppItem[] = [
    {
        id: "discussion",
        label: "Discussion",
        color: "from-orange-400 to-red-500",
        bgColor: "bg-gradient-to-br from-orange-50 to-red-50",
        icon: (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg transform rotate-12"></div>
            </div>
        ),
    },
    {
        id: "connaissances",
        label: "Connaissances",
        color: "from-teal-400 to-purple-500",
        bgColor: "bg-gradient-to-br from-teal-50 to-purple-50",
        icon: (
            <div className="w-full h-full flex items-center justify-center gap-1">
                <div className="w-6 h-10 bg-teal-400 rounded transform -rotate-12"></div>
                <div className="w-6 h-10 bg-purple-500 rounded transform rotate-12"></div>
            </div>
        ),
    },
    {
        id: "tableaux-de-bord",
        label: "Tableaux de bord",
        color: "from-blue-400 via-red-400 via-green-400 to-purple-500",
        bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
        icon: (
            <div className="w-full h-full grid grid-cols-2 gap-1 p-2">
                <div className="w-full h-full bg-blue-500 rounded"></div>
                <div className="w-full h-full bg-red-500 rounded"></div>
                <div className="w-full h-full bg-green-500 rounded"></div>
                <div className="w-full h-full bg-purple-500 rounded"></div>
            </div>
        ),
    },
    {
        id: "comptabilite",
        label: "Comptabilité",
        color: "from-purple-500 to-yellow-400",
        bgColor: "bg-gradient-to-br from-purple-50 to-yellow-50",
        icon: (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-14 h-14 bg-yellow-400 rounded-lg flex items-center justify-center">
                    <span className="text-purple-600 text-2xl font-bold">%</span>
                </div>
            </div>
        ),
    },
    {
        id: "documents",
        label: "Documents",
        color: "from-blue-400 to-orange-400",
        bgColor: "bg-gradient-to-br from-blue-50 to-orange-50",
        icon: (
            <div className="w-full h-full flex items-center justify-center gap-1">
                <div className="w-8 h-12 bg-blue-500 rounded transform rotate-6"></div>
                <div className="w-8 h-12 bg-orange-400 rounded transform -rotate-6"></div>
            </div>
        ),
    },
    {
        id: "apps",
        label: "Apps",
        color: "from-red-400 via-teal-400 via-purple-400 to-blue-500",
        bgColor: "bg-gradient-to-br from-red-50 to-blue-50",
        icon: (
            <div className="w-full h-full grid grid-cols-2 gap-1 p-2">
                <div className="w-full h-full bg-red-500 rounded"></div>
                <div className="w-full h-full bg-teal-400 rounded"></div>
                <div className="w-full h-full bg-purple-500 rounded"></div>
                <div className="w-full h-full bg-blue-500 rounded"></div>
            </div>
        ),
    },
    {
        id: "parametres",
        label: "Paramètres",
        color: "from-orange-400 to-purple-500",
        bgColor: "bg-gradient-to-br from-orange-50 to-purple-50",
        icon: (
            <div className="w-full h-full flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-purple-500 rounded-lg transform rotate-45"></div>
            </div>
        ),
    },
];

export default function AppGrid() {
    const navigate = useNavigate();

    const handleAppClick = (appId: string) => {
        // Navigation basée sur l'ID de l'application
        if (appId === "comptabilite") {
            navigate("/assnat-compta_admin/dashboard/comptabilite");
        } else if (appId === "parametres") {
            // Navigation vers les paramètres si nécessaire
            console.log("Paramètres");
        }
        // Ajouter d'autres navigations selon les besoins
    };

    return (
        <div className="p-11 pt-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-5 max-w-6xl mx-auto">
                {apps.map((app, index) => (
                    <motion.div
                        key={app.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAppClick(app.id)}
                        className="cursor-pointer group"
                    >
                        <div className={`${app.bgColor} rounded-md p-5 border border-gray-200`}>
                            <div className="w-16 h-16 mx-auto mb-3">
                                {app.icon}
                            </div>
                            <h3 className="text-center text-xs font-semibold text-gray-700 group-hover:text-[#27a082] transition-colors">
                                {app.label}
                            </h3>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

