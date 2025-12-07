import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useRhService } from "../../hooks/rh/useRhService";
import type {
  CreateContratDto,
  UpdateContratDto,
  CreatePaieDto,
  UpdatePaieDto,
  TypeContratEnum,
} from "../../types/validation.dto";

type ContratForEdit = {
  id_contrat?: string;
  type_contrat?: TypeContratEnum | string;
  date_debut?: string;
  date_fin?: string;
  salaire_reference?: number;
  url_contrat?: string;
  statut?: string;
  id_personnel?: string;
};

type PaieForEdit = {
  id_paie?: string;
  mois?: number;
  annee?: number;
  salaire_net?: number;
  salaire_brut?: number;
  primes?: number;
  deductions?: number;
  url_bulletin?: string;
  id_personnel?: string;
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  idPersonnel: string;
  nomPersonnel?: string;
  prenomPersonnel?: string;
  contratToEdit?: ContratForEdit | null;
  paieToEdit?: PaieForEdit | null;
  mode: "contrat" | "paie";
  onCreated?: (data: unknown) => void;
}

const TYPES_CONTRAT: TypeContratEnum[] = ["CDI", "CDD", "STAGE", "CONSULTANT"];
const MOIS = [
  { value: 1, label: "Janvier" },
  { value: 2, label: "Février" },
  { value: 3, label: "Mars" },
  { value: 4, label: "Avril" },
  { value: 5, label: "Mai" },
  { value: 6, label: "Juin" },
  { value: 7, label: "Juillet" },
  { value: 8, label: "Août" },
  { value: 9, label: "Septembre" },
  { value: 10, label: "Octobre" },
  { value: 11, label: "Novembre" },
  { value: 12, label: "Décembre" },
];

export default function DrawerContratPaie({
  isOpen,
  onClose,
  idPersonnel,
  nomPersonnel,
  prenomPersonnel,
  contratToEdit,
  paieToEdit,
  mode,
  onCreated,
}: DrawerProps) {
  const { createContrat, updateContrat, createPaie, updatePaie } = useRhService();
  const isEditMode = mode === "contrat" ? !!contratToEdit?.id_contrat : !!paieToEdit?.id_paie;

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État pour les fichiers sélectionnés
  const [selectedContratFile, setSelectedContratFile] = useState<File | null>(null);
  const [selectedPaieFile, setSelectedPaieFile] = useState<File | null>(null);

  // État pour le formulaire contrat
  const [contratData, setContratData] = useState({
    type_contrat: "CDI" as TypeContratEnum,
    date_debut: "",
    date_fin: "",
    salaire_reference: undefined as number | undefined,
    url_contrat: "",
    statut: "",
  });

  // État pour le formulaire paie
  const [paieData, setPaieData] = useState({
    mois: new Date().getMonth() + 1,
    annee: new Date().getFullYear(),
    salaire_net: undefined as number | undefined,
    salaire_brut: undefined as number | undefined,
    primes: undefined as number | undefined,
    deductions: undefined as number | undefined,
    url_bulletin: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingSkeleton(true);
      const timer = setTimeout(() => setLoadingSkeleton(false), 400);
      if (mode === "contrat" && isEditMode && contratToEdit) {
        setContratData({
          type_contrat: (contratToEdit.type_contrat as TypeContratEnum) || "CDI",
          date_debut: formatDateForInput(contratToEdit.date_debut),
          date_fin: formatDateForInput(contratToEdit.date_fin),
          salaire_reference: contratToEdit.salaire_reference,
          url_contrat: contratToEdit.url_contrat || "",
          statut: contratToEdit.statut || "",
        });
        setSelectedContratFile(null);
      } else if (mode === "contrat") {
        setContratData({
          type_contrat: "CDI",
          date_debut: "",
          date_fin: "",
          salaire_reference: undefined,
          url_contrat: "",
          statut: "",
        });
        setSelectedContratFile(null);
      }

      if (mode === "paie" && isEditMode && paieToEdit) {
        setPaieData({
          mois: paieToEdit.mois || new Date().getMonth() + 1,
          annee: paieToEdit.annee || new Date().getFullYear(),
          salaire_net: paieToEdit.salaire_net,
          salaire_brut: paieToEdit.salaire_brut,
          primes: paieToEdit.primes,
          deductions: paieToEdit.deductions,
          url_bulletin: paieToEdit.url_bulletin || "",
        });
        setSelectedPaieFile(null);
      } else if (mode === "paie") {
        setPaieData({
          mois: new Date().getMonth() + 1,
          annee: new Date().getFullYear(),
          salaire_net: undefined,
          salaire_brut: undefined,
          primes: undefined,
          deductions: undefined,
          url_bulletin: "",
        });
        setSelectedPaieFile(null);
      }
      setError(null);
      return () => clearTimeout(timer);
    }
  }, [isOpen, mode, isEditMode, contratToEdit, paieToEdit]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

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

  const handleContratChange = (field: keyof typeof contratData, value: string | number | undefined) => {
    setContratData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePaieChange = (field: keyof typeof paieData, value: string | number | undefined) => {
    setPaieData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  // Fonction pour formater la date au format ISO 8601 (YYYY-MM-DD)
  const formatDateToISO = (dateString: string): string => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      // Format YYYY-MM-DD pour le backend
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch {
      return "";
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (mode === "contrat") {
        if (!contratData.date_debut || !contratData.type_contrat) {
          setError("Merci de renseigner au minimum le type de contrat et la date de début.");
          return;
        }

        // Validation et formatage de la date de début
        if (!contratData.date_debut) {
          setError("La date de début est requise.");
          return;
        }
        const dateDebutFormatted = formatDateToISO(contratData.date_debut);
        if (!dateDebutFormatted) {
          setError("La date de début n'est pas valide.");
          return;
        }

        if (isEditMode && contratToEdit?.id_contrat) {
          // Pour la mise à jour, on n'envoie pas de fichier (le backend ne le gère peut-être pas)
          const payload: UpdateContratDto = {
            type_contrat: contratData.type_contrat,
            date_debut: dateDebutFormatted,
            ...(contratData.date_fin && {
              date_fin: formatDateToISO(contratData.date_fin),
            }),
            ...(contratData.salaire_reference !== undefined && {
              salaire_reference: contratData.salaire_reference,
            }),
            ...(contratData.statut?.trim() && {
              statut: contratData.statut.trim(),
            }),
          };
          const updated = await updateContrat(contratToEdit.id_contrat, payload);
          toast.success("Contrat modifié avec succès !");
          if (onCreated && updated) {
            onCreated(updated);
          }
        } else {
          // Pour la création, le fichier PDF est requis
          if (!selectedContratFile) {
            setError("Le fichier PDF du contrat est requis.");
            return;
          }

          // Vérifier que le fichier est un PDF
          if (selectedContratFile.type !== "application/pdf") {
            setError("Seuls les fichiers PDF sont autorisés.");
            return;
          }

          const payload: CreateContratDto = {
            type_contrat: contratData.type_contrat,
            date_debut: dateDebutFormatted,
            ...(contratData.date_fin && {
              date_fin: formatDateToISO(contratData.date_fin),
            }),
            ...(contratData.salaire_reference !== undefined && {
              salaire_reference: contratData.salaire_reference,
            }),
            ...(contratData.statut?.trim() && {
              statut: contratData.statut.trim(),
            }),
            id_personnel: idPersonnel,
          };
          
          const created = await createContrat(payload, selectedContratFile);
          toast.success("Contrat enregistré avec succès !");
          if (onCreated && created) {
            onCreated(created);
          }
        }
      } else if (mode === "paie") {
        if (!paieData.mois || !paieData.annee || paieData.salaire_net === undefined || paieData.salaire_brut === undefined) {
          setError("Merci de renseigner au minimum le mois, l'année, le salaire net et le salaire brut.");
          return;
        }

        if (isEditMode && paieToEdit?.id_paie) {
          const payload: UpdatePaieDto = {
            mois: paieData.mois,
            annee: paieData.annee,
            salaire_net: paieData.salaire_net,
            salaire_brut: paieData.salaire_brut,
            ...(paieData.primes !== undefined && {
              primes: paieData.primes,
            }),
            ...(paieData.deductions !== undefined && {
              deductions: paieData.deductions,
            }),
          };
          const updated = await updatePaie(paieToEdit.id_paie, payload);
          toast.success("Paie modifiée avec succès !");
          if (onCreated && updated) {
            onCreated(updated);
          }
        } else {
          // Pour la création, le fichier PDF est requis
          if (!selectedPaieFile) {
            setError("Le fichier PDF du bulletin de paie est requis.");
            return;
          }

          // Vérifier que le fichier est un PDF
          if (selectedPaieFile.type !== "application/pdf") {
            setError("Seuls les fichiers PDF sont autorisés.");
            return;
          }

          const payload: CreatePaieDto = {
            mois: paieData.mois,
            annee: paieData.annee,
            salaire_net: paieData.salaire_net!,
            salaire_brut: paieData.salaire_brut!,
            ...(paieData.primes !== undefined && {
              primes: paieData.primes,
            }),
            ...(paieData.deductions !== undefined && {
              deductions: paieData.deductions,
            }),
            id_personnel: idPersonnel,
          };
          const created = await createPaie(payload, selectedPaieFile);
          toast.success("Paie enregistrée avec succès !");
          if (onCreated && created) {
            onCreated(created);
          }
        }
      }
      handleClose();
    } catch (err: any) {
      const message = err?.message || (isEditMode ? "Impossible de modifier." : "Impossible d'enregistrer.");
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const title = mode === "contrat" 
    ? (isEditMode ? "Modifier le contrat" : "Nouveau contrat")
    : (isEditMode ? "Modifier la paie" : "Nouvelle paie");

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
            <h1 className="text-xl font-normal text-gray-700">{title}</h1>
            {(nomPersonnel || prenomPersonnel) && (
              <span className="text-sm text-gray-500">
                - {prenomPersonnel} {nomPersonnel}
              </span>
            )}
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
              {mode === "contrat" ? (
                <section className="bg-white space-y-5">
                  <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations du contrat</h2>
                  <FormRow
                    label="Type de contrat"
                    required
                    input={
                      <select
                        value={contratData.type_contrat}
                        onChange={(e) => handleContratChange("type_contrat", e.target.value as TypeContratEnum)}
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
                    label="Date de début"
                    required
                    input={
                      <input
                        type="date"
                        value={contratData.date_debut}
                        onChange={(e) => handleContratChange("date_debut", e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Date de fin"
                    input={
                      <input
                        type="date"
                        value={contratData.date_fin}
                        onChange={(e) => handleContratChange("date_fin", e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Salaire de référence"
                    input={
                      <input
                        type="number"
                        step="0.01"
                        value={contratData.salaire_reference ?? ""}
                        onChange={(e) => handleContratChange("salaire_reference", e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Document du contrat"
                    input={
                      <FileUpload
                        selectedFile={selectedContratFile}
                        existingFileUrl={contratData.url_contrat}
                        onFileSelect={(file) => setSelectedContratFile(file)}
                        onFileRemove={() => {
                          setSelectedContratFile(null);
                          handleContratChange("url_contrat", "");
                        }}
                        accept=".pdf,application/pdf"
                        label="Sélectionner un document PDF"
                      />
                    }
                  />
                  <FormRow
                    label="Statut"
                    input={
                      <input
                        type="text"
                        value={contratData.statut}
                        onChange={(e) => handleContratChange("statut", e.target.value)}
                        placeholder="Statut du contrat"
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                </section>
              ) : (
                <section className="bg-white space-y-5">
                  <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations de la paie</h2>
                  <FormRow
                    label="Mois"
                    required
                    input={
                      <select
                        value={paieData.mois}
                        onChange={(e) => handlePaieChange("mois", parseInt(e.target.value))}
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      >
                        {MOIS.map((mois) => (
                          <option key={mois.value} value={mois.value}>
                            {mois.label}
                          </option>
                        ))}
                      </select>
                    }
                  />
                  <FormRow
                    label="Année"
                    required
                    input={
                      <input
                        type="number"
                        min="2000"
                        value={paieData.annee}
                        onChange={(e) => handlePaieChange("annee", parseInt(e.target.value))}
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Salaire brut"
                    required
                    input={
                      <input
                        type="number"
                        step="0.01"
                        value={paieData.salaire_brut ?? ""}
                        onChange={(e) => handlePaieChange("salaire_brut", e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Salaire net"
                    required
                    input={
                      <input
                        type="number"
                        step="0.01"
                        value={paieData.salaire_net ?? ""}
                        onChange={(e) => handlePaieChange("salaire_net", e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Primes"
                    input={
                      <input
                        type="number"
                        step="0.01"
                        value={paieData.primes ?? ""}
                        onChange={(e) => handlePaieChange("primes", e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Déductions"
                    input={
                      <input
                        type="number"
                        step="0.01"
                        value={paieData.deductions ?? ""}
                        onChange={(e) => handlePaieChange("deductions", e.target.value ? parseFloat(e.target.value) : undefined)}
                        placeholder="0.00"
                        className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                      />
                    }
                  />
                  <FormRow
                    label="Bulletin de paie"
                    required
                    input={
                      <FileUpload
                        selectedFile={selectedPaieFile}
                        existingFileUrl={paieData.url_bulletin}
                        onFileSelect={(file) => setSelectedPaieFile(file)}
                        onFileRemove={() => {
                          setSelectedPaieFile(null);
                          handlePaieChange("url_bulletin", "");
                        }}
                        accept=".pdf,application/pdf"
                        label="Sélectionner un bulletin PDF"
                      />
                    }
                  />
                </section>
              )}

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

interface FileUploadProps {
  selectedFile: File | null;
  existingFileUrl?: string;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  accept?: string;
  label?: string;
}

function FileUpload({
  selectedFile,
  existingFileUrl,
  onFileSelect,
  onFileRemove,
  accept = ".pdf,.doc,.docx",
  label = "Sélectionner un fichier",
}: FileUploadProps) {
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Vérifier la taille du fichier (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximale : 10MB");
        return;
      }
      // Vérifier que le fichier est un PDF si accept contient "application/pdf"
      if (accept.includes("application/pdf") && file.type !== "application/pdf") {
        toast.error("Seuls les fichiers PDF sont autorisés.");
        return;
      }
      onFileSelect(file);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const getFileName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      return pathname.split("/").pop() || "document";
    } catch {
      return url.split("/").pop() || "document";
    }
  };

  return (
    <div className="flex-1">
      <input
        ref={(el) => setFileInput(el)}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
        id="file-upload-input"
      />
      
      {selectedFile ? (
        <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onFileRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Supprimer le fichier"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : existingFileUrl ? (
        <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-blue-500 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-700 truncate">
                  {getFileName(existingFileUrl)}
                </p>
                <p className="text-xs text-blue-500">Fichier existant</p>
              </div>
            </div>
          </div>
          <a
            href={existingFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Télécharger le fichier"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
          </a>
          <button
            type="button"
            onClick={onFileRemove}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Supprimer le fichier"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInput?.click()}
          className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-teal-500 hover:bg-teal-50 transition-colors flex items-center justify-center gap-2 text-gray-600 hover:text-teal-600"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="text-sm font-medium">{label}</span>
        </button>
      )}
    </div>
  );
}

