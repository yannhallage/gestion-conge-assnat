import { useEffect, useMemo, useState, useRef } from "react";
import type { ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useRhService } from "../../hooks/rh/useRhService";
import type {
  CreatePersonnelDto,
  RolePersonnel,
  Service,
  TypePersonnel,
  TypeContrat,
  StatutPersonnel,
  UpdatePersonnelDto,
} from "../../types/validation.dto";

type PersonnelForEdit = {
  id_personnel?: string;
  nom_personnel?: string;
  prenom_personnel?: string;
  email_travail?: string;
  email_personnel?: string;
  role_personnel?: RolePersonnel | string;
  type_personnel?: TypePersonnel | string;
  telephone_travail?: string;
  telephone_personnel?: string;
  telephone_contact_urgence?: string;
  nom_contact_urgence?: string;
  adresse_personnel?: string;
  ville_personnel?: string;
  codepostal?: string;
  pays_personnel?: string;
  date_naissance?: string;
  id_service?: string;
  matricule_personnel?: string;
  poste?: string;
  type_contrat?: TypeContrat | string;
  date_embauche?: string;
  date_fin_contrat?: string;
  salaire_base?: number;
  niveau_hierarchique?: string;
  numero_cnps?: string;
  banque_nom?: string;
  banque_rib?: string;
  statut_professionnel?: StatutPersonnel | string;
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  onCreated?: (personnel: unknown) => void;
  personnelToEdit?: PersonnelForEdit | null;
}

type PersonnelFormState = CreatePersonnelDto & {
  date_naissance?: string;
  date_embauche?: string;
  date_fin_contrat?: string;
};

const ROLES: RolePersonnel[] = ["ADMIN", "RH", "CHEF_SERVICE", "EMPLOYE"];
const TYPES: TypePersonnel[] = ["PERMANENT", "CONTRACTUEL", "STAGIAIRE"];
const TYPES_CONTRAT: TypeContrat[] = ["CDI", "CDD", "STAGE", "FREELANCE"];
const STATUTS_PROFESSIONNEL: StatutPersonnel[] = ["ACTIF", "SUSPENDU", "EN_CONGE", "DEMISSIONNE", "LICENCIE"];

export default function DrawerAddPersonne({ isOpen, onClose, services, onCreated, personnelToEdit }: DrawerProps) {
  const { createPersonnel, updatePersonnel } = useRhService();
  const isEditMode = !!personnelToEdit?.id_personnel;

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<PersonnelFormState>(() => initialFormState(services));

  useEffect(() => {
    if (isOpen) {
      setLoadingSkeleton(true);
      const timer = setTimeout(() => setLoadingSkeleton(false), 400);
      if (isEditMode && personnelToEdit) {
        setFormData(initialFormStateFromPersonnel(personnelToEdit, services));
      } else {
        setFormData(initialFormState(services));
      }
      setError(null);
      return () => clearTimeout(timer);
    }
  }, [isOpen, services, isEditMode, personnelToEdit]);

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

  const handleChange = (field: keyof PersonnelFormState, value: string | boolean | number | undefined) => {
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
      setError("Merci de renseigner au minimum le nom, le prénom et l'email professionnel.");
      return;
    }

    if (!isEditMode && (!formData.password || formData.password.length < 6)) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      if (isEditMode && personnelToEdit?.id_personnel) {
        const payload: UpdatePersonnelDto = {
          nom_personnel: formData.nom_personnel.trim(),
          prenom_personnel: formData.prenom_personnel.trim(),
          email_travail: formData.email_travail.trim(),
          email_personnel: formData.email_personnel?.trim() || undefined,
          matricule_personnel: formData.matricule_personnel?.trim() || undefined,
          telephone_travail: formData.telephone_travail?.trim() || undefined,
          telephone_personnel: formData.telephone_personnel?.trim() || undefined,
          role_personnel: formData.role_personnel,
          type_personnel: formData.type_personnel,
          ville_personnel: formData.ville_personnel?.trim() || undefined,
          adresse_personnel: formData.adresse_personnel?.trim() || undefined,
          codepostal: formData.codepostal?.trim() || undefined,
          pays_personnel: formData.pays_personnel?.trim() || undefined,
          poste: formData.poste?.trim() || undefined,
          type_contrat: formData.type_contrat,
          date_embauche: formData.date_embauche
            ? new Date(formData.date_embauche).toISOString()
            : undefined,
          date_fin_contrat: formData.date_fin_contrat
            ? new Date(formData.date_fin_contrat).toISOString()
            : undefined,
          salaire_base: formData.salaire_base || undefined,
          niveau_hierarchique: formData.niveau_hierarchique?.trim() || undefined,
          numero_cnps: formData.numero_cnps?.trim() || undefined,
          banque_nom: formData.banque_nom?.trim() || undefined,
          banque_rib: formData.banque_rib?.trim() || undefined,
          statut_professionnel: formData.statut_professionnel,
        };
        console.log(payload);
        const updated = await updatePersonnel(personnelToEdit.id_personnel, payload);
        toast.success("Personnel modifié avec succès !");
        if (onCreated && updated) {
          onCreated(updated);
        }
      } else {
        const payload: CreatePersonnelDto & { date_naissance?: string; date_embauche?: string; date_fin_contrat?: string } = {
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
          date_naissance: formData.date_naissance
            ? new Date(formData.date_naissance).toISOString()
            : undefined,
          poste: formData.poste?.trim() || undefined,
          type_contrat: formData.type_contrat || "CDI",
          date_embauche: formData.date_embauche
            ? new Date(formData.date_embauche).toISOString()
            : undefined,
          date_fin_contrat: formData.date_fin_contrat
            ? new Date(formData.date_fin_contrat).toISOString()
            : undefined,
          salaire_base: formData.salaire_base || undefined,
          niveau_hierarchique: formData.niveau_hierarchique?.trim() || undefined,
          numero_cnps: formData.numero_cnps?.trim() || undefined,
          banque_nom: formData.banque_nom?.trim() || undefined,
          banque_rib: formData.banque_rib?.trim() || undefined,
          statut_professionnel: formData.statut_professionnel || "ACTIF",
        };

        const created = await createPersonnel(payload);
        toast.success("Personnel enregistré avec succès !");
        if (onCreated && created) {
          onCreated(created);
        }
      }
      handleClose();
    } catch (err: any) {
      const message = err?.message || (isEditMode ? "Impossible de modifier le personnel." : "Impossible d'enregistrer le personnel.");
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
              className="bg-[#27a082] hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <ClipLoader
                    color="#ffffff"
                    loading={submitting}
                    size={16}
                    speedMultiplier={3}
                    aria-label="Chargement..."
                  />
                  <span>Enregistrement...</span>
                </>
              ) : (
                "✓ Save"
              )}
            </button>
            <h1 className="text-xl font-normal text-gray-700">{isEditMode ? "Modifier l'employé" : "Nouvel employé"}</h1>
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
                {!isEditMode && (
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
                )}
                <FormRow
                  label="Date de naissance"
                  input={
                    <input
                      type="date"
                      value={formData.date_naissance ?? ""}
                      onChange={(e) => handleChange("date_naissance", e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Matricule"
                  input={
                    <input
                      type="text"
                      value={formData.matricule_personnel ?? ""}
                      onChange={(e) => handleChange("matricule_personnel", e.target.value)}
                      placeholder="Matricule du personnel"
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
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Adresse</h2>
                <FormRow
                  label="Adresse"
                  input={
                    <input
                      type="text"
                      value={formData.adresse_personnel ?? ""}
                      onChange={(e) => handleChange("adresse_personnel", e.target.value)}
                      placeholder="Adresse complète"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Ville"
                  input={
                    <input
                      type="text"
                      value={formData.ville_personnel ?? ""}
                      onChange={(e) => handleChange("ville_personnel", e.target.value)}
                      placeholder="Ville"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Code postal"
                  input={
                    <input
                      type="text"
                      value={formData.codepostal ?? ""}
                      onChange={(e) => handleChange("codepostal", e.target.value)}
                      placeholder="Code postal"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Pays"
                  input={
                    <CustomSelect
                      value={formData.pays_personnel ?? ""}
                      onChange={(value) => handleChange("pays_personnel", value)}
                      placeholder="Sélectionner un pays"
                      options={[
                        { value: "Côte d'Ivoire", label: "Côte d'Ivoire" },
                        { value: "France", label: "France" },
                        { value: "Sénégal", label: "Sénégal" },
                        { value: "Mali", label: "Mali" },
                        { value: "Burkina Faso", label: "Burkina Faso" },
                        { value: "Niger", label: "Niger" },
                        { value: "Guinée", label: "Guinée" },
                        { value: "Ghana", label: "Ghana" },
                        { value: "Nigeria", label: "Nigeria" },
                        { value: "Cameroun", label: "Cameroun" },
                        { value: "Gabon", label: "Gabon" },
                        { value: "Congo", label: "Congo" },
                        { value: "Togo", label: "Togo" },
                        { value: "Bénin", label: "Bénin" },
                        { value: "Maroc", label: "Maroc" },
                        { value: "Algérie", label: "Algérie" },
                        { value: "Tunisie", label: "Tunisie" },
                        { value: "Belgique", label: "Belgique" },
                        { value: "Suisse", label: "Suisse" },
                        { value: "Canada", label: "Canada" },
                      ]}
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
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Contact d'urgence</h2>
                <FormRow
                  label="Nom"
                  input={
                    <input
                      type="text"
                      value={formData.nom_contact_urgence ?? ""}
                      onChange={(e) => handleChange("nom_contact_urgence", e.target.value)}
                      placeholder="Nom du contact d'urgence"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Téléphone d'urgence"
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

              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations professionnelles</h2>
                <FormRow
                  label="Poste"
                  input={
                    <input
                      type="text"
                      value={formData.poste ?? ""}
                      onChange={(e) => handleChange("poste", e.target.value)}
                      placeholder="Poste occupé"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Type de contrat"
                  required
                  input={
                    <select
                      value={formData.type_contrat ?? "CDI"}
                      onChange={(e) => handleChange("type_contrat", e.target.value as TypeContrat)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      {TYPES_CONTRAT.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  }
                />
                <FormRow
                  label="Date d'embauche"
                  input={
                    <input
                      type="date"
                      value={formData.date_embauche ?? ""}
                      onChange={(e) => handleChange("date_embauche", e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Date de fin de contrat"
                  input={
                    <input
                      type="date"
                      value={formData.date_fin_contrat ?? ""}
                      onChange={(e) => handleChange("date_fin_contrat", e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Salaire de base"
                  input={
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salaire_base ?? ""}
                      onChange={(e) => handleChange("salaire_base", e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="0.00"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Niveau hiérarchique"
                  input={
                    <input
                      type="text"
                      value={formData.niveau_hierarchique ?? ""}
                      onChange={(e) => handleChange("niveau_hierarchique", e.target.value)}
                      placeholder="Niveau hiérarchique"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Numéro CNPS"
                  input={
                    <input
                      type="text"
                      value={formData.numero_cnps ?? ""}
                      onChange={(e) => handleChange("numero_cnps", e.target.value)}
                      placeholder="Numéro CNPS"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="Statut professionnel"
                  required
                  input={
                    <select
                      value={formData.statut_professionnel ?? "ACTIF"}
                      onChange={(e) => handleChange("statut_professionnel", e.target.value as StatutPersonnel)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      {STATUTS_PROFESSIONNEL.map((statut) => (
                        <option key={statut} value={statut}>
                          {statut}
                        </option>
                      ))}
                    </select>
                  }
                />
              </section>

              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations bancaires</h2>
                <FormRow
                  label="Nom de la banque"
                  input={
                    <input
                      type="text"
                      value={formData.banque_nom ?? ""}
                      onChange={(e) => handleChange("banque_nom", e.target.value)}
                      placeholder="Nom de la banque"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  }
                />
                <FormRow
                  label="RIB"
                  input={
                    <input
                      type="text"
                      value={formData.banque_rib ?? ""}
                      onChange={(e) => handleChange("banque_rib", e.target.value)}
                      placeholder="Numéro RIB"
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
    date_naissance: "",
    role_personnel: "EMPLOYE",
    type_personnel: "PERMANENT",
    id_service: defaultServiceId,
    poste: "",
    type_contrat: "CDI",
    date_embauche: "",
    date_fin_contrat: "",
    salaire_base: undefined,
    niveau_hierarchique: "",
    numero_cnps: "",
    banque_nom: "",
    banque_rib: "",
    statut_professionnel: "ACTIF",
  };
}

function initialFormStateFromPersonnel(personnel: PersonnelForEdit, services: Service[]): PersonnelFormState {
  const defaultServiceId = services[0]?.id_service ?? "";

  // Formater la date de naissance pour l'input date (format YYYY-MM-DD)
  const formatDateForInput = (dateString?: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch {
      return "";
    }
  };

  return {
    nom_personnel: personnel.nom_personnel ?? "",
    prenom_personnel: personnel.prenom_personnel ?? "",
    email_travail: personnel.email_travail ?? "",
    email_personnel: personnel.email_personnel ?? "",
    password: "", // Pas de mot de passe en mode édition
    matricule_personnel: personnel.matricule_personnel ?? "",
    telephone_travail: personnel.telephone_travail ?? "",
    telephone_personnel: personnel.telephone_personnel ?? "",
    ville_personnel: personnel.ville_personnel ?? "",
    adresse_personnel: personnel.adresse_personnel ?? "",
    codepostal: personnel.codepostal ?? "",
    pays_personnel: personnel.pays_personnel ?? "",
    telephone_contact_urgence: personnel.telephone_contact_urgence ?? "",
    nom_contact_urgence: personnel.nom_contact_urgence ?? "",
    date_naissance: formatDateForInput(personnel.date_naissance),
    role_personnel: (personnel.role_personnel as RolePersonnel) ?? "EMPLOYE",
    type_personnel: (personnel.type_personnel as TypePersonnel) ?? "PERMANENT",
    id_service: personnel.id_service ?? defaultServiceId,
    poste: personnel.poste ?? "",
    type_contrat: (personnel.type_contrat as TypeContrat) ?? "CDI",
    date_embauche: formatDateForInput(personnel.date_embauche),
    date_fin_contrat: formatDateForInput(personnel.date_fin_contrat),
    salaire_base: personnel.salaire_base ?? undefined,
    niveau_hierarchique: personnel.niveau_hierarchique ?? "",
    numero_cnps: personnel.numero_cnps ?? "",
    banque_nom: personnel.banque_nom ?? "",
    banque_rib: personnel.banque_rib ?? "",
    statut_professionnel: (personnel.statut_professionnel as StatutPersonnel) ?? "ACTIF",
  };
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
}

function CustomSelect({ value, onChange, options, placeholder = "Sélectionner", className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div ref={selectRef} className={`relative flex-1 ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200 flex items-center justify-between ${
          isOpen ? "ring-2 ring-teal-500 border-teal-500" : "hover:border-gray-400"
        }`}
      >
        <span className={selectedOption ? "text-gray-700" : "text-gray-400"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2.5 text-left hover:bg-teal-50 transition-colors duration-150 flex items-center ${
                value === option.value ? "bg-teal-50 text-teal-700 font-medium" : "text-gray-700"
              }`}
            >
              {value === option.value && (
                <svg
                  className="w-4 h-4 mr-2 text-teal-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span className={value === option.value ? "" : "ml-6"}>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
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
