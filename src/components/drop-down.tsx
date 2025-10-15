

import {
    User,
    Lock,
    Bell,
    Smartphone,
    Power,
    Calendar,
    DollarSign,
    HelpCircle,
    Send,
} from "lucide-react";

import { useState } from "react";

export default function DropDownMenu() {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative flex">
            {/* Barre latérale */}
            <div className="w-[60px] bg-emerald-700 text-white flex flex-col justify-between items-center py-4 fixed md:relative h-full md:h-auto">
                <div
                    onClick={() => setOpen(!open)}
                    className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 cursor-pointer"
                >
                    AO
                </div>
            </div>

            {/* Overlay mobile */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/20 md:hidden z-20"
                    onClick={() => setOpen(false)}
                ></div>
            )}

            {/* Menu profil déroulant */}
            <div
                className={`fixed md:relative top-0 left-[60px] md:left-auto md:static z-30 transition-transform duration-300 
        ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"} 
        w-[280px] md:w-[320px] bg-white shadow-lg border border-gray-100 flex flex-col h-full md:h-auto`}
            >
                {/* En-tête profil */}
                <div className="flex items-center gap-3 p-4 border-b">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 text-lg font-semibold">
                        AO
                    </div>
                    <div>
                        <p className="font-medium text-gray-700">admin orathsa</p>
                        <p className="text-sm text-gray-500">dedeve4402@arqis.com</p>
                    </div>
                </div>

                {/* Options */}
                <div className="flex-1 text-gray-600 text-[15px] overflow-y-auto">
                    <MenuItem icon={<User size={18} />} label="Profil de l'utilisateur" />
                    <MenuItem icon={<Lock size={18} />} label="Changer le mot de passe" />
                    <MenuItem
                        icon={<Calendar size={18} />}
                        label="Abonnement aux services du calendrier"
                    />
                    <MenuItem icon={<Bell size={18} />} label="Notifications" />
                    <MenuItem icon={<Smartphone size={18} />} label="Application mobile" />
                </div>

                {/* Déconnexion */}
                <div className="border-t">
                    <MenuItem icon={<Power size={18} />} label="Déconnexion" />
                </div>
            </div>
        </div>
    );
}




function MenuItem({
    icon,
    label,
}: {
    icon: React.ReactNode;
    label: string;
}) {
    return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
            <div className="text-gray-400">{icon}</div>
            <span>{label}</span>
        </div>
    );
}