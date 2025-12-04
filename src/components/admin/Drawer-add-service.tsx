import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useRhService } from "../../hooks/rh/useRhService";
import type { CreateServiceDto, Direction, Service } from "../../types/validation.dto";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    directions: Direction[];
    onCreated?: (service: Service) => void;
}

type ServiceFormState = Omit<CreateServiceDto, "nb_personnel"> & { nb_personnel?: number | ""; };

export default function DrawerAddService({ isOpen, onClose, directions, onCreated }: DrawerProps) {
    const { createService } = useRhService();

    const [loadingSkeleton, setLoadingSkeleton] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState<ServiceFormState>(initialFormState(directions));

    useEffect(() => {
        if (isOpen) {
            setLoadingSkeleton(true);
            const timer = setTimeout(() => setLoadingSkeleton(false), 400);
            setFormData(initialFormState(directions));
            setError(null);
            return () => clearTimeout(timer);
        }
    }, [isOpen, directions]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleChange = (field: keyof ServiceFormState, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: field === "nb_personnel" ? (value ? Number(value) : "") : value,
        }));
    };

    const handleClose = () => {
        setFormData(initialFormState(directions));
        setSubmitting(false);
        setError(null);
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.nom_service.trim() || !formData.code_service.trim() || !formData.id_direction) {
            setError("Merci de renseigner au minimum le nom, le code et la direction.");
            return;
        }

        // Le backend n'accepte que code_service, nom_service et id_direction
        // nb_personnel et id_chefdeservice ont des valeurs par défaut dans Prisma
        const payload: CreateServiceDto = {
            nom_service: formData.nom_service.trim(),
            code_service: formData.code_service.trim(),
            id_direction: formData.id_direction,
        };

        try {
            setSubmitting(true);
            setError(null);
            const created = await createService(payload);
            toast.success("Service enregistré avec succès !");
            if (onCreated && created) {
                onCreated(created);
            }
            handleClose();
        } catch (err: any) {
            const message = err?.message || "Impossible d'enregistrer le service.";
            setError(message);
            toast.error(message);
        } finally {
            setSubmitting(false);
        }
    };

    const directionOptions = useMemo(
        () =>
            directions.map((direction) => ({
                value: direction.id_direction,
                label: direction.nom_direction,
            })),
        [directions]
    );

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleSubmit}
                            disabled={submitting}
                            className="bg-[#27a082] cursor-pointer hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                            {submitting ? "Enregistrement..." : "✓ Save"}
                        </button>
                        <h1 className="text-xl font-normal text-gray-700">Nouveau service</h1>
                    </div>

                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">
                        ✕
                    </button>
                </header>

                <div className="flex h-full overflow-hidden relative">
                    {loadingSkeleton && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <ClipLoader
                                color="#27a082"
                                loading={loadingSkeleton}
                                size={40}
                                speedMultiplier={3}
                                aria-label="Chargement..."
                                data-testid="loader"
                            />
                        </div>
                    )}

                    <main className="flex-1 p-8 overflow-y-auto space-y-6">
                        <section className="bg-white space-y-5">
                            <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations principales</h2>
                            <FormRow
                                label="Nom du service"
                                required
                                input={
                                    <input
                                        type="text"
                                        value={formData.nom_service}
                                        onChange={(e) => handleChange("nom_service", e.target.value)}
                                        placeholder="Entrer le nom du service"
                                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                                    />
                                }
                            />
                            <FormRow
                                label="Code service"
                                required
                                input={
                                    <input
                                        type="text"
                                        value={formData.code_service}
                                        onChange={(e) => handleChange("code_service", e.target.value)}
                                        placeholder="Entrer le code"
                                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                                    />
                                }
                            />
                            <FormRow
                                label="Direction rattachée"
                                required
                                input={
                                    <select
                                        value={formData.id_direction}
                                        onChange={(e) => handleChange("id_direction", e.target.value)}
                                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                                    >
                                        <option value="">Sélectionner une direction</option>
                                        {directionOptions.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                }
                            />
                            <FormRow
                                label="Nombre de personnel"
                                input={
                                    <input
                                        type="number"
                                        min={0}
                                        value={formData.nb_personnel === "" ? "" : formData.nb_personnel ?? ""}
                                        onChange={(e) => handleChange("nb_personnel", e.target.value)}
                                        placeholder="Ex: 12"
                                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                                    />
                                }
                            />
                        </section>

                        {error && (
                            <p className="text-sm text-red-500">
                                {error}
                            </p>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

function initialFormState(directions: Direction[]): ServiceFormState {
    return {
        nom_service: "",
        code_service: "",
        id_direction: directions[0]?.id_direction ?? "",
        nb_personnel: undefined,
        // nb_personnel: "",
        // id_chefdeservice: "",
    };
}

function FormRow({ label, required, input }: { label: string; required?: boolean; input: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-6">
            <label className="w-1/3 text-[#abb2b9]">
                {label}
                {required ? "*" : ""}
            </label>
            {input}
        </div>
    );
}