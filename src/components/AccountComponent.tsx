import { useCallback, useEffect, useMemo, useState } from "react";
import type{ FormEvent } from "react";
import { ClipLoader } from "react-spinners";
import { USER_STORAGE_KEY } from "../secure/storageKeys";
import { authService } from "../services/auth/auth.service";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface StoredUser {
    id: string;
    email_personnel: string;
    nom: string;
    prenom: string;
    role: string;
    id_service?: string;
}

interface PasswordFormState {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function DrawerAccountComponent({ isOpen, onClose }: DrawerProps) {
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<StoredUser | null>(null);
    const [userError, setUserError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 700);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const loadUserFromStorage = useCallback(() => {
        try {
            const raw = localStorage.getItem(USER_STORAGE_KEY);
            if (!raw) {
                setUserData(null);
                setUserError("Impossible de récupérer les informations du compte.");
                return;
            }

            const parsed = JSON.parse(raw) as StoredUser;
            setUserData(parsed);
            setUserError(null);
        } catch (error) {
            console.error("Erreur lors de la lecture du storage utilisateur :", error);
            setUserData(null);
            setUserError("Les données du compte sont corrompues. Veuillez vous reconnecter.");
        }
    }, []);

    useEffect(() => {
        if (!isOpen) {
            return;
        }
        loadUserFromStorage();
    }, [isOpen, loadUserFromStorage]);

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key === USER_STORAGE_KEY) {
                loadUserFromStorage();
            }
        };

        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, [loadUserFromStorage]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleClose = () => {
        onClose();
    };

    const userInitials = useMemo(() => {
        if (!userData) return "??";
        const letters = [userData.prenom, userData.nom]
            .filter(Boolean)
            .map((item) => item.trim()[0]?.toUpperCase())
            .filter(Boolean);
        if (!letters.length) return "??";
        return letters.slice(0, 2).join("");
    }, [userData]);

    const fullName = useMemo(() => {
        if (!userData) return "";
        const parts = [userData.prenom, userData.nom].filter(Boolean);
        return parts.join(" ");
    }, [userData]);

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
                onClick={handleClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-[40%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
            >
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-11 h-11 l bg-emerald-100 text-emerald-700 flex items-center justify-center font-semibold">
                            {userInitials}
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-gray-800">Mon compte</h1>
                            {fullName && <p className="text-sm text-gray-500">{fullName}</p>}
                        </div>
                    </div>
                </header>

                <div className="flex h-full overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <ClipLoader
                                color="#27a082"
                                loading={loading}
                                size={40}
                                speedMultiplier={3}
                                aria-label="Chargement..."
                                data-testid="loader"
                            />
                        </div>
                    )}
                    <main className="flex-1 p-8 overflow-y-auto bg-slate-50">
                        <div className="max-w-3xl mx-auto space-y-8">
                            <section className="bg-white border border-gray-200  shadow-sm overflow-hidden">
                                <header className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-800">Informations du compte</h2>
                                        <p className="text-sm text-gray-500">Détails personnels du profil connecté.</p>
                                    </div>
                                </header>
                                <div className="px-6 py-6">
                                    {userError ? (
                                        <div className=" bg-rose-50 text-rose-600 px-4 py-3 text-sm">
                                            {userError}
                                        </div>
                                    ) : userData ? (
                                        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                                            <div>
                                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Nom complet</dt>
                                                <dd className="mt-1 text-sm text-gray-800 font-medium">{fullName || "—"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Adresse e-mail</dt>
                                                <dd className="mt-1 text-sm text-gray-800 font-medium">{userData.email_personnel || "—"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Identifiant</dt>
                                                <dd className="mt-1 text-sm text-gray-800 font-medium">{userData.id || "—"}</dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Rôle</dt>
                                                <dd className="mt-2">
                                                    <span className="inline-flex items-center l px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700">
                                                        {userData.role || "—"}
                                                    </span>
                                                </dd>
                                            </div>
                                            <div>
                                                <dt className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Service</dt>
                                                <dd className="mt-1 text-sm text-gray-800 font-medium">{userData.id_service || "—"}</dd>
                                            </div>
                                        </dl>
                                    ) : (
                                        <p className="text-sm text-gray-500">Aucune information utilisateur disponible. Veuillez vous reconnecter.</p>
                                    )}
                                </div>
                            </section>

                            <section className="bg-white border border-gray-200  shadow-sm overflow-hidden">
                                <header className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Modifier le mot de passe</h2>
                                    <p className="text-sm text-gray-500">Choisissez un mot de passe solide. Il doit contenir au minimum 8 caractères.</p>
                                </header>
                                <div className="px-6 py-6">
                                    <ChangePasswordForm />
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

function ChangePasswordForm() {
    const [formState, setFormState] = useState<PasswordFormState>({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (field: keyof PasswordFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        if (!formState.currentPassword || !formState.newPassword || !formState.confirmPassword) {
            setFormError("Veuillez renseigner tous les champs requis.");
            return;
        }

        if (formState.newPassword.length < 8) {
            setFormError("Le nouveau mot de passe doit contenir au moins 8 caractères.");
            return;
        }

        if (formState.newPassword !== formState.confirmPassword) {
            setFormError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setSubmitting(true);
            await authService.changePassword({
                current_password: formState.currentPassword,
                new_password: formState.newPassword,
            });

            setFormSuccess("Votre mot de passe a été mis à jour avec succès.");
            setFormState({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (error: any) {
            const message = error?.message || "Une erreur est survenue lors de la mise à jour du mot de passe.";
            setFormError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
                <div className=" border border-rose-400 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {formError}
                </div>
            )}

            {formSuccess && (
                <div className=" border border-emerald-400 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {formSuccess}
                </div>
            )}

            <div className="flex flex-col gap-2">
                <label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">
                    Mot de passe actuel
                </label>
                <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={formState.currentPassword}
                    onChange={(event) => handleChange("currentPassword", event.target.value)}
                    placeholder="••••••••"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
                    Nouveau mot de passe
                </label>
                <input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={formState.newPassword}
                    onChange={(event) => handleChange("newPassword", event.target.value)}
                    placeholder="Au moins 8 caractères"
                />
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
                    Confirmer le nouveau mot de passe
                </label>
                <input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    value={formState.confirmPassword}
                    onChange={(event) => handleChange("confirmPassword", event.target.value)}
                    placeholder="Répétez le mot de passe"
                />
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center  bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
                {submitting ? (
                    <span className="flex items-center gap-2">
                        <ClipLoader size={16} color="#ffffff" speedMultiplier={1.5} />
                        Mise à jour...
                    </span>
                ) : (
                    "Enregistrer"
                )}
            </button>
        </form>
    );
}

