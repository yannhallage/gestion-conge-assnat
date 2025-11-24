import React from "react"
import { Tooltip } from "react-tooltip";
import { useEffect, useState } from "react";
import '../css/scroll.css'

import DrawerSeePersonneData from "../../../../components/admin/Drawer-see-personne-data";
import DrawerAddPersonne from "../../../../components/rh/Drawer-add-personne";
import { motion } from "framer-motion";
import { useRhService } from "../../../../hooks/rh/useRhService";
import { ClipLoader } from "react-spinners";
import type { RolePersonnel, Service, TypePersonnel } from "../../../../types/validation.dto";

type PersonnelSummary = {
    id_personnel: string;
    nom_personnel: string;
    prenom_personnel: string;
    email_travail?: string;
    role_personnel?: RolePersonnel;
    type_personnel?: TypePersonnel;
    id_service?: string;
    is_active?: boolean;
};

const EmployesFeatures: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenConsultez, setIsOpenConsultez] = useState(false);
    const [active, setActive] = useState<string | null>(null);
    const [personnels, setPersonnels] = useState<PersonnelSummary[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelSummary | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { getAllPersonnel, getAllServices } = useRhService();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const [personnelsRes, servicesRes] = await Promise.all([
                    getAllPersonnel(),
                    getAllServices(),
                ]);
                setPersonnels(Array.isArray(personnelsRes) ? personnelsRes : []);
                setServices(Array.isArray(servicesRes) ? servicesRes : []);
            } catch (err: any) {
                setError(err?.message || "Erreur lors du chargement des employés.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [getAllPersonnel, getAllServices]);

    const OnclickDemandes = () => {
        setIsOpen(true);
    };

    const OnclickDemandesConsultez = (id: string) => {
        const personnel = personnels.find((item) => item.id_personnel === id) ?? null;
        setActive(id);
        setSelectedPersonnel(personnel);
        setIsOpenConsultez(true);
    };

    const employesCountLabel = personnels.length
        ? `${personnels.length} personne${personnels.length > 1 ? "s" : ""}`
        : "Aucun employé trouvé";

    return (
        <motion.div className="min-h-screen bg-white text-gray-700"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
        >
            <div className="flex items-center p-2 border-b border-[#ccc]">
                <button
                    onClick={OnclickDemandes}
                    data-tooltip-id="add" data-tooltip-content="add"
                    className="flex items-center justify-center hover:bg-gray-20 cursor-pointer text-xl w-8 h-8 bg-[#27a082] text-white">
                    <svg data-tooltip-id="add" data-tooltip-content="add" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv lui_icon_1uqg37zrid"><g id="a-d/add"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M13 11L13 4L11 4L11 11L4.00001 11L4.00001 13H11L11 20H13L13 13H20L20 11H13Z" fill="currentColor"></path></g></svg>
                </button>
                <Tooltip id="add" />
                <h1 className="ml-3 text-lg font-medium">Employés enregistrés</h1>
            </div>
            <div className="flex items-center p-4 space-x-3 border-[#ccc] text-sm">
                <input
                    type="text"
                    placeholder="Prénom, nom ou e-mail"
                    className="border border-[#ccc] px-3 py-2 w-75"
                />
                <div className="flex cursor-pointer items-center bg-[#f6f7f9] border-[#ccc] px-2 py-1">
                    <span className="text-gray-500 mr-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/activity"><path id="Vector" d="M17.2826 11.8435L15.2087 6.52174C15.1304 6.32609 14.9348 6.16957 14.7391 6.16957C14.5435 6.16957 14.3478 6.28696 14.2696 6.48261L11.8435 12.3522L10.4348 15.7957L9.02609 12.3522L7.96956 9.84783C7.85217 9.57391 7.57826 9.45652 7.30435 9.57391C7.18696 9.61304 7.1087 9.6913 7.03043 9.8087L5.93478 11.8435H3C3.07826 6.95217 7.06956 3 12 3C16.9304 3 20.9217 6.95217 21 11.8435H17.2826ZM6.67826 12.587L6.79565 12.3522L7.38261 11.2174L7.85217 12.3522L9.88696 17.3217C9.96522 17.5174 10.1609 17.6348 10.3565 17.6348C10.5522 17.6348 10.7478 17.5174 10.8261 17.3217L12.9 12.3522L14.6609 8.04783L16.3435 12.3522L16.4217 12.5478C16.5 12.7435 16.6957 12.8609 16.8913 12.8609H20.9217C20.5304 17.4391 16.6957 21 12 21C7.30435 21 3.46957 17.4391 3.03913 12.8609H6.2087C6.40435 12.8609 6.56087 12.7435 6.67826 12.587Z" fill="currentColor"></path></g></svg>
                    </span>
                    <span className="text-[#ccc]">Statut: <span className="font-medium text-[#555]">Actif</span></span>
                </div>
                <button className="text-[#27a082] font-medium cursor-pointer">+ AJOUTER UN FILTRE</button>            </div>
            <div className="px-6 py-2 text-sm text-gray-500">{employesCountLabel}</div>
            <div className="">
                {loading ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                        <ClipLoader size={18} color="#27a082" />
                        <span className="ml-2 text-sm">Chargement des employés...</span>
                    </div>
                ) : error ? (
                    <p className="px-6 py-4 text-sm text-red-500">{error}</p>
                ) : (
                    <>
                        <div className="divide-y divide-[#ccc] max-h-[60vh] overflow-y-auto scroll-hidden">
                            {personnels.map((personnel) => (
                                <div
                                    key={personnel.id_personnel}
                                    className={`flex items-center hover:bg-gray-50 p-6 cursor-pointer group ${active === personnel.id_personnel ? "text-teal-600 font-medium border-l-2 border-teal-600 bg-teal-50" : ''}`}
                                    onClick={() => OnclickDemandesConsultez(personnel.id_personnel)}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                                        {`${personnel.nom_personnel.charAt(0)}${personnel.prenom_personnel.charAt(0)}`.toUpperCase()}
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <div className="font-medium">
                                            {personnel.nom_personnel} {personnel.prenom_personnel}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {personnel.email_travail ?? "Email non renseigné"}
                                        </div>
                                    </div>
                                    <Methode />
                                </div>
                            ))}
                            {!personnels.length && (
                                <p className="px-6 py-4 text-sm text-gray-500">Aucun employé enregistré pour le moment.</p>
                            )}
                        </div>

                        <div onClick={OnclickDemandes} className="m-3 p-4 border text-[#27a082] border-dashed border-[#ccc] text-[13px] cursor-pointer">
                            + AJOUTER UNE PERSONNE
                        </div>
                    </>
                )}
            </div>
            <DrawerAddPersonne
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                services={services}
                onCreated={(personnel: any) => {
                    if (personnel && personnel.id_personnel) {
                        setPersonnels((prev) => [personnel, ...prev.filter((p) => p.id_personnel !== personnel.id_personnel)]);
                        setSelectedPersonnel(personnel);
                        setActive(personnel.id_personnel);
                    }
                }}
            />
            <DrawerSeePersonneData
                isOpen={isOpenConsultez}
                onClose={() => setIsOpenConsultez(false)}
                personnel={selectedPersonnel}
            />
        </motion.div>
    );
};

export default EmployesFeatures;


function Methode() {
    return (
        <div className="flex items-center gap-3 text-gray-500 
                                    opacity-0 translate-x-1 
                                    group-hover:opacity-100 group-hover:translate-x-0 
                                    transition-all duration-100 0">
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="modifier" data-tooltip-content="modifier"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-566s223"><g id="e-h/edit"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M12.0322 6.56778L3 15.6V21H8.4L14.7 14.7L17.4322 11.9678L12.0322 6.56778ZM13.1111 5.48887L18.516 10.884L21 8.4L18.3 5.7L15.6 3L13.1111 5.48887Z" fill="currentColor"></path></g></svg>
                <Tooltip id="modifier" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="modifier le droit" data-tooltip-content="modifie le droit"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-uy5o226"><g id="a-d/change-limits"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M3 6C3 4.34315 4.34315 3 6 3H18C19.6569 3 21 4.34315 21 6V18C21 19.6569 19.6569 21 18 21H6C4.34315 21 3 19.6569 3 18V6ZM13 6H11V9H8V11H11V14H13V11H16V9H13V6ZM16 18V16H8V18H16Z" fill="currentColor"></path></g></svg>
                <Tooltip id="modifier le droit" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="role" data-tooltip-content="role"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-isxo229"><g id="r-u/role-allmanagers"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M3.5 10.4299C3.5 5.76534 7.29667 2 12 2C16.7033 2 20.5 5.76534 20.5 10.4299C20.5 13.4459 18.8944 16.106 16.4767 17.5859V21.7072C16.4767 21.9132 16.25 22.0631 16.0422 21.9694L12.3967 20.246C12.1322 20.1336 11.8489 20.1336 11.5844 20.246L7.93889 21.9694C7.73111 22.0631 7.50444 21.932 7.50444 21.7072V17.5859C5.10556 16.106 3.5 13.4459 3.5 10.4299ZM6.01222 10.4299C6.01222 13.6894 8.67556 16.3308 11.9622 16.3308C15.23 16.3308 17.8933 13.6894 17.8933 10.4299C17.8933 7.17032 15.2489 4.52896 11.9622 4.52896C8.67556 4.52896 6.01222 7.17032 6.01222 10.4299ZM16.7789 10.4299C16.7789 13.0681 14.6224 15.2068 11.9622 15.2068C9.30206 15.2068 7.14557 13.0681 7.14557 10.4299C7.14557 7.79163 9.30206 5.65293 11.9622 5.65293C14.6224 5.65293 16.7789 7.79163 16.7789 10.4299Z" fill="currentColor"></path></g></svg>
                <Tooltip id="role" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="photo" data-tooltip-content="photo"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-3e6i232"><g id="m-q/photo"><g id="Frame 635848"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M7.02618 5.80132C7.02618 4.80648 7.82316 4 8.80628 4H15.2984C16.2816 4 17.0785 4.80648 17.0785 5.80132H20.7435C21.4374 5.80132 22 6.3706 22 7.07285V18.7285C22 19.4307 21.4374 20 20.7435 20H3.25654C2.56257 20 2 19.4307 2 18.7285V7.07285C2 6.3706 2.56257 5.80132 3.25654 5.80132H7.02618ZM19.4869 9.19205C19.9496 9.19205 20.3246 8.81253 20.3246 8.34437C20.3246 7.87621 19.9496 7.49669 19.4869 7.49669C19.0243 7.49669 18.6492 7.87621 18.6492 8.34437C18.6492 8.81253 19.0243 9.19205 19.4869 9.19205ZM12 17C14.2091 17 16 15.2091 16 13C16 10.7909 14.2091 9 12 9C9.79086 9 8 10.7909 8 13C8 15.2091 9.79086 17 12 17Z" fill="currentColor"></path></g></g></svg>
                <Tooltip id="photo" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="parametre" data-tooltip-content="parametre"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv"><g id="r-u/settings2"><g id="ic_ustawienia"><g id="ustawienia"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M21.6517 10.7128L20.492 10.4901C19.8127 10.3625 19.2477 9.89243 18.9987 9.24764C18.7433 8.60553 18.8382 7.87698 19.2495 7.32172L19.9767 6.32922C20.0856 6.18199 20.0697 5.9771 19.9394 5.84842L18.3688 4.27605C18.2425 4.15155 18.046 4.1333 17.8989 4.23242L16.9219 4.89318C16.3512 5.28335 15.6195 5.35106 14.9869 5.07223C14.353 4.79763 13.905 4.21635 13.8008 3.53349L13.6145 2.31649C13.5858 2.13589 13.4301 2.00291 13.2473 2.00293H11.0269C10.8493 2.00334 10.6965 2.12874 10.6615 2.30286L10.3734 3.8007C10.2456 4.46557 9.79226 5.02174 9.16683 5.28102C8.54141 5.5403 7.82756 5.468 7.26682 5.08859L6.00438 4.23242C5.85775 4.13294 5.66105 4.15203 5.5363 4.27787L3.96484 5.84842C3.83539 5.97739 3.81919 6.18144 3.92667 6.32922L4.65377 7.32172C5.06641 7.8825 5.1582 8.60234 4.90553 9.24946C4.65508 9.89325 4.09019 10.3623 3.41133 10.4901L2.25159 10.7146C2.07736 10.7482 1.95151 10.9007 1.95166 11.0781V13.2985C1.95166 13.4812 2.08618 13.6366 2.26704 13.6657L3.48222 13.8521C4.16565 13.9549 4.7475 14.4034 5.02096 15.0381C5.29944 15.6706 5.23246 16.4018 4.84373 16.9732L4.18115 17.9502C4.08177 18.0975 4.10083 18.2946 4.2266 18.4201L5.79715 19.9916C5.92659 20.1204 6.1306 20.1359 6.27795 20.0279L7.27045 19.3008C7.82608 18.8905 8.55393 18.7953 9.19638 19.049C9.84098 19.2989 10.3108 19.8639 10.4388 20.5433L10.6615 21.703C10.6962 21.8773 10.8491 22.0029 11.0269 22.0029H13.2473C13.4304 22.0037 13.5866 21.8704 13.6145 21.6894L13.7453 20.835C13.8486 20.1373 14.3122 19.5459 14.9651 19.279C15.6156 19.0072 16.3611 19.0973 16.9283 19.5162L17.6254 20.0279C17.7731 20.1362 17.9777 20.1203 18.1071 19.9907L19.6767 18.4201C19.8025 18.2946 19.8216 18.0975 19.7222 17.9502L19.0596 16.9732C18.6709 16.4018 18.6039 15.6706 18.8824 15.0381C19.1554 14.4027 19.738 13.954 20.422 13.8521L21.6372 13.6657C21.818 13.6372 21.9512 13.4816 21.9517 13.2985V11.0781C21.9516 10.9004 21.826 10.7474 21.6517 10.7128ZM11.9521 14.9482C10.3258 14.9482 9.00733 13.6297 9.00733 12.0034C9.00733 10.377 10.3258 9.0586 11.9521 9.0586C13.5785 9.0586 14.8969 10.377 14.8969 12.0034C14.8969 13.6297 13.5785 14.9482 11.9521 14.9482Z" fill="currentColor"></path></g></g></g></svg>
                <Tooltip id="parametre" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="notification" data-tooltip-content="notification"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-kept238"><g id="m-q/notifications"><path id="Vector" d="M17.9111 12.8C17.2444 12.8 16.5778 12.6222 15.9556 12.3111C14.6667 11.6444 13.8222 10.2667 13.8222 8.75556C13.8222 7.73333 14.1778 6.8 14.8889 6.04444C15.6444 5.2 16.7556 4.71111 17.9111 4.71111C20.1778 4.71111 22 6.53333 22 8.75556C22 10.9778 20.1778 12.8 17.9111 12.8ZM15.9556 13.3333C15.9556 14.0444 16.1778 16.0889 18.4 16.8444V18.9778H2V16.8444C4.71111 15.9111 4.44444 13.0667 4.44444 13.0667V10V9.86667C4.48889 7.15556 6.48889 4.88889 9.11111 4.35556C9.82222 4.22222 10.5778 4.22222 11.3333 4.35556C12.3111 4.53333 13.2444 4.97778 14.0444 5.64444C13.3333 6.53333 12.9333 7.6 12.9333 8.71111C12.9333 10.8 14.1778 12.5778 15.9556 13.3333ZM9.11111 3.64444V3.11111C9.11111 2.48889 9.6 2 10.2222 2C10.8 2 11.3333 2.48889 11.3333 3.11111V3.64444C10.9778 3.6 10.5778 3.55556 10.2222 3.55556C9.82222 3.55556 9.46667 3.6 9.11111 3.64444ZM10.5333 19.6889H12.7556C12.6667 20.9778 11.5556 22 10.2222 22C8.88889 22 7.77778 20.9778 7.68889 19.6889H10.5333Z" fill="currentColor"></path></g></svg>
                <Tooltip id="notification" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="inviter" data-tooltip-content="inviter"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-wnyp241"><g id="m-q/mail"><g id="Subtract"><path d="M22 7.72583C22 6.77576 20.9782 6 19.7222 6H4.2778C3.02182 6 2 6.77576 2 7.72583V7.78259L11.9951 13.5533L22 7.77695V7.72583Z" fill="currentColor"></path><path d="M22 9.45847L11.9998 15.2321L11.9951 15.2239L11.9904 15.2321L2 9.46411V17.2742C2 18.2242 3.02182 19 4.2778 19H19.7222C20.9782 19 22 18.2242 22 17.2742V9.45847Z" fill="currentColor"></path></g></g></svg>
                <Tooltip id="inviter" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="motdepasse" data-tooltip-content="réinitialiser le mot de passe"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-ftha244"><g id="i-l/key"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M9.84865 4.6942C7.24346 7.28662 7.24346 11.4898 9.84865 14.0822C12.4538 16.6746 16.6777 16.6746 19.2829 14.0822C21.8881 11.4898 21.8881 7.28662 19.2829 4.6942C16.6777 2.10179 12.4538 2.10179 9.84865 4.6942ZM17.8314 9.7493C18.4326 9.15105 18.4326 8.1811 17.8314 7.58285L16.38 6.13855C15.7788 5.5403 14.8041 5.5403 14.2029 6.13855C13.6017 6.7368 13.6017 7.70675 14.2029 8.305L15.6543 9.7493C16.2555 10.3476 17.2302 10.3476 17.8314 9.7493Z" fill="currentColor"></path><path id="Vector 26" d="M3.02267 18.6024L11.7764 9L14.9243 12.1325L11.8454 15.1963L11.8684 17.2618L9.79278 17.2389L8.76647 18.2602L8.78948 20.3256L3.75404 20.2701C2.88959 20.2605 2.44183 19.2395 3.02267 18.6024Z" fill="currentColor"></path></g></svg>
                <Tooltip id="motdepasse" />
            </button>
            <button
                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="archiver" data-tooltip-content="archiver"
            // onClick={() => setIsOpenDelete(true)}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-e6hn247"><g id="a-d/archive"><path id="Vector" d="M22 2H2V6H22V2Z" fill="currentColor"></path><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M3 7V20C3 20.5304 3.21071 21.0391 3.58578 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V7H3ZM9 10H15V11.5V12H9V11.5V10ZM15 16H9V18H15V16Z" fill="currentColor"></path></g></svg>                            </button>
            <Tooltip id="archiver" />
            {/* <button
                                className="hover:text-[#27a082] cursor-pointer" data-tooltip-id="delete" data-tooltip-content="Supprimer"
                            // onClick={() => setIsOpenDelete(true)}
                            >

                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv" aria-describedby="floating-ui-hrs1113"><g id="r-u/trash"><g id="Union"><path d="M15 3H9V4H4V6H20V4H15V3Z" fill="currentColor"></path><path d="M5 7H19V19C19 20.1046 18.1046 21 17 21H7C5.89545 21 5 20.1046 5 19V7Z" fill="currentColor"></path></g></g></svg>
                                <Tooltip id="delete" />
                            </button> */}
        </div>
    )
}