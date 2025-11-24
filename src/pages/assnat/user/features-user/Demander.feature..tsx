import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import {
    addDays,
    addMonths,
    endOfMonth,
    endOfWeek,
    format,
    isSameMonth,
    startOfMonth,
    startOfWeek,
    subMonths,
    differenceInCalendarDays,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUserService } from "../../../../hooks/employes/useUserService";
import type { CreateDemandePayload } from "../../../../types/validation.dto";
// import CustomModal from "../../../../components/assnat/user/CustomModal";

type TypeConge = {
    id_typeconge: string;
    libelle_typeconge: string;
    description?: string | null;
};

const parseInputDate = (value: string): Date => {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, (month ?? 1) - 1, day ?? 1);
};

const formatToInputValue = (date: Date) => format(date, "yyyy-MM-dd");

const DemanderFeature = () => {
    const { user } = useAuth();
    const userId = user?.id ?? null;

    const {
        loading: serviceLoading,
        error: serviceError,
        createDemande,
        getTypesConge,
    } = useUserService(userId);

    const [screenLoading, setScreenLoading] = useState(true);
    const [typesConge, setTypesConge] = useState<TypeConge[]>([]);
    const [typesLoading, setTypesLoading] = useState(false);
    const [typesError, setTypesError] = useState<string | null>(null);
    const [submitLoading, setSubmitLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setScreenLoading(false), 700);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (!userId) {
            setTypesConge([]);
            setTypesError("Impossible de récupérer votre identifiant utilisateur.");
            return;
        }

        let cancelled = false;

        const fetchTypes = async () => {
            try {
                setTypesLoading(true);
                setTypesError(null);
                const response = await getTypesConge();
                if (cancelled) return;
                setTypesConge(Array.isArray(response) ? response : []);
            } catch (err: any) {
                if (cancelled) return;
                setTypesError(err?.message || "Erreur lors du chargement des types de congé.");
            } finally {
                if (!cancelled) {
                    setTypesLoading(false);
                }
            }
        };

        fetchTypes();

        return () => {
            cancelled = true;
        };
    }, [getTypesConge, userId]);

    const handleCreateDemande = async (payload: CreateDemandePayload) => {
        if (!userId) {
            toast.error("Utilisateur non identifié. Veuillez vous reconnecter.");
            return false;
        }

        try {
            setSubmitLoading(true);
            await createDemande(payload);
            toast.success("Demande enregistrée avec succès.");
            return true;
        } catch (error: any) {
            const message = error?.message || "Erreur lors de l'enregistrement de la demande.";
            toast.error(message);
            return false;
        } finally {
            setSubmitLoading(false);
        }
    };

    const globalError = typesError || serviceError;
    const shouldShowLoader = screenLoading || (typesLoading && !typesConge.length);

    if (shouldShowLoader) {
        return (
            <div className="flex items-center justify-center h-screen">
                <ClipLoader
                    color="#27a082"
                    loading
                    size={29}
                    speedMultiplier={3}
                    aria-label="Chargement..."
                    data-testid="loader"
                />
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="flex h-full flex-col items-center justify-center bg-white px-6 text-center text-gray-600">
                <p className="text-sm">
                    Impossible d’accéder à la création de demande. Veuillez vous reconnecter.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            <header className="border-b border-gray-200 px-5 py-3">
                <h1 className="text-xl text-gray-800">Demander</h1>
            </header>

            {globalError && (
                <div className="mx-5 mt-4 rounded-lg border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {globalError}
                </div>
            )}

            <div className="h-screen overflow-y-auto">
                <CongeCalendar
                    types={typesConge}
                    typesLoading={typesLoading}
                    submitting={submitLoading || serviceLoading}
                    onSubmit={handleCreateDemande}
                />
            </div>
        </div>
    );
};

export default DemanderFeature;

interface CongeCalendarProps {
    types: TypeConge[];
    typesLoading: boolean;
    submitting: boolean;
    onSubmit: (payload: CreateDemandePayload) => Promise<boolean>;
}

type LocalFormState = {
    dateDebut: string;
    dateFin: string;
    typeId: string;
    motif: string;
};

function CongeCalendar({ types, typesLoading, submitting, onSubmit }: CongeCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [formError, setFormError] = useState<string | null>(null);
    const [formState, setFormState] = useState<LocalFormState>({
        dateDebut: "",
        dateFin: "",
        typeId: "",
        motif: "",
    });

    const rangeStart = useMemo(() => (formState.dateDebut ? parseInputDate(formState.dateDebut) : null), [formState.dateDebut]);
    const rangeEnd = useMemo(() => {
        if (formState.dateFin) return parseInputDate(formState.dateFin);
        if (formState.dateDebut) return parseInputDate(formState.dateDebut);
        return null;
    }, [formState.dateDebut, formState.dateFin]);

    const nbJours = useMemo(() => {
        if (!rangeStart || !rangeEnd) return 0;
        if (rangeEnd < rangeStart) return 0;
        return differenceInCalendarDays(rangeEnd, rangeStart) + 1;
    }, [rangeEnd, rangeStart]);

    const selectedType = useMemo(
        () => types.find((type) => type.id_typeconge === formState.typeId),
        [types, formState.typeId]
    );

    const clearError = () => setFormError(null);

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleDayClick = (day: Date) => {
        const value = formatToInputValue(day);
        clearError();
        setCurrentMonth(startOfMonth(day));
        setFormState((prev) => {
            if (!prev.dateDebut || prev.dateFin) {
                return { ...prev, dateDebut: value, dateFin: "" };
            }

            const start = parseInputDate(prev.dateDebut);
            const clicked = parseInputDate(value);

            if (clicked < start) {
                return { ...prev, dateDebut: value };
            }

            return { ...prev, dateFin: value };
        });
    };

    const handleStartInputChange = (value: string) => {
        clearError();
        setFormState((prev) => {
            if (!value) {
                return { ...prev, dateDebut: "", dateFin: "" };
            }

            let nextEnd = prev.dateFin;
            if (nextEnd) {
                const endDate = parseInputDate(nextEnd);
                const newStart = parseInputDate(value);
                if (endDate < newStart) {
                    nextEnd = "";
                }
            }

            return {
                ...prev,
                dateDebut: value,
                dateFin: nextEnd,
            };
        });
        if (value) {
            setCurrentMonth(startOfMonth(parseInputDate(value)));
        }
    };

    const handleEndInputChange = (value: string) => {
        clearError();
        setFormState((prev) => {
            if (!value) {
                return { ...prev, dateFin: "" };
            }

            if (prev.dateDebut) {
                const startDate = parseInputDate(prev.dateDebut);
                const newEnd = parseInputDate(value);
                if (newEnd < startDate) {
                    setFormError("La date de fin doit être postérieure ou égale à la date de début.");
                    return prev;
                }
            }

            return { ...prev, dateFin: value };
        });
    };

    const handleTypeChange = (value: string) => {
        clearError();
        setFormState((prev) => ({ ...prev, typeId: value }));
    };

    const handleMotifChange = (value: string) => {
        setFormState((prev) => ({ ...prev, motif: value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        clearError();

        if (!formState.dateDebut) {
            setFormError("Veuillez sélectionner une date de début.");
            return;
        }

        if (!formState.typeId) {
            setFormError("Veuillez sélectionner un type de congé.");
            return;
        }

        const dateFin = formState.dateFin || formState.dateDebut;
        const startDate = parseInputDate(formState.dateDebut);
        const endDate = parseInputDate(dateFin);

        if (endDate < startDate) {
            setFormError("La date de fin doit être postérieure ou égale à la date de début.");
            return;
        }

        const totalDays = differenceInCalendarDays(endDate, startDate) + 1;
        if (totalDays <= 0) {
            setFormError("Le nombre de jours calculé est invalide.");
            return;
        }

        const payload: CreateDemandePayload = {
            type_demande: selectedType?.libelle_typeconge || "Demande de congé",
            motif: formState.motif || undefined,
            date_debut: formState.dateDebut,
            date_fin: dateFin,
            nb_jour: totalDays,
            id_typeconge: formState.typeId,
        };

        const success = await onSubmit(payload);
        if (success) {
            setFormState({
                dateDebut: "",
                dateFin: "",
                typeId: "",
                motif: "",
            });
        }
    };

    const renderHeader = () => (
        <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl text-emerald-600">
                {format(currentMonth, "MMMM yyyy", { locale: fr })}
            </h2>
            <div className="flex items-center space-x-2 text-gray-500">
                <ChevronLeft
                    className="cursor-pointer hover:text-emerald-500"
                    onClick={prevMonth}
                />
                <ChevronRight
                    className="cursor-pointer hover:text-emerald-500"
                    onClick={nextMonth}
                />
                <button
                    onClick={() => setCurrentMonth(new Date())}
                    className="text-sm text-gray-400 hover:text-emerald-500"
                    type="button"
                >
                    Aujourd’hui
                </button>
            </div>
        </div>
    );

    const renderDays = () => {
        const start = startOfWeek(currentMonth, { locale: fr });
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push(
                <div
                    key={i}
                    className="border-b border-gray-200 py-1 text-center text-sm font-medium text-gray-500"
                >
                    {format(addDays(start, i), "EEE", { locale: fr })
                        .replace(".", "")
                        .replace(/^\w/, (c) => c.toLowerCase())}
                </div>
            );
        }
        return <div className="grid grid-cols-7">{days}</div>;
    };

    const renderCells = () => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart, { locale: fr });
        const endDate = endOfWeek(monthEnd, { locale: fr });

        const rows = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const cloneDay = day;
                const isWeekend = [6, 0].includes(day.getDay());
                const isSunday = day.getDay() === 0;
                const isOtherMonth = !isSameMonth(day, monthStart);
                const isInRange = !!(rangeStart && rangeEnd && day >= rangeStart && day <= rangeEnd);

                let className = "h-19 flex items-center justify-center border border-[#ccc] text-sm cursor-pointer transition-colors";

                if (isInRange) {
                    className += " bg-[#27a082] text-white font-semibold";
                } else if (isOtherMonth) {
                    className += " bg-gray-50 text-gray-300";
                } else if (isSunday) {
                    className += " text-red-600 font-semibold";
                } else if (isWeekend) {
                    className += " text-red-400";
                } else {
                    className += " text-gray-700 hover:bg-emerald-50";
                }

                days.push(
                    <div
                        key={day.toString()}
                        onClick={() => handleDayClick(cloneDay)}
                        className={className}
                    >
                        {format(day, "d")}
                    </div>
                );
                day = addDays(day, 1);
            }
            rows.push(
                <div className="grid grid-cols-7" key={day.toString()}>
                    {days}
                </div>
            );
            days = [];
        }

        return <div className="border border-gray-200">{rows}</div>;
    };

    const ratioCurrentYear = nbJours ? Math.min((nbJours / 20) * 100, 100) : 0;
    const ratioNextYear = nbJours ? Math.min((nbJours / 40) * 100, 100) : 0;

    return (
        <motion.div className="flex flex-col bg-white p-6 text-sm md:flex-row">
            <div className="flex-1">
                {renderHeader()}
                {renderDays()}
                {renderCells()}

                <div className="mt-6">
                    <div className="mb-1 text-xs text-gray-600">
                        {nbJours ? `${nbJours} jour${nbJours > 1 ? "s" : ""} / 20 jours` : "0 jour / 20 jours"}
                    </div>
                    <div className="h-3 w-full border border-[#ccc] bg-emerald-100">
                        <div
                            className="h-3 border border-[#ccc] bg-emerald-400 transition-all"
                            style={{ width: `${ratioCurrentYear}%` }}
                        />
                    </div>
                    <div className="mt-1 text-right text-xs text-gray-400">{new Date().getFullYear()}</div>

                    <div className="mt-3 text-xs text-gray-600">
                        {nbJours ? `${nbJours} jour${nbJours > 1 ? "s" : ""} / 40 jours` : "0 jour / 40 jours"}
                    </div>
                    <div className="h-3 w-full border border-[#ccc] bg-emerald-100">
                        <div
                            className="h-3 border border-[#ccc] bg-emerald-400 transition-all"
                            style={{ width: `${ratioNextYear}%` }}
                        />
                    </div>
                    <div className="mt-1 text-right text-xs text-gray-400">{new Date().getFullYear() + 1}</div>
                </div>
            </div>
            <form
                className="mt-6 w-full space-y-3 md:ml-6 md:mt-0 md:w-64"
                onSubmit={handleSubmit}
            >
                {formError && (
                    <div className="rounded-lg border border-rose-300 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                        {formError}
                    </div>
                )}
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Du</label>
                    <input
                        type="date"
                        value={formState.dateDebut}
                        onChange={(event) => handleStartInputChange(event.target.value)}
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                        max={formState.dateFin || undefined}
                        disabled={submitting}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Au</label>
                    <input
                        type="date"
                        value={formState.dateFin}
                        onChange={(event) => handleEndInputChange(event.target.value)}
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                        min={formState.dateDebut || undefined}
                        disabled={submitting}
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Type de congé</label>
                    <select
                        value={formState.typeId}
                        onChange={(event) => handleTypeChange(event.target.value)}
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                        disabled={typesLoading || submitting}
                    >
                        <option value="">
                            {typesLoading ? "Chargement..." : "Sélectionner un type"}
                        </option>
                        {types.map((type) => (
                            <option key={type.id_typeconge} value={type.id_typeconge}>
                                {type.libelle_typeconge}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Motif</label>
                    <textarea
                        rows={3}
                        className="w-full border border-[#ccc] p-2 text-sm focus:outline-none focus:ring focus:ring-emerald-200"
                        value={formState.motif}
                        onChange={(event) => handleMotifChange(event.target.value)}
                        placeholder="Optionnel"
                        disabled={submitting}
                    />
                </div>
                <div className="text-xs text-gray-500">
                    Durée calculée :
                    <span className="ml-1 font-medium text-gray-700">
                        {nbJours ? `${nbJours} jour${nbJours > 1 ? "s" : ""}` : "—"}
                    </span>
                </div>
                <div>
                    <label className="mb-1 block text-sm text-gray-600">Pièces jointes</label>
                    <div className="w-14 cursor-not-allowed border bg-[#fff] py-2 px-4 text-gray-600 opacity-60">
                        <Plus size={20} />
                    </div>
                    <p className="mt-1 text-[11px] text-gray-400">(Fonctionnalité à venir)</p>
                </div>
                <button
                    className="w-full cursor-pointer rounded bg-[#279c83] px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                    type="submit"
                    disabled={submitting}
                >
                    {submitting ? "Enregistrement..." : "Créer la demande"}
                </button>
            </form>
        </motion.div>
    );
}