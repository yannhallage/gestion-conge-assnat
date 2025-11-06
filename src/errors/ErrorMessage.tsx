import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export default function ErrorMessage({ error }:any) {
    if (!error) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-red-100 text-red-800 border border-red-300 px-4 py-3 rounded-xl shadow-sm flex items-center gap-2 mt-3"
            >
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span className="font-medium">{error}</span>
            </motion.div>
        </AnimatePresence>
    );
}
