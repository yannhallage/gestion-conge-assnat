import { motion } from "framer-motion";


const RapportFeatureRh = () => {

    const leaves = [
        { label: "LIMITES", icon: "https://img.icons8.com/ios/50/bar-chart.png" },
        { label: "DEMANDES", icon: "https://img.icons8.com/?size=256w&id=30&format=png" },
        { label: "RÈGLEMENTS", icon: "https://img.icons8.com/ios/50/wallet.png" },
        { label: "FEUILLE DE TEMPS", icon: "https://img.icons8.com/ios/50/planner.png" },
    ];

    const presence = [
        { label: "TEMPS DE TRAVAIL", icon: "https://img.icons8.com/ios/50/briefcase.png" },
        { label: "ACTIVITÉS", icon: "https://img.icons8.com/ios/50/activity.png" },
        { label: "ANOMALIES", icon: "https://img.icons8.com/ios/50/error.png" },
        { label: "LISTE DE PRÉSENCE", icon: "https://img.icons8.com/ios/50/task.png" },
        { label: "PROJETS", icon: "https://img.icons8.com/ios/50/opened-folder.png" },
        { label: "ACTIVITÉS", icon: "https://img.icons8.com/ios/50/activity.png" },
        { label: "ANOMALIES", icon: "https://img.icons8.com/ios/50/error.png" },
        { label: "LISTE DE PRÉSENCE", icon: "https://img.icons8.com/ios/50/task.png" },
        { label: "PROJETS", icon: "https://img.icons8.com/ios/50/opened-folder.png" },
        { label: "ACTIVITÉS", icon: "https://img.icons8.com/ios/50/activity.png" },
        { label: "ANOMALIES", icon: "https://img.icons8.com/ios/50/error.png" },
        { label: "LISTE DE PRÉSENCE", icon: "https://img.icons8.com/ios/50/task.png" },
        { label: "PROJETS", icon: "https://img.icons8.com/ios/50/opened-folder.png" },
        { label: "ACTIVITÉS", icon: "https://img.icons8.com/ios/50/activity.png" },
        { label: "ANOMALIES", icon: "https://img.icons8.com/ios/50/error.png" },
        { label: "LISTE DE PRÉSENCE", icon: "https://img.icons8.com/ios/50/task.png" },
        { label: "PROJETS", icon: "https://img.icons8.com/ios/50/opened-folder.png" },
        { label: "ACTIVITÉS", icon: "https://img.icons8.com/ios/50/activity.png" },
        { label: "ANOMALIES", icon: "https://img.icons8.com/ios/50/error.png" },
        { label: "LISTE DE PRÉSENCE", icon: "https://img.icons8.com/ios/50/task.png" },
        { label: "PROJETS", icon: "https://img.icons8.com/ios/50/opened-folder.png" },
    ];

    return (
        <motion.div className="h-full flex flex-col bg-white"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <header className="border-b border-gray-200  px-5 py-3">
                <h1 className="text-xl text-gray-800">Rapport</h1>
            </header>

            <div className="h-screen overflow-y-auto text-gray-800 p-6">
                {/* Section Congés */}
                <h2 className="text-lg font-semibold text-emerald-700 mb-3">Congés</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 mb-8">
                    {leaves.map((item) => (
                        <div
                            key={item.label}
                            className="bg-white border border-gray-200  p-6 text-center hover:border-emerald-600 hover:bg-emerald-50 cursor-pointer transition"
                        >
                            <img
                                src={item.icon}
                                alt={item.label}
                                className="mx-auto mb-3 opacity-70 w-10"
                            />
                            <p className="font-medium text-gray-700">{item.label}</p>
                        </div>
                    ))}
                </div>

                {/* Section Présence */}
                <h2 className="text-lg font-semibold text-emerald-700 mb-3">Présence</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {presence.map((item) => (
                        <div
                            key={item.label}
                            className="bg-white border border-gray-200  p-6 text-center hover:border-emerald-600 hover:bg-emerald-50 cursor-pointer transition"
                        >
                            <img
                                src={item.icon}
                                alt={item.label}
                                className="mx-auto mb-3 opacity-70 w-10"
                            />
                            <p className="font-medium text-gray-700">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default RapportFeatureRh;