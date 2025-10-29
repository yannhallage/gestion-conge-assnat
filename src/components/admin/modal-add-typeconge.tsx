import React from "react";
import { CalendarDays } from 'lucide-react';
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

Modal.setAppElement("#root");

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    cancel: () => void;
    confirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const AddModalTypeConge: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    description,
    cancel,
    confirm,
    cancelText = "Annuler",
    confirmText = "Confirmer",
}) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onRequestClose={cancel}
                    overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-300"
                    className="outline-none"
                    closeTimeoutMS={300}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.90, x: 20 }}
                        transition={{ duration: 0.1, ease: "easeOut" }}
                        className="bg-white p-6 w-[400px] mx-2 shadow-lg rounded-lg"
                    >
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-yellow-100 text-yellow-500 p-3 rounded-full mb-3">
                                <CalendarDays size={30} />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">{title}</h2>
                            <input
                                type="text"
                                placeholder={`Enter`}
                                className="flex-1 px-2 py-2 border border-gray-300 bg-white text-gray-700 
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                            />
                            <select
                                id="Genre"
                                className="flex-1 px-2 py-2 mt-1 border border-gray-300 bg-white text-gray-700 
                                        focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                            >
                                <option value="male">True</option>
                                <option value="female">False</option>
                            </select>
                            <p className="text-gray-600 text-sm mb-6">{description}</p>

                            <div className="flex justify-end space-x-3 w-full">
                                <button
                                    onClick={cancel}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={confirm}
                                    className="px-4 py-2 bg-yellow-400 text-white font-medium hover:bg-yellow-500 transition"
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </Modal>

            )}
        </AnimatePresence>
    );
};
