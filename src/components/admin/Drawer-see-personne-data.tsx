import { useEffect, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import type {
  InvitePersonnelPayload,
  RolePersonnel,
  TypePersonnel,
} from "../../types/validation.dto";
import { useChefService } from "../../hooks/chefdeservice/useChefService";
import { useRhService } from "../../hooks/rh/useRhService";

type PersonnelDetails = {
  id_personnel?: string;
  nom_personnel?: string;
  prenom_personnel?: string;
  email_travail?: string;
  email_personnel?: string;
  role_personnel?: RolePersonnel | string;
  type_personnel?: TypePersonnel | string;
  telephone_travail?: string;
  matricule_personnel?: string;
  telephone_personnel?: string;
  telephone_contact_urgence?: string;
  nom_contact_urgence?: string;
  adresse_personnel?: string;
  ville_personnel?: string;
  codepostal?: string;
  pays_personnel?: string;
  date_naissance?: string;
  is_active?: boolean;
  id_service?: string;
  nom_service?: string;
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: PersonnelDetails | null;
  onPersonnelUpdated?: (personnel: PersonnelDetails) => void;
}

export default function DrawerSeePersonneData({ isOpen, onClose, personnel, onPersonnelUpdated }: DrawerProps) {
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null);
  // État local pour le personnel qui sera mis à jour dynamiquement
  const [localPersonnel, setLocalPersonnel] = useState<PersonnelDetails | null>(personnel);

  const { invitePersonnel, loading: inviteLoading } = useChefService();
  const { getServiceById, updatePersonnel } = useRhService();

  // Synchroniser l'état local avec les props
  useEffect(() => {
    setLocalPersonnel(personnel);
  }, [personnel]);

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

  useEffect(() => {
    if (!isOpen) {
      setInviteFeedback(null);
    }
  }, [isOpen]);

  useEffect(() => {
    setInviteFeedback(null);
    // console.log(personnel);
  }, [personnel]);

  useEffect(() => {
    const fetchServiceName = async () => {
      const currentPersonnel = localPersonnel || personnel;
      if (!currentPersonnel?.id_service) {
        setServiceName(null);
        return;
      }

      try {
        const service = await getServiceById(currentPersonnel.id_service);
        if (service && typeof service === 'object' && 'nom_service' in service) {
          setServiceName(service.nom_service as string);
        } else {
          setServiceName(null);
        }
      } catch (err) {
        console.error("Erreur lors de la récupération du service:", err);
        setServiceName(null);
      }
    };

    if (isOpen && (localPersonnel || personnel)?.id_service) {
      fetchServiceName();
    } else {
      setServiceName(null);
    }
  }, [localPersonnel?.id_service, personnel?.id_service, isOpen, getServiceById]);

  const buildPayload = useCallback(() => {
    const currentPersonnel = localPersonnel || personnel;
    if (!currentPersonnel) {
      return null;
    }

    const email =
      (currentPersonnel.email_personnel ?? "").trim() ||
      (currentPersonnel.email_travail ?? "").trim();

    if (!email) {
      setInviteFeedback({
        type: "error",
        message: "Adresse e-mail manquante pour cet employé.",
      });
      return null;
    }

    const rawRole = ((currentPersonnel.role_personnel ?? "") as string).trim().toUpperCase();
    const rawType = ((currentPersonnel.type_personnel ?? "") as string).trim().toUpperCase();

    const allowedRoles: RolePersonnel[] = ["ADMIN", "RH", "CHEF_SERVICE", "EMPLOYE"];
    const allowedTypes: InvitePersonnelPayload["type_personnel"][] = ["PERMANENT", "CONTRACTUEL"];

    const normalizedRole = allowedRoles.includes(rawRole as RolePersonnel)
      ? (rawRole as RolePersonnel)
      : undefined;
    const normalizedType = allowedTypes.includes(rawType as InvitePersonnelPayload["type_personnel"])
      ? (rawType as InvitePersonnelPayload["type_personnel"])
      : undefined;

    return {
      email_personnel: email,
      nom_personnel: (currentPersonnel.nom_personnel ?? "").trim(),
      prenom_personnel: (currentPersonnel.prenom_personnel ?? "").trim(),
      role_personnel: normalizedRole,
      type_personnel: normalizedType,
    };
  }, [localPersonnel, personnel]);

  const handleInvite = useCallback(async () => {
    setInviteFeedback(null);

    const payload = buildPayload();
    if (!payload || !localPersonnel?.id_personnel) {
      return;
    }

    try {
      await invitePersonnel(payload);
      
      // Activer le personnel après une invitation réussie
      try {
        await updatePersonnel(localPersonnel.id_personnel, { is_active: true });
        // Mettre à jour l'état local pour refléter le changement dynamiquement
        const updatedPersonnel = { ...localPersonnel, is_active: true };
        setLocalPersonnel(updatedPersonnel);
        
        // Notifier le parent de la mise à jour
        if (onPersonnelUpdated) {
          onPersonnelUpdated(updatedPersonnel);
        }
      } catch (updateErr) {
        console.error("Erreur lors de l'activation du personnel:", updateErr);
      }
      
      setInviteFeedback({
        type: "success",
        message: "Invitation envoyée avec succès et personnel activé.",
      });
    } catch (err: any) {
      setInviteFeedback({
        type: "error",
        message:
          err?.message ??
          "Une erreur est survenue lors de l'envoi de l'invitation.",
      });
    }
  }, [buildPayload, invitePersonnel, localPersonnel, updatePersonnel]);

  const handleClose = () => {
    onClose();
  };

  // Utiliser localPersonnel au lieu de personnel pour l'affichage dynamique
  const currentPersonnel = localPersonnel || personnel;
  
  const fullName = `${currentPersonnel?.nom_personnel ?? ""} ${currentPersonnel?.prenom_personnel ?? ""}`.trim();
  const displayName =
    fullName ||
    (currentPersonnel?.email_travail ?? currentPersonnel?.email_personnel ?? "").trim() ||
    "Employé";
  const primaryEmail = (currentPersonnel?.email_travail ?? currentPersonnel?.email_personnel ?? "").trim();
  const initials =
    displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "E";

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
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-[#27a082]/10 text-[#27a082] text-sm font-semibold uppercase">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-semibold text-gray-800 truncate">{displayName}</h1>
                {typeof currentPersonnel?.is_active === "boolean" && (
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${currentPersonnel.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                  >
                    {currentPersonnel.is_active ? "Actif" : "Inactif"}
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                {primaryEmail && <span className="truncate max-w-[220px]">{primaryEmail}</span>}
                {currentPersonnel?.role_personnel && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium uppercase tracking-wide">
                    {String(currentPersonnel.role_personnel)}
                  </span>
                )}
                {currentPersonnel?.type_personnel && (
                  <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium uppercase tracking-wide">
                    {String(currentPersonnel.type_personnel)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center cursor-pointer gap-2 rounded-full border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:text-[#27a082] hover:border-[#27a082]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#27a082] focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
              data-tooltip-id="inviter"
              data-tooltip-content="Envoyer une invitation"
              onClick={handleInvite}
              disabled={inviteLoading || !currentPersonnel}
              title="Envoyer une invitation"
            >
              {inviteLoading ? (
                <ClipLoader size={16} color="#27a082" />
              ) : (
                <>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ui_icon_1z4c4c0lsv"
                  >
                    <g id="m-q/mail">
                      <g id="Subtract">
                        <path
                          d="M22 7.72583C22 6.77576 20.9782 6 19.7222 6H4.2778C3.02182 6 2 6.77576 2 7.72583V7.78259L11.9951 13.5533L22 7.77695V7.72583Z"
                          fill="currentColor"
                        ></path>
                        <path
                          d="M22 9.45847L11.9998 15.2321L11.9951 15.2239L11.9904 15.2321L2 9.46411V17.2742C2 18.2242 3.02182 19 4.2778 19H19.7222C20.9782 19 22 18.2242 22 17.2742V9.45847Z"
                          fill="currentColor"
                        ></path>
                      </g>
                    </g>
                  </svg>
                  <span>Inviter</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 rounded-full"
              title="Fermer"
            >
              ✕
            </button>
          </div>
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
              {!currentPersonnel ? (
                <p className="text-sm text-gray-500">Sélectionnez un employé pour consulter ses informations.</p>
              ) : (
                <>
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Informations personnelles
                    </h2>
                    <InfoRow label="Nom" value={`${currentPersonnel.nom_personnel ?? ""} ${currentPersonnel.prenom_personnel ?? ""}`.trim()} />
                    <InfoRow label="Matricule" value={currentPersonnel.matricule_personnel} />
                    <InfoRow label="Date de naissance" value={formatDate(currentPersonnel.date_naissance)} />
                    <InfoRow label="Email professionnel" value={currentPersonnel.email_travail} />
                    <InfoRow label="Email personnel" value={currentPersonnel.email_personnel} />
                    <InfoRow label="Rôle" value={currentPersonnel.role_personnel} />
                    <InfoRow label="Type" value={currentPersonnel.type_personnel} />
                    <InfoRow label="Service" value={serviceName || currentPersonnel.nom_service} />
                    <InfoRow label="Statut" value={currentPersonnel.is_active ? "Actif" : "Inactif"} />
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Coordonnées
                    </h2>
                    <InfoRow label="Téléphone professionnel" value={currentPersonnel.telephone_travail} />
                    <InfoRow label="Téléphone personnel" value={currentPersonnel.telephone_personnel} />
                  </section>

                    <section className="space-y-3">
                      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Adresse
                      </h2>
                      <InfoRow label="Adresse" value={currentPersonnel.adresse_personnel} />
                      <InfoRow label="Ville" value={currentPersonnel.ville_personnel} />
                      <InfoRow label="Code postal" value={currentPersonnel.codepostal} />
                      <InfoRow label="Pays" value={currentPersonnel.pays_personnel} />
                    </section>

                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Contact d'urgence
                    </h2>
                    <InfoRow label="Nom" value={currentPersonnel.nom_contact_urgence} />
                    <InfoRow label="Téléphone" value={currentPersonnel.telephone_contact_urgence} />
                  </section>
                </>
              )}
            </div>
          )}
        </div>

        {inviteFeedback && (
          <div
            className={`px-6 py-4 text-sm ${inviteFeedback.type === "success"
                ? "text-green-600 bg-green-50 border-t border-green-100"
                : "text-red-600 bg-red-50 border-t border-red-100"
              }`}
          >
            {inviteFeedback.message}
          </div>
        )}
      </div>
    </>
  );
}

function InfoRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex items-center justify-between bg-gray-50 border border-gray-100 rounded px-4 py-3">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm text-gray-800">{value?.trim() ? value : "Non renseigné"}</span>
    </div>
  );
}

function formatDate(dateString?: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

