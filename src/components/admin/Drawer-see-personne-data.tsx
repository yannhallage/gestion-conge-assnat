import { useEffect, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import type {
  InvitePersonnelPayload,
  RolePersonnel,
  TypePersonnel,
} from "../../types/validation.dto";
import { useChefService } from "../../hooks/chefdeservice/useChefService";

type PersonnelDetails = {
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
  is_active?: boolean;
  id_service?: string;
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: PersonnelDetails | null;
}

export default function DrawerSeePersonneData({ isOpen, onClose, personnel }: DrawerProps) {
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const { invitePersonnel, loading: inviteLoading } = useChefService();

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
  }, [personnel]);

  const buildPayload = useCallback(() => {
    if (!personnel) {
      return null;
    }

    const email =
      (personnel.email_personnel ?? "").trim() ||
      (personnel.email_travail ?? "").trim();

    if (!email) {
      setInviteFeedback({
        type: "error",
        message: "Adresse e-mail manquante pour cet employé.",
      });
      return null;
    }

    const rawRole = ((personnel.role_personnel ?? "") as string).trim().toUpperCase();
    const rawType = ((personnel.type_personnel ?? "") as string).trim().toUpperCase();

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
      nom_personnel: (personnel.nom_personnel ?? "").trim(),
      prenom_personnel: (personnel.prenom_personnel ?? "").trim(),
      role_personnel: normalizedRole,
      type_personnel: normalizedType,
    };
  }, [personnel]);

  const handleInvite = useCallback(async () => {
    setInviteFeedback(null);

    const payload = buildPayload();
    if (!payload) {
      return;
    }

    try {
      await invitePersonnel(payload);
      setInviteFeedback({
        type: "success",
        message: "Invitation envoyée avec succès.",
      });
    } catch (err: any) {
      setInviteFeedback({
        type: "error",
        message:
          err?.message ??
          "Une erreur est survenue lors de l’envoi de l’invitation.",
      });
    }
  }, [buildPayload, invitePersonnel]);

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
              {personnel ? `${personnel.nom_personnel ?? ""} ${personnel.prenom_personnel ?? ""}`.trim() || "Employé" : "Employé"}
            </h1>
            {personnel?.email_travail && (
              <p className="text-sm text-gray-500">{personnel.email_travail}</p>
            )}
          </div>
          <button
            className="hover:text-[#27a082] cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed flex items-center"
            data-tooltip-id="inviter"
            data-tooltip-content="inviter"
            onClick={handleInvite}
            disabled={inviteLoading || !personnel}
          >
            {inviteLoading ? (
              <ClipLoader size={16} color="#27a082" />
            ) : (
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="ui_icon_1z4c4c0lsv"
                aria-describedby="floating-ui-wnyp241"
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
            )}
          </button>
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
              {!personnel ? (
                <p className="text-sm text-gray-500">Sélectionnez un employé pour consulter ses informations.</p>
              ) : (
                <>
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Informations personnelles
                    </h2>
                    <InfoRow label="Nom" value={`${personnel.nom_personnel ?? ""} ${personnel.prenom_personnel ?? ""}`.trim()} />
                    <InfoRow label="Email professionnel" value={personnel.email_travail} />
                    <InfoRow label="Email personnel" value={personnel.email_personnel} />
                    <InfoRow label="Rôle" value={personnel.role_personnel} />
                    <InfoRow label="Type" value={personnel.type_personnel} />
                    <InfoRow label="Statut" value={personnel.is_active ? "Actif" : "Inactif"} />
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Coordonnées
                    </h2>
                    <InfoRow label="Téléphone professionnel" value={personnel.telephone_travail} />
                    <InfoRow label="Téléphone personnel" value={personnel.telephone_personnel} />
                  </section>

                    <section className="space-y-3">
                      <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                        Adresse
                      </h2>
                      <InfoRow label="Adresse" value={personnel.adresse_personnel} />
                      <InfoRow label="Ville" value={personnel.ville_personnel} />
                      <InfoRow label="Code postal" value={personnel.codepostal} />
                      <InfoRow label="Pays" value={personnel.pays_personnel} />
                    </section>

                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Contact d’urgence
                    </h2>
                    <InfoRow label="Nom" value={personnel.nom_contact_urgence} />
                    <InfoRow label="Téléphone" value={personnel.telephone_contact_urgence} />
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

