import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import type { Service } from "../../types/validation.dto";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    service: Service | null;
}

export default function DrawerSeeServiceData({ isOpen, onClose, service }: DrawerProps) {
    const [loadingSkeleton, setLoadingSkeleton] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoadingSkeleton(true);
            const timer = setTimeout(() => setLoadingSkeleton(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-[60%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-medium text-gray-800">
                            {service ? service.nom_service : "Service"}
                        </h1>
                        {service?.code_service && (
                            <p className="text-sm text-gray-500">Code: {service.code_service}</p>
                        )}
                    </div>
                    <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">
                            ✕
                        </button>
                </header>

                <div className="flex-1 overflow-y-auto relative">
                    {loadingSkeleton ? (
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
                    ) : (
                        <div className="p-6 space-y-6">
                            {!service ? (
                                <p className="text-sm text-gray-500">Sélectionnez un service pour voir ses détails.</p>
                            ) : (
                                <>
                                    <section className="space-y-3">
                                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                            Informations générales
                                        </h2>
                                        <InfoRow label="Nom du service" value={service.nom_service} />
                                        <InfoRow label="Code service" value={service.code_service} />
                                        <InfoRow label="Direction" value={service.id_direction} />
                                        <InfoRow
                                            label="Nombre de personnel"
                                            value={
                                                typeof service.nb_personnel === "number"
                                                    ? service.nb_personnel.toString()
                                                    : "Non renseigné"
                                            }
                                        />
                                        <InfoRow label="Date de création" value={formatDate(service.date_creation)} />
                                    </section>

                                    {service.services?.length ? (
                                        <section className="space-y-3">
                                            <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                                                Sous-services
                                            </h2>
                                            <ul className="space-y-2">
                                                {service.services.map((sub) => (
                                                    <li key={sub.id_service} className="border border-gray-200 rounded px-3 py-2">
                                                        <div className="flex justify-between text-sm text-gray-700">
                                                            <span className="font-medium">{sub.nom_service}</span>
                                                            <span className="text-gray-500">{sub.code_service}</span>
                                </div>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {formatDate(sub.date_creation)}
                                                        </p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </section>
                                    ) : null}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-50 border border-gray-100 rounded px-4 py-3">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm text-gray-800 mt-1 sm:mt-0">{value || "Non renseigné"}</span>
        </div>
    );
}

function formatDate(value?: string) {
    if (!value) return "Non renseigné";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}
