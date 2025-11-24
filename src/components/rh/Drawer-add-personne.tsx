import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useRhService } from "../../hooks/rh/useRhService";
import type {
  CreatePersonnelDto,
  RolePersonnel,
  Service,
  TypePersonnel,
} from "../../types/validation.dto";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onCreated?: (personnel: unknown) => void;
}

type PersonnelFormState = CreatePersonnelDto;

const ROLES: RolePersonnel[] = ["ADMIN", "RH", "CHEF_SERVICE", "EMPLOYE"];
const TYPES: TypePersonnel[] = ["PERMANENT", "CONTRACTUEL", "STAGIAIRE"];

export default function DrawerAddPersonne({ isOpen, onClose, services, onCreated }: DrawerProps) {
  const { createPersonnel } = useRhService();

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PersonnelFormState>(() => initialFormState(services));

  useEffect(() => {
    if (isOpen) {
      setLoadingSkeleton(true);
      const timer = setTimeout(() => setLoadingSkeleton(false), 400);
      setFormData(initialFormState(services));
      setError(null);
      return () => clearTimeout(timer);
    }
  }, [isOpen, services]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        value: service.id_service,
        label: service.nom_service,
      })),
    [services]
  );

  const handleChange = (field: keyof PersonnelFormState, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    if (!formData.nom_personnel.trim() || !formData.prenom_personnel.trim() || !formData.email_travail.trim()) {
      setError("Merci de renseigner au minimum le nom, le prénom et l’email professionnel.");
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      const payload: CreatePersonnelDto = {
        ...formData,
        nom_personnel: formData.nom_personnel.trim(),
        prenom_personnel: formData.prenom_personnel.trim(),
        email_travail: formData.email_travail.trim(),
        email_personnel: formData.email_personnel?.trim() || undefined,
        matricule_personnel: formData.matricule_personnel?.trim() || undefined,
        telephone_travail: formData.telephone_travail?.trim() || undefined,
        telephone_personnel: formData.telephone_personnel?.trim() || undefined,
        telephone_contact_urgence: formData.telephone_contact_urgence?.trim() || undefined,
        nom_contact_urgence: formData.nom_contact_urgence?.trim() || undefined,
        ville_personnel: formData.ville_personnel?.trim() || undefined,
        adresse_personnel: formData.adresse_personnel?.trim() || undefined,
        codepostal: formData.codepostal?.trim() || undefined,
        pays_personnel: formData.pays_personnel?.trim() || undefined,
      };

      const created = await createPersonnel(payload);
      toast.success("Personnel enregistré avec succès !");
      if (onCreated && created) {
        onCreated(created);
      }
      handleClose();
    } catch (err: any) {
      const message = err?.message || "Impossible d'enregistrer le personnel.";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-[#27a082] hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "Enregistrement..." : "✓ Save"}
            </button>
            <h1 className="text-xl font-normal text-gray-700">Nouvel employé</h1>
          </div>

          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl">
            ✕
          </button>
        </header>

        <div className="flex h-full overflow-hidden relative">
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
            <main className="flex-1 p-8 overflow-y-auto space-y-6">
              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations personnelles</h2>
                <FormRow
                  label="Nom"
                  required
                  input={
                    <input
                      type="text"
                      value={formData.nom_personnel}
                      onChange={(e) => handleChange("nom_personnel", e.target.value)}
                      placeholder="Entrer le nom"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Prénom"
                  required
                  input={
                    <input
                      type="text"
                      value={formData.prenom_personnel}
                      onChange={(e) => handleChange("prenom_personnel", e.target.value)}
                      placeholder="Entrer le prénom"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Email professionnel"
                  required
                  input={
                    <input
                      type="email"
                      value={formData.email_travail}
                      onChange={(e) => handleChange("email_travail", e.target.value)}
                      placeholder="prenom.nom@organisation.com"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Email personnel"
                  input={
                    <input
                      type="email"
                      value={formData.email_personnel ?? ""}
                      onChange={(e) => handleChange("email_personnel", e.target.value)}
                      placeholder="Adresse personnelle (optionnel)"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Mot de passe"
                  required
                  input={
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      placeholder="••••••"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
              </section>

              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Coordonnées</h2>
                <FormRow
                  label="Téléphone professionnel"
                  input={
                    <input
                      type="tel"
                      value={formData.telephone_travail ?? ""}
                      onChange={(e) => handleChange("telephone_travail", e.target.value)}
                      placeholder="+1 555 123 456"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Téléphone personnel"
                  input={
                    <input
                      type="tel"
                      value={formData.telephone_personnel ?? ""}
                      onChange={(e) => handleChange("telephone_personnel", e.target.value)}
                      placeholder="+1 555 987 654"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
              </section>

              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Affectation</h2>
                <FormRow
                  label="Rôle"
                  required
                  input={
                    <select
                      value={formData.role_personnel}
                      onChange={(e) => handleChange("role_personnel", e.target.value as RolePersonnel)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  }
                />
                <FormRow
                  label="Type"
                  required
                  input={
                    <select
                      value={formData.type_personnel}
                      onChange={(e) => handleChange("type_personnel", e.target.value as TypePersonnel)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      {TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  }
                />
                <FormRow
                  label="Service"
                  required
                  input={
                    <select
                      value={formData.id_service}
                      onChange={(e) => handleChange("id_service", e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      <option value="">Sélectionner un service</option>
                      {serviceOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  }
                />
              </section>

              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Contact d’urgence</h2>
                <FormRow
                  label="Nom"
                  input={
                    <input
                      type="text"
                      value={formData.nom_contact_urgence ?? ""}
                      onChange={(e) => handleChange("nom_contact_urgence", e.target.value)}
                      placeholder="Nom du contact d’urgence"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Téléphone d’urgence"
                  input={
                    <input
                      type="tel"
                      value={formData.telephone_contact_urgence ?? ""}
                      onChange={(e) => handleChange("telephone_contact_urgence", e.target.value)}
                      placeholder="+1 555 111 999"
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
          )}
        </div>
      </div>
    </>
  );
}

function initialFormState(services: Service[]): PersonnelFormState {
  const defaultServiceId = services[0]?.id_service ?? "";

  return {
    nom_personnel: "",
    prenom_personnel: "",
    email_travail: "",
    email_personnel: "",
    password: "",
    matricule_personnel: "",
    telephone_travail: "",
    telephone_personnel: "",
    ville_personnel: "",
    adresse_personnel: "",
    codepostal: "",
    pays_personnel: "",
    telephone_contact_urgence: "",
    nom_contact_urgence: "",
    role_personnel: "EMPLOYE",
    type_personnel: "PERMANENT",
    id_service: defaultServiceId,
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
