import { useState, useEffect } from "react";
import { useAuth } from "../../../../contexts/AuthContext";
import { useUserService } from "../../../../hooks/employes/useUserService";
import { ClipLoader } from "react-spinners";
import { Calendar, Camera } from "lucide-react";
import { toast } from "sonner";

const ProfilFeature = () => {
    const { user } = useAuth();
    const userId = user?.id ?? null;
    const { loading: serviceLoading } = useUserService(userId);
    const [loading, setLoading] = useState(true);
    const [personnelData, setPersonnelData] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const fetchPersonnelData = async () => {
            if (!userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Ici, vous devrez créer une méthode pour récupérer les données du personnel
                // Pour l'instant, on utilise les données de l'utilisateur connecté
                const fullName = `${user?.prenom || ""} ${user?.nom || ""}`.trim();
                const initials = fullName
                    .split(" ")
                    .filter(Boolean)
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "??";

                setPersonnelData({
                    nom_personnel: user?.nom || "",
                    prenom_personnel: user?.prenom || "",
                    email_travail: user?.email_personnel || "",
                    initials,
                });
            } catch (err: any) {
                toast.error(err?.message || "Erreur lors du chargement du profil");
            } finally {
                setLoading(false);
            }
        };

        fetchPersonnelData();
    }, [userId, user]);

    const handleSave = async () => {
        try {
            // Ici, vous devrez créer une méthode pour sauvegarder les modifications
            toast.success("Profil mis à jour avec succès");
            setIsEditing(false);
        } catch (err: any) {
            toast.error(err?.message || "Erreur lors de la mise à jour du profil");
        }
    };

    if (loading || serviceLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <ClipLoader color="#27a082" loading={loading} size={29} />
            </div>
        );
    }

    const fullName = `${personnelData?.prenom_personnel || ""} ${personnelData?.nom_personnel || ""}`.trim() || "Utilisateur";
    const initials = personnelData?.initials || "??";

    return (
        <div className="h-full flex flex-col bg-white">
            <header className="flex items-center justify-between border-b border-gray-200 px-5 py-3">
                <h1 className="text-xl text-gray-800">Mon Profil</h1>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="rounded bg-[#27a082] px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
                    >
                        Modifier
                    </button>
                ) : (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="rounded border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            className="rounded bg-[#27a082] px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-600"
                        >
                            Enregistrer
                        </button>
                    </div>
                )}
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="mx-auto max-w-4xl">
                    {/* Section Photo */}
                    <div className="mb-8 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
                        <div className="flex flex-col items-center">
                            {/* Photo de profil */}
                            <div className="relative mb-6">
                                <div className="flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 text-4xl font-bold text-emerald-700">
                                    {initials}
                                </div>
                                {isEditing && (
                                    <button
                                        type="button"
                                        className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-[#27a082] text-white shadow-lg transition hover:bg-teal-600"
                                    >
                                        <Camera className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            {/* Texte descriptif */}
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-gray-800 mb-2">{fullName}</h2>
                                <p className="text-gray-500 mb-3">{personnelData?.email_travail || ""}</p>
                                <p className="text-sm text-gray-600 max-w-md">
                                    Bienvenue sur votre profil. Ici, vous pouvez consulter et modifier vos informations personnelles, 
                                    vos coordonnées et vos préférences. Gardez vos données à jour pour faciliter la communication 
                                    et la gestion de vos demandes.
                                </p>
                            </div>

                            {/* Footer avec date de création */}
                            <div className="mt-8 w-full border-t border-gray-200 pt-4">
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <Calendar className="h-4 w-4" />
                                    <span>Compte créé le {new Date().toLocaleDateString("fr-FR", { 
                                        day: "2-digit", 
                                        month: "long", 
                                        year: "numeric" 
                                    })}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilFeature;

