import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { ClipLoader } from "react-spinners";
import { toast } from "sonner";
import { useRhService } from "../../hooks/rh/useRhService";
import type {
  CreatePersonnelDocumentDto,
  UpdatePersonnelDocumentDto,
  TypeDocumentEnum,
} from "../../types/validation.dto";

type DocumentForEdit = {
  id_document?: string;
  type_document?: TypeDocumentEnum | string;
  url_document?: string;
  id_personnel?: string;
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  idPersonnel: string;
  nomPersonnel?: string;
  prenomPersonnel?: string;
  documentToEdit?: DocumentForEdit | null;
  onCreated?: (data: unknown) => void;
}

const TYPES_DOCUMENT: TypeDocumentEnum[] = ["CNI", "CONTRAT", "DIPLOME", "ATTestation"];

export default function DrawerDocumentPersonnel({
  isOpen,
  onClose,
  idPersonnel,
  nomPersonnel,
  prenomPersonnel,
  documentToEdit,
  onCreated,
}: DrawerProps) {
  const { createPersonnelDocument, updatePersonnelDocument } = useRhService();
  const isEditMode = !!documentToEdit?.id_document;

  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [documentData, setDocumentData] = useState({
    type_document: "CNI" as TypeDocumentEnum,
    url_document: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLoadingSkeleton(true);
      const timer = setTimeout(() => setLoadingSkeleton(false), 400);
      if (isEditMode && documentToEdit) {
        setDocumentData({
          type_document: (documentToEdit.type_document as TypeDocumentEnum) || "CNI",
          url_document: documentToEdit.url_document || "",
        });
        setSelectedFile(null);
      } else {
        setDocumentData({
          type_document: "CNI",
          url_document: "",
        });
        setSelectedFile(null);
      }
      setError(null);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isEditMode, documentToEdit]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  const handleChange = (field: keyof typeof documentData, value: string | TypeDocumentEnum) => {
    setDocumentData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      setError(null);

      if (!documentData.type_document) {
        setError("Merci de sélectionner un type de document.");
        return;
      }

      if (isEditMode && documentToEdit?.id_document) {
        // Pour la mise à jour, on n'envoie pas de fichier (le backend ne le gère peut-être pas)
        const payload: UpdatePersonnelDocumentDto = {
          type_document: documentData.type_document,
          ...(documentData.url_document && {
            url_document: documentData.url_document,
          }),
        };
        const updated = await updatePersonnelDocument(documentToEdit.id_document, payload);
        toast.success("Document modifié avec succès !");
        if (onCreated && updated) {
          onCreated(updated);
        }
      } else {
        // Pour la création, le fichier est requis
        if (!selectedFile) {
          setError("Le fichier du document est requis.");
          return;
        }

        // Vérifier le type de fichier (PDF, JPEG, JPG, PNG)
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(selectedFile.type)) {
          setError("Seuls les fichiers PDF, JPEG, JPG et PNG sont autorisés.");
          return;
        }

        const payload: CreatePersonnelDocumentDto = {
          type_document: documentData.type_document,
          id_personnel: idPersonnel,
        };
        const created = await createPersonnelDocument(payload, selectedFile);
        toast.success("Document enregistré avec succès !");
        if (onCreated && created) {
          onCreated(created);
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

  const title = isEditMode ? "Modifier le document" : "Nouveau document";

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
              <section className="bg-white space-y-5">
                <h2 className="text-[15px] font-semibold text-gray-800 pb-2">Informations du document</h2>
                <FormRow
                  label="Type de document"
                  required
                  input={
                    <select
                      value={documentData.type_document}
                      onChange={(e) => handleChange("type_document", e.target.value as TypeDocumentEnum)}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      {TYPES_DOCUMENT.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  }
                />
                <FormRow
                  label="Document"
                  required
                  input={
                    <FileUpload
                      selectedFile={selectedFile}
                      existingFileUrl={documentData.url_document}
                      onFileSelect={(file) => setSelectedFile(file)}
                      onFileRemove={() => {
                        setSelectedFile(null);
                        handleChange("url_document", "");
                      }}
                      accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/jpg,image/png"
                      label="Sélectionner un document (PDF, JPEG, PNG)"
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
      // Vérifier le type de fichier (PDF, JPEG, JPG, PNG)
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Seuls les fichiers PDF, JPEG, JPG et PNG sont autorisés.");
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

