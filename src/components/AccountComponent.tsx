import { useCallback, useEffect, useMemo, useState } from "react";
import type{ FormEvent } from "react";
import { ClipLoader } from "react-spinners";
import { USER_STORAGE_KEY } from "../secure/storageKeys";
import { authService } from "../services/auth/auth.service";
import { rhServiceFront } from "../services/rh/rh.service";
import type { UpdatePersonalInfoDto } from "../types/validation.dto";

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

interface ProfileFormState {
    telephone_travail: string;
    telephone_personnel: string;
    ville_personnel: string;
    telephone_contact_urgence: string;
    nom_contact_urgence: string;
    date_naissance: string;
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

                            {userData && (
                                <section className="bg-white border border-gray-200  shadow-sm overflow-hidden">
                                    <header className="px-6 py-4 border-b border-gray-100">
                                        <h2 className="text-lg font-semibold text-gray-800">Modifier mes informations</h2>
                                        <p className="text-sm text-gray-500">Mettez à jour vos informations personnelles et de contact.</p>
                                    </header>
                                    <div className="px-6 py-6">
                                        <UpdateProfileForm userId={userData.id} />
                                    </div>
                                </section>
                            )}

                            <section className="bg-white border border-gray-200  shadow-sm overflow-hidden">
                                <header className="px-6 py-4 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-800">Modifier le mot de passe</h2>
                                    <p className="text-sm text-gray-500">Choisissez un mot de passe solide. Il doit contenir au minimum 8 caractères.</p>
                                </header>
                                <div className="px-6 py-6">
                                    {userData && <ChangePasswordForm userId={userData.id} />}
                                </div>
                            </section>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}

function ChangePasswordForm({ userId }: { userId: string }) {
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

        if (formState.newPassword.length < 6) {
            setFormError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
            return;
        }

        if (formState.newPassword !== formState.confirmPassword) {
            setFormError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            setSubmitting(true);
            await authService.updatePassword(userId, {
                ancien_mot_de_passe: formState.currentPassword,
                nouveau_mot_de_passe: formState.newPassword,
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

function UpdateProfileForm({ userId }: { userId: string }) {
    const [formState, setFormState] = useState<ProfileFormState>({
        telephone_travail: "",
        telephone_personnel: "",
        ville_personnel: "",
        telephone_contact_urgence: "",
        nom_contact_urgence: "",
        date_naissance: "",
    });
    const [formError, setFormError] = useState<string | null>(null);
    const [formSuccess, setFormSuccess] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPersonnelData = async () => {
            try {
                setLoading(true);
                const personnelData = await rhServiceFront.getPersonnelById(userId);
                
                setFormState({
                    telephone_travail: personnelData?.telephone_travail || "",
                    telephone_personnel: personnelData?.telephone_personnel || "",
                    ville_personnel: personnelData?.ville_personnel || "",
                    telephone_contact_urgence: personnelData?.telephone_contact_urgence || "",
                    nom_contact_urgence: personnelData?.nom_contact_urgence || "",
                    date_naissance: personnelData?.date_naissance ? personnelData.date_naissance.split('T')[0] : "",
                });
            } catch (error: any) {
                console.error("Erreur lors du chargement des données du personnel :", error);
                setFormError("Impossible de charger les informations. Veuillez réessayer.");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            loadPersonnelData();
        }
    }, [userId]);

    const handleChange = (field: keyof ProfileFormState, value: string) => {
        setFormState((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormError(null);
        setFormSuccess(null);

        try {
            setSubmitting(true);
            
            const payload: UpdatePersonalInfoDto = {};
            if (formState.telephone_travail.trim()) payload.telephone_travail = formState.telephone_travail.trim();
            if (formState.telephone_personnel.trim()) payload.telephone_personnel = formState.telephone_personnel.trim();
            if (formState.ville_personnel.trim()) payload.ville_personnel = formState.ville_personnel.trim();
            if (formState.telephone_contact_urgence.trim()) payload.telephone_contact_urgence = formState.telephone_contact_urgence.trim();
            if (formState.nom_contact_urgence.trim()) payload.nom_contact_urgence = formState.nom_contact_urgence.trim();
            if (formState.date_naissance.trim()) payload.date_naissance = formState.date_naissance.trim();

            await authService.updatePersonalInfo(userId, payload);

            setFormSuccess("Vos informations ont été mises à jour avec succès.");
        } catch (error: any) {
            const message = error?.message || "Une erreur est survenue lors de la mise à jour des informations.";
            setFormError(message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <ClipLoader size={24} color="#27a082" speedMultiplier={1.5} />
            </div>
        );
    }

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="telephone_travail" className="text-sm font-medium text-gray-700">
                        Téléphone de travail
                    </label>
                    <input
                        id="telephone_travail"
                        type="tel"
                        className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={formState.telephone_travail}
                        onChange={(event) => handleChange("telephone_travail", event.target.value)}
                        placeholder="Ex: +33 1 23 45 67 89"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="telephone_personnel" className="text-sm font-medium text-gray-700">
                        Téléphone personnel
                    </label>
                    <input
                        id="telephone_personnel"
                        type="tel"
                        className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={formState.telephone_personnel}
                        onChange={(event) => handleChange("telephone_personnel", event.target.value)}
                        placeholder="Ex: +33 6 12 34 56 78"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="ville_personnel" className="text-sm font-medium text-gray-700">
                        Ville
                    </label>
                    <input
                        id="ville_personnel"
                        type="text"
                        className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={formState.ville_personnel}
                        onChange={(event) => handleChange("ville_personnel", event.target.value)}
                        placeholder="Ex: Paris"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="date_naissance" className="text-sm font-medium text-gray-700">
                        Date de naissance
                    </label>
                    <input
                        id="date_naissance"
                        type="date"
                        className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={formState.date_naissance}
                        onChange={(event) => handleChange("date_naissance", event.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="nom_contact_urgence" className="text-sm font-medium text-gray-700">
                        Nom du contact d'urgence
                    </label>
                    <input
                        id="nom_contact_urgence"
                        type="text"
                        className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={formState.nom_contact_urgence}
                        onChange={(event) => handleChange("nom_contact_urgence", event.target.value)}
                        placeholder="Ex: Jean Dupont"
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label htmlFor="telephone_contact_urgence" className="text-sm font-medium text-gray-700">
                        Téléphone du contact d'urgence
                    </label>
                    <input
                        id="telephone_contact_urgence"
                        type="tel"
                        className=" border border-gray-300 px-4 py-2.5 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        value={formState.telephone_contact_urgence}
                        onChange={(event) => handleChange("telephone_contact_urgence", event.target.value)}
                        placeholder="Ex: +33 6 12 34 56 78"
                    />
                </div>
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
                    "Enregistrer les modifications"
                )}
            </button>
        </form>
    );
}

