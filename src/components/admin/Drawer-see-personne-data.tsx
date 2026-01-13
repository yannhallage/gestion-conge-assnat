import { useEffect, useState, useCallback } from "react";
import { ClipLoader } from "react-spinners";
import type {
  InvitePersonnelPayload,
  RolePersonnel,
  TypePersonnel,
} from "../../types/validation.dto";
import { useChefService } from "../../hooks/chefdeservice/useChefService";
import { useRhService } from "../../hooks/rh/useRhService";
import { useAuth } from "../../contexts/AuthContext";

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
  poste?: string;
  type_contrat?: string;
  date_embauche?: string;
  date_fin_contrat?: string;
  salaire_base?: number;
  niveau_hierarchique?: string;
  numero_cnps?: string;
  banque_nom?: string;
  banque_rib?: string;
};

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  personnel: PersonnelDetails | null;
  onPersonnelUpdated?: (personnel: PersonnelDetails) => void;
  onInviteSuccess?: () => void;
}

export default function DrawerSeePersonneData({ isOpen, onClose, personnel, onPersonnelUpdated, onInviteSuccess }: DrawerProps) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  
  const [loadingSkeleton, setLoadingSkeleton] = useState(false);
  const [inviteFeedback, setInviteFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [contrats, setContrats] = useState<any[]>([]);
  const [paies, setPaies] = useState<any[]>([]);
  const [documents, setDocuments] = useState<any[]>([]);
  const [loadingContrats, setLoadingContrats] = useState(false);
  const [loadingPaies, setLoadingPaies] = useState(false);
  const [loadingDocuments, setLoadingDocuments] = useState(false);
  // État local pour le personnel qui sera mis à jour dynamiquement
  const [localPersonnel, setLocalPersonnel] = useState<PersonnelDetails | null>(personnel);

  const { invitePersonnel, loading: inviteLoading } = useChefService();
  const { getServiceById, updatePersonnel, getContratsByPersonnel, getPaiesByPersonnel, getPersonnelDocumentsByPersonnel } = useRhService();

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

  useEffect(() => {
    const fetchContrats = async () => {
      const currentPersonnel = localPersonnel || personnel;
      if (!currentPersonnel?.id_personnel || isAdmin) {
        setContrats([]);
        return;
      }

      try {
        setLoadingContrats(true);
        const contratsData = await getContratsByPersonnel(currentPersonnel.id_personnel);
        setContrats(Array.isArray(contratsData) ? contratsData : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des contrats:", err);
        setContrats([]);
      } finally {
        setLoadingContrats(false);
      }
    };

    if (isOpen && (localPersonnel || personnel)?.id_personnel && !isAdmin) {
      fetchContrats();
    } else {
      setContrats([]);
    }
  }, [localPersonnel?.id_personnel, personnel?.id_personnel, isOpen, getContratsByPersonnel, isAdmin]);

  useEffect(() => {
    const fetchPaies = async () => {
      const currentPersonnel = localPersonnel || personnel;
      if (!currentPersonnel?.id_personnel || isAdmin) {
        setPaies([]);
        return;
      }

      try {
        setLoadingPaies(true);
        const paiesData = await getPaiesByPersonnel(currentPersonnel.id_personnel);
        setPaies(Array.isArray(paiesData) ? paiesData : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des paies:", err);
        setPaies([]);
      } finally {
        setLoadingPaies(false);
      }
    };

    if (isOpen && (localPersonnel || personnel)?.id_personnel && !isAdmin) {
      fetchPaies();
    } else {
      setPaies([]);
    }
  }, [localPersonnel?.id_personnel, personnel?.id_personnel, isOpen, getPaiesByPersonnel, isAdmin]);

  useEffect(() => {
    const fetchDocuments = async () => {
      const currentPersonnel = localPersonnel || personnel;
      if (!currentPersonnel?.id_personnel || isAdmin) {
        setDocuments([]);
        return;
      }

      try {
        setLoadingDocuments(true);
        const documentsData = await getPersonnelDocumentsByPersonnel(currentPersonnel.id_personnel);
        setDocuments(Array.isArray(documentsData) ? documentsData : []);
      } catch (err) {
        console.error("Erreur lors de la récupération des documents:", err);
        setDocuments([]);
      } finally {
        setLoadingDocuments(false);
      }
    };

    if (isOpen && (localPersonnel || personnel)?.id_personnel && !isAdmin) {
      fetchDocuments();
    } else {
      setDocuments([]);
    }
  }, [localPersonnel?.id_personnel, personnel?.id_personnel, isOpen, getPersonnelDocumentsByPersonnel, isAdmin]);

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
      
      // Appeler le callback de succès pour afficher le toast dans le parent
      if (onInviteSuccess) {
        onInviteSuccess();
      }
    } catch (err: any) {
      setInviteFeedback({
        type: "error",
        message:
          err?.message ??
          "Une erreur est survenue lors de l'envoi de l'invitation.",
      });
    }
  }, [buildPayload, invitePersonnel, localPersonnel, updatePersonnel, onPersonnelUpdated, onInviteSuccess]);

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

                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                      Informations professionnelles
                    </h2>
                    <InfoRow label="Poste" value={currentPersonnel.poste} />
                    <InfoRow label="Type de contrat" value={currentPersonnel.type_contrat} />
                    {/* <InfoRow label="Date d'embauche" value={formatDate(currentPersonnel.date_embauche)} />
                    <InfoRow label="Date de fin de contrat" value={formatDate(currentPersonnel.date_fin_contrat)} />
                    {!isAdmin && (
                      <>
                        <InfoRow 
                          label="Salaire de base" 
                          value={currentPersonnel.salaire_base ? new Intl.NumberFormat("fr-FR", {
                            style: "currency",
                            currency: "XOF",
                            minimumFractionDigits: 0,
                          }).format(currentPersonnel.salaire_base) : undefined} 
                        />
                        <InfoRow label="Niveau hiérarchique" value={currentPersonnel.niveau_hierarchique} />
                        <InfoRow label="Numéro CNPS" value={currentPersonnel.numero_cnps} />
                        <InfoRow label="Banque" value={currentPersonnel.banque_nom} />
                        <InfoRow label="RIB" value={currentPersonnel.banque_rib} />
                      </>
                    )}
                    {isAdmin && (
                      <>
                        <InfoRow label="Niveau hiérarchique" value={currentPersonnel.niveau_hierarchique} />
                      </>
                    )} */}
                  </section>

                  {/* {!isAdmin && (
                    <>
                      <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Contrats
                        </h2>
                        {loadingContrats ? (
                          <div className="flex items-center justify-center py-4">
                            <ClipLoader size={20} color="#27a082" />
                          </div>
                        ) : contrats.length > 0 ? (
                          <div className="space-y-2">
                            {contrats.map((contrat, index) => (
                              <ContratCard key={contrat.id_contrat || index} contrat={contrat} />
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-100 rounded px-4 py-3 text-sm text-gray-500">
                            Aucun contrat enregistré
                          </div>
                        )}
                      </section>

                      <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Paies
                        </h2>
                        {loadingPaies ? (
                          <div className="flex items-center justify-center py-4">
                            <ClipLoader size={20} color="#27a082" />
                          </div>
                        ) : paies.length > 0 ? (
                          <div className="space-y-2">
                            {paies.map((paie, index) => (
                              <PaieCard key={paie.id_paie || index} paie={paie} />
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-100 rounded px-4 py-3 text-sm text-gray-500">
                            Aucune paie enregistrée
                          </div>
                        )}
                      </section>

                      <section className="space-y-3">
                        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Documents
                        </h2>
                        {loadingDocuments ? (
                          <div className="flex items-center justify-center py-4">
                            <ClipLoader size={20} color="#27a082" />
                          </div>
                        ) : documents.length > 0 ? (
                          <div className="space-y-2">
                            {documents.map((document, index) => (
                              <DocumentCard key={document.id_document || index} document={document} />
                            ))}
                          </div>
                        ) : (
                          <div className="bg-gray-50 border border-gray-100 rounded px-4 py-3 text-sm text-gray-500">
                            Aucun document enregistré
                          </div>
                        )}
                      </section>
                    </>
                  )} */}
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

function formatDateShort(dateString?: string): string {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

function ContratCard({ contrat }: { contrat: any }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {contrat.type_contrat || "N/A"}
            </span>
            {contrat.statut && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                contrat.statut.toLowerCase().includes("actif") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {contrat.statut}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Début: </span>
              <span className="text-gray-800 font-medium">{formatDateShort(contrat.date_debut)}</span>
            </div>
            {contrat.date_fin && (
              <div>
                <span className="text-gray-500">Fin: </span>
                <span className="text-gray-800 font-medium">{formatDateShort(contrat.date_fin)}</span>
              </div>
            )}
          </div>
          {contrat.salaire_reference && (
            <div className="text-sm">
              <span className="text-gray-500">Salaire de référence: </span>
              <span className="text-gray-800 font-medium">
                {new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  minimumFractionDigits: 0,
                }).format(contrat.salaire_reference)}
              </span>
            </div>
          )}
        </div>
        {contrat.url_contrat && (
          <a
            href={contrat.url_contrat}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-teal-600 hover:text-teal-700 transition-colors"
            title="Télécharger le contrat"
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
        )}
      </div>
    </div>
  );
}

function PaieCard({ paie }: { paie: any }) {
  const mois = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  const moisLabel = paie.mois ? mois[paie.mois - 1] : "N/A";

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800">
              {moisLabel} {paie.annee || ""}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">Brut: </span>
              <span className="text-gray-800 font-medium">
                {paie.salaire_brut ? new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  minimumFractionDigits: 0,
                }).format(paie.salaire_brut) : "N/A"}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Net: </span>
              <span className="text-gray-800 font-medium">
                {paie.salaire_net ? new Intl.NumberFormat("fr-FR", {
                  style: "currency",
                  currency: "XOF",
                  minimumFractionDigits: 0,
                }).format(paie.salaire_net) : "N/A"}
              </span>
            </div>
          </div>
          {(paie.primes || paie.deductions) && (
            <div className="flex gap-4 text-sm">
              {paie.primes && (
                <div>
                  <span className="text-gray-500">Primes: </span>
                  <span className="text-green-600 font-medium">
                    +{new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                      minimumFractionDigits: 0,
                    }).format(paie.primes)}
                  </span>
                </div>
              )}
              {paie.deductions && (
                <div>
                  <span className="text-gray-500">Déductions: </span>
                  <span className="text-red-600 font-medium">
                    -{new Intl.NumberFormat("fr-FR", {
                      style: "currency",
                      currency: "XOF",
                      minimumFractionDigits: 0,
                    }).format(paie.deductions)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        {paie.url_bulletin && (
          <a
            href={paie.url_bulletin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-teal-600 hover:text-teal-700 transition-colors"
            title="Télécharger le bulletin"
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
        )}
      </div>
    </div>
  );
}

function DocumentCard({ document }: { document: any }) {
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CNI': 'Carte Nationale d\'Identité',
      'CONTRAT': 'Contrat',
      'DIPLOME': 'Diplôme',
      'ATTestation': 'Attestation',
    };
    return labels[type] || type;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-teal-300 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              {getTypeLabel(document.type_document || "N/A")}
            </span>
          </div>
        </div>
        {document.url_document && (
          <a
            href={document.url_document}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 text-teal-600 hover:text-teal-700 transition-colors"
            title="Télécharger le document"
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
        )}
      </div>
    </div>
  );
}

