
import { Clock, FileText, CheckSquare, Users, Calendar, ClipboardList, HelpCircle, DollarSign, ArrowRightLeft } from 'lucide-react';

export default function sidebarWithColor() {
    return (
        <aside className="w-64 bg-emerald-700 text-white flex flex-col justify-between p-4">
            <div>
                {/* Logo */}
                <div className="flex items-center mb-8 space-x-2">
                    <img
                        src="https://cdn-icons-png.flaticon.com/512/3262/3262070.png"
                        alt="logo"
                        className="w-8 h-8"
                    />
                    <span className="text-2xl font-bold">Calamari</span>
                </div>

                {/* Présence */}
                <div className="mb-6">
                    <h3 className="text-sm uppercase tracking-wide text-emerald-200 mb-2">Présence</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <Clock className="w-4 h-4" /> <span>Horloge</span>
                        </li>
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <FileText className="w-4 h-4" /> <span>Feuille de temps</span>
                        </li>
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <CheckSquare className="w-4 h-4" /> <span>Approbations</span>
                        </li>
                        <li className="flex items-center space-x-2 text-emerald-100 font-semibold">
                            <Users className="w-4 h-4" /> <span>Présence</span>
                        </li>
                    </ul>
                </div>

                {/* Congés */}
                <div>
                    <h3 className="text-sm uppercase tracking-wide text-emerald-200 mb-2">Congés</h3>
                    <ul className="space-y-2">
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <ArrowRightLeft className="w-4 h-4" /> <span>Demander</span>
                        </li>
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <Calendar className="w-4 h-4" /> <span>Calendrier</span>
                        </li>
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <ClipboardList className="w-4 h-4" /> <span>Demandes</span>
                        </li>
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <CheckSquare className="w-4 h-4" /> <span>Approbations</span>
                        </li>
                        <li className="flex items-center space-x-2 hover:text-emerald-200 cursor-pointer">
                            <Users className="w-4 h-4" /> <span>Disponibilité</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom icons */}
            <div className="space-y-4">
                <DollarSign className="w-5 h-5" />
                <HelpCircle className="w-5 h-5" />
            </div>
        </aside>
    );
}
