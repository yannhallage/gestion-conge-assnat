import { motion } from "framer-motion";

const DemandesRapportFeature = () => {
    return (
        <motion.div
            className="h-full flex flex-col bg-white"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <header className="border-b border-gray-200 px-5 py-3">
                <h1 className="text-xl text-gray-800">Demandes</h1>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <p className="text-gray-600">Page des demandes - À implémenter</p>
                </div>
            </div>
        </motion.div>
    );
};

export default DemandesRapportFeature;

