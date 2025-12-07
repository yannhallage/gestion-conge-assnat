import { motion } from "framer-motion";
import { Calculator, FileText, TrendingUp, Users } from "lucide-react";

export default function BienvenueFeature() {
    return (
        <div className="p-11 max-w-5xl mx-auto pt-16">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
            >
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Bienvenue dans l'espace Comptabilité
                </h1>
                <p className="text-gray-600 text-lg">
                    Gérez efficacement les aspects financiers et comptables de votre organisation
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-4xl mx-auto">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-5 border border-blue-200 text-center"
                    >
                        <div className="flex items-center justify-center mb-3">
                            <Calculator className="w-7 h-7 text-blue-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                            Calculs
                        </h3>
                        <p className="text-xs text-gray-600">
                            Effectuez vos calculs comptables et financiers
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-5 border border-green-200 text-center"
                    >
                        <div className="flex items-center justify-center mb-3">
                            <FileText className="w-7 h-7 text-green-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                            Rapports
                        </h3>
                        <p className="text-xs text-gray-600">
                            Consultez et générez vos rapports financiers
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-5 border border-purple-200 text-center"
                    >
                        <div className="flex items-center justify-center mb-3">
                            <TrendingUp className="w-7 h-7 text-purple-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                            Analyses
                        </h3>
                        <p className="text-xs text-gray-600">
                            Analysez les tendances et performances financières
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-5 border border-orange-200 text-center"
                    >
                        <div className="flex items-center justify-center mb-3">
                            <Users className="w-7 h-7 text-orange-600" />
                        </div>
                        <h3 className="text-base font-semibold text-gray-800 mb-2">
                            Personnel
                        </h3>
                        <p className="text-xs text-gray-600">
                            Gérez les aspects financiers du personnel
                        </p>
                    </motion.div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 max-w-4xl mx-auto"
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Informations importantes
                </h2>
                <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Cet espace est dédié à la gestion comptable et financière</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Les fonctionnalités seront progressivement ajoutées</span>
                    </li>
                    <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Pour toute question, contactez votre administrateur</span>
                    </li>
                </ul>
            </motion.div>
        </div>
    );
}

