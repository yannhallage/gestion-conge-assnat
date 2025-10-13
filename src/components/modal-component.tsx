import React from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

Modal.setAppElement("#root");

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    description: string;
    cancel: () => void;
    confirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
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
                    overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
                    className="bg-white p-6 w-[400px] mx-2 shadow-lg outline-none"
                    closeTimeoutMS={300}
                >
                    <motion.div>
                        <div className="flex flex-col items-center text-center">
                            <div className="bg-yellow-100 text-yellow-500 p-3 rounded-full mb-3">
                                <AlertTriangle size={30} />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">{title}</h2>
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
