import { useState, useEffect } from "react";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";
import { ClipLoader } from "react-spinners";
import { jsPDF } from "jspdf";
import { useComptabiliteService } from "../../hooks/comptabilite/useComptabiliteService";

Modal.setAppElement("#root");

interface ModalCreatePaieProps {
    isOpen: boolean;
    onClose: () => void;
    personnelId: string;
    personnelName?: string;
    onSuccess?: () => void;
}

interface FormData {
    mois: string;
    annee: string;
    salaire_brut: string;
    salaire_net: string;
    primes: string;
    deductions: string;
    file: File | null;
}

export default function ModalCreatePaie({
    isOpen,
    onClose,
    personnelId,
    personnelName,
    onSuccess,
}: ModalCreatePaieProps) {
    const { createPaie, loading, error } = useComptabiliteService();
    const [formData, setFormData] = useState<FormData>({
        mois: "",
        annee: new Date().getFullYear().toString(),
        salaire_brut: "",
        salaire_net: "",
        primes: "",
        deductions: "",
        file: null,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [fileError, setFileError] = useState<string>("");

    useEffect(() => {
        if (!isOpen) {
            // Réinitialiser le formulaire quand le modal se ferme
            setFormData({
                mois: "",
                annee: new Date().getFullYear().toString(),
                salaire_brut: "",
                salaire_net: "",
                primes: "",
                deductions: "",
                file: null,
            });
            setErrors({});
            setFileError("");
        }
    }, [isOpen]);

    const handleChange = (field: keyof FormData, value: string | File | null) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Effacer l'erreur du champ modifié
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
        if (field === "file") {
            setFileError("");
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.mois || parseInt(formData.mois) < 1 || parseInt(formData.mois) > 12) {
            newErrors.mois = "Le mois doit être entre 1 et 12";
        }

        if (!formData.annee || parseInt(formData.annee) < 2000) {
            newErrors.annee = "L'année doit être supérieure ou égale à 2000";
        }

        if (!formData.salaire_brut || parseFloat(formData.salaire_brut) < 0) {
            newErrors.salaire_brut = "Le salaire brut est requis et doit être positif";
        }

        if (!formData.salaire_net || parseFloat(formData.salaire_net) < 0) {
            newErrors.salaire_net = "Le salaire net est requis et doit être positif";
        }

        if (formData.primes && parseFloat(formData.primes) < 0) {
            newErrors.primes = "Les primes doivent être positives";
        }

        if (formData.deductions && parseFloat(formData.deductions) < 0) {
            newErrors.deductions = "Les déductions doivent être positives";
        }

        // Le fichier est optionnel - on générera un PDF si aucun fichier n'est fourni
        if (formData.file) {
            if (formData.file.type !== "application/pdf") {
                setFileError("Seuls les fichiers PDF sont autorisés");
            } else if (formData.file.size > 10 * 1024 * 1024) {
                setFileError("Le fichier ne doit pas dépasser 10MB");
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0 && !fileError;
    };

    const generatePdfFromData = (): File => {
        const doc = new jsPDF();
        const PAGE_MARGIN = 20;
        let currentY = 30;

        // En-tête
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor("#27a082");
        doc.text("BULLETIN DE PAIE", 105, currentY, { align: "center" });
        currentY += 15;

        // Informations du personnel
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.setTextColor("#000000");
        if (personnelName) {
            doc.text(`Personnel: ${personnelName}`, PAGE_MARGIN, currentY);
            currentY += 8;
        }

        // Période
        const moisNom = new Date(parseInt(formData.annee), parseInt(formData.mois) - 1).toLocaleDateString("fr-FR", {
            month: "long",
            year: "numeric",
        });
        doc.text(`Période: ${moisNom}`, PAGE_MARGIN, currentY);
        currentY += 15;

        // Ligne de séparation
        doc.setDrawColor("#dddddd");
        doc.line(PAGE_MARGIN, currentY, 190, currentY);
        currentY += 12;

        // Détails de la paie
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Détails de la paie", PAGE_MARGIN, currentY);
        currentY += 12;

        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");
        doc.text(`Salaire brut: ${parseFloat(formData.salaire_brut).toLocaleString("fr-FR")} XOF`, PAGE_MARGIN, currentY);
        currentY += 8;

        if (formData.primes && parseFloat(formData.primes) > 0) {
            doc.text(`Primes: ${parseFloat(formData.primes).toLocaleString("fr-FR")} XOF`, PAGE_MARGIN, currentY);
            currentY += 8;
        }

        if (formData.deductions && parseFloat(formData.deductions) > 0) {
            doc.text(`Déductions: ${parseFloat(formData.deductions).toLocaleString("fr-FR")} XOF`, PAGE_MARGIN, currentY);
            currentY += 8;
        }

        currentY += 5;
        doc.setDrawColor("#dddddd");
        doc.line(PAGE_MARGIN, currentY, 190, currentY);
        currentY += 10;

        // Salaire net
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.setTextColor("#27a082");
        doc.text(`Salaire net: ${parseFloat(formData.salaire_net).toLocaleString("fr-FR")} XOF`, PAGE_MARGIN, currentY);
        currentY += 15;

        // Date de génération
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor("#666666");
        doc.text(
            `Généré le ${new Date().toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}`,
            PAGE_MARGIN,
            280,
            { align: "left" }
        );

        // Convertir le PDF en Blob puis en File
        const pdfBlob = doc.output("blob");
        const fileName = `bulletin_paie_${personnelName?.replace(/\s+/g, "_") || "personnel"}_${formData.mois}_${formData.annee}.pdf`;
        return new File([pdfBlob], fileName, { type: "application/pdf" });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const formDataToSend = new FormData();
            
            // Utiliser le fichier fourni ou générer un PDF
            let fileToSend: File;
            if (formData.file) {
                fileToSend = formData.file;
            } else {
                // Générer un PDF avec les données
                fileToSend = generatePdfFromData();
            }

            formDataToSend.append("file", fileToSend);
            formDataToSend.append("id_personnel", personnelId);
            formDataToSend.append("mois", formData.mois);
            formDataToSend.append("annee", formData.annee);
            formDataToSend.append("salaire_brut", formData.salaire_brut);
            formDataToSend.append("salaire_net", formData.salaire_net);

            if (formData.primes) {
                formDataToSend.append("primes", formData.primes);
            }

            if (formData.deductions) {
                formDataToSend.append("deductions", formData.deductions);
            }

            await createPaie(formDataToSend);
            if (onSuccess) {
                onSuccess();
            }
            onClose();
        } catch (err) {
            console.error("Erreur lors de la création de la paie:", err);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            if (file.type !== "application/pdf") {
                setFileError("Seuls les fichiers PDF sont autorisés");
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setFileError("Le fichier ne doit pas dépasser 10MB");
                return;
            }
            setFileError("");
        }
        handleChange("file", file);
    };

    const moisOptions = Array.from({ length: 12 }, (_, i) => i + 1);
    const anneeOptions = Array.from(
        { length: 10 },
        (_, i) => new Date().getFullYear() - i
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    onRequestClose={onClose}
                    overlayClassName="fixed inset-0 bg-black/40 flex items-center justify-center z-50 transition-opacity duration-300"
                    className="outline-none"
                    closeTimeoutMS={300}
                >
                    <motion.div
                        // initial={{ opacity: 0, scale: 0.95, y: 0 }}
                        // animate={{ opacity: 1, scale: 1, y: 0 }}
                        // exit={{ opacity: 0, scale: 0.95, y: 2 }}
                        // transition={{ duration: 0.2, ease: "easeOut" }}
                        className="bg-white shadow-xl w-[90vw] max-w-6xl mx-auto overflow-y-auto max-h-[90vh]"
                    >
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    Créer une paie
                                </h2>
                                {personnelName && (
                                    <p className="text-sm text-gray-500 mt-1">
                                        Pour {personnelName}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                disabled={loading}
                            >
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="text-gray-500"
                                >
                                    <path
                                        d="M18 6L6 18M6 6l12 12"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-5">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Mois et Année */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mois <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.mois}
                                        onChange={(e) => handleChange("mois", e.target.value)}
                                        className={`w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#27a082] focus:border-transparent ${errors.mois ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={loading}
                                    >
                                        <option value="">Sélectionner un mois</option>
                                        {moisOptions.map((mois) => (
                                            <option key={mois} value={mois}>
                                                {new Date(2000, mois - 1).toLocaleDateString("fr-FR", {
                                                    month: "long",
                                                })}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.mois && (
                                        <p className="text-red-500 text-xs mt-1">{errors.mois}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Année <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={formData.annee}
                                        onChange={(e) => handleChange("annee", e.target.value)}
                                        className={`w-full px-3 py-2 border focus:outline-none focus:ring-2 focus:ring-[#27a082] focus:border-transparent ${errors.annee ? "border-red-500" : "border-gray-300"
                                            }`}
                                        disabled={loading}
                                    >
                                        {anneeOptions.map((annee) => (
                                            <option key={annee} value={annee}>
                                                {annee}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.annee && (
                                        <p className="text-red-500 text-xs mt-1">{errors.annee}</p>
                                    )}
                                </div>
                            </div>

                            {/* Salaire brut et net */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Salaire brut (XOF) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.salaire_brut}
                                        onChange={(e) => handleChange("salaire_brut", e.target.value)}
                                        className={`w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#27a082] focus:border-transparent ${errors.salaire_brut ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="0.00"
                                        disabled={loading}
                                    />
                                    {errors.salaire_brut && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.salaire_brut}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Salaire net (XOF) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.salaire_net}
                                        onChange={(e) => handleChange("salaire_net", e.target.value)}
                                        className={`w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#27a082] focus:border-transparent ${errors.salaire_net ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="0.00"
                                        disabled={loading}
                                    />
                                    {errors.salaire_net && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.salaire_net}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Primes et Déductions */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Primes (XOF)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.primes}
                                        onChange={(e) => handleChange("primes", e.target.value)}
                                        className={`w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#27a082] focus:border-transparent ${errors.primes ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="0.00"
                                        disabled={loading}
                                    />
                                    {errors.primes && (
                                        <p className="text-red-500 text-xs mt-1">{errors.primes}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Déductions (XOF)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.deductions}
                                        onChange={(e) => handleChange("deductions", e.target.value)}
                                        className={`w-full px-3 py-2 border  focus:outline-none focus:ring-2 focus:ring-[#27a082] focus:border-transparent ${errors.deductions ? "border-red-500" : "border-gray-300"
                                            }`}
                                        placeholder="0.00"
                                        disabled={loading}
                                    />
                                    {errors.deductions && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.deductions}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Fichier PDF */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fichier PDF du bulletin
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Si aucun fichier n'est sélectionné, un PDF sera généré automatiquement avec les données saisies.
                                </p>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed  hover:border-[#27a082] transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-4h-12m-2-5h13.172M16 20l-4-4m4 4l4-4"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            />
                                        </svg>
                                        <div className="flex text-sm text-gray-600">
                                            <label
                                                htmlFor="file-upload"
                                                className="relative cursor-pointer bg-white rounded-md font-medium text-[#27a082] hover:text-[#27a082]/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-[#27a082]"
                                            >
                                                <span>Téléverser un fichier</span>
                                                <input
                                                    id="file-upload"
                                                    name="file-upload"
                                                    type="file"
                                                    accept=".pdf,application/pdf"
                                                    className="sr-only"
                                                    onChange={handleFileChange}
                                                    disabled={loading}
                                                />
                                            </label>
                                            <p className="pl-1">ou glissez-déposez</p>
                                        </div>
                                        <p className="text-xs text-gray-500">
                                            PDF jusqu'à 10MB
                                        </p>
                                        {formData.file && (
                                            <p className="text-sm text-gray-700 mt-2">
                                                {formData.file.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {fileError && (
                                    <p className="text-red-500 text-xs mt-1">{fileError}</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                    disabled={loading}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-[#27a082] rounded-lg hover:bg-[#27a082]/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <ClipLoader size={16} color="#fff" />
                                            <span>Création...</span>
                                        </>
                                    ) : (
                                        "Créer la paie"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </Modal>
            )}
        </AnimatePresence>
    );
}

