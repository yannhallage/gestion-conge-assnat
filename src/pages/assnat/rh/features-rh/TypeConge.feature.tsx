
import { CalendarDays } from 'lucide-react';
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import '../css/scroll.css'
// import DrawerSeeDirectionData from "../../../../components/admin/Drawer-see-direction-data";
// import DrawerAddDirection from "../../../../components/admin/Drawer-add-direction";
import { AddModalTypeConge } from '../../../../components/admin/modal-add-typeconge';
import { motion } from 'framer-motion';



export default function TypeCongeFeature() {
    const [isOpen, setIsOpen] = useState(false)
    const [isOpenConsultez, setIsOpenConsultez] = useState(false)
    const [active, setActive] = useState<number>()
    const donneeDefault = [
        { id: 1, nom: "Congé maternité" },
        { id: 2, nom: 'Congé pour enfant malade' },
        { id: 3, nom: 'Congé annuel' },
        { id: 5, nom: 'Congé parental à temps plein' },
        { id: 6, nom: 'Congé maladie' },
        { id: 7, nom: 'congé d’examen' },
    ]
    const OnclickDemandes = () => {
        setIsOpen(true)
    }
    const OnclickDemandesConsultez = (id: number) => {
        setActive(id);
        setIsOpenConsultez(true)
    }
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
                <h1 className="ml-3 text-lg font-medium">Type de congés</h1>
            </div>
            <div className="flex items-center p-4 space-x-3 border-[#ccc] text-sm">
                <input
                    type="text"
                    placeholder="Nom, matricule"
                    className="border border-[#ccc] px-3 py-2 w-75"
                />
                <div className="flex cursor-pointer items-center bg-[#f6f7f9] border-[#ccc] px-2 py-1">
                    <span className="text-gray-500 mr-2">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/activity"><path id="Vector" d="M17.2826 11.8435L15.2087 6.52174C15.1304 6.32609 14.9348 6.16957 14.7391 6.16957C14.5435 6.16957 14.3478 6.28696 14.2696 6.48261L11.8435 12.3522L10.4348 15.7957L9.02609 12.3522L7.96956 9.84783C7.85217 9.57391 7.57826 9.45652 7.30435 9.57391C7.18696 9.61304 7.1087 9.6913 7.03043 9.8087L5.93478 11.8435H3C3.07826 6.95217 7.06956 3 12 3C16.9304 3 20.9217 6.95217 21 11.8435H17.2826ZM6.67826 12.587L6.79565 12.3522L7.38261 11.2174L7.85217 12.3522L9.88696 17.3217C9.96522 17.5174 10.1609 17.6348 10.3565 17.6348C10.5522 17.6348 10.7478 17.5174 10.8261 17.3217L12.9 12.3522L14.6609 8.04783L16.3435 12.3522L16.4217 12.5478C16.5 12.7435 16.6957 12.8609 16.8913 12.8609H20.9217C20.5304 17.4391 16.6957 21 12 21C7.30435 21 3.46957 17.4391 3.03913 12.8609H6.2087C6.40435 12.8609 6.56087 12.7435 6.67826 12.587Z" fill="currentColor"></path></g></svg>
                    </span>
                    <span className="text-[#ccc]">Statut: <span className="font-medium text-[#555]">Actif</span></span>
                </div>
                <button className="text-[#27a082] font-medium cursor-pointer">+ AJOUTER UN FILTRE</button>            </div>
            <div className="px-6 py-2 text-sm text-gray-500">{donneeDefault.length ? `${donneeDefault.length} directions` : ''}</div>
            <div className="">
                <div className="divide-y divide-[#ccc] max-h-[60vh] overflow-y-auto scroll-hidden">
                    {donneeDefault.length > 0 && (
                        donneeDefault.map((e) => (
                            <div
                                key={e.id}
                                className={`flex items-center hover:bg-gray-50 p-6 cursor-pointer group ${active === e.id ? "text-teal-600 font-medium border-l-2 border-teal-600 bg-teal-50" : ''}`}
                                onClick={() => OnclickDemandesConsultez(e.id)}
                            >
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-white">
                                    <CalendarDays />
                                </div>
                                <div className="ml-4 flex-1 space-y-0">
                                    <div className="font-medium">{e.nom}</div>
                                    <div className="text-[11px] text-gray-500">
                                        ajouté le 20 juin 
                                    </div>
                                </div>
                                <Methode />
                            </div>
                        ))
                    )}


                </div>

                <div onClick={OnclickDemandes} className="m-3 p-4 border text-[#27a082] border-dashed border-[#ccc] text-[13px] cursor-pointer">
                    + AJOUTER UN TYPE DE CONGE
                </div>
            </div>

            <AddModalTypeConge
                isOpen={isOpen}
                title="Ajouter un type de congé"
                // description="Votre session sera supprimer!!"
                cancelText="Annuler"
                confirm={() => setIsOpen(false)}
                cancel={() => { setIsOpen(false) }}
                confirmText="accepter"
            />
        </motion.div>
    )
}

function Methode() {
    return (
        <div className="flex items-center gap-3 text-gray-500 
                                    opacity-0 translate-x-1 
                                    group-hover:opacity-100 group-hover:translate-x-0 
                                    transition-all duration-100 0">
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