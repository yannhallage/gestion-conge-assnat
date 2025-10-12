import type{ ReactNode } from 'react';
import { Clock, FileText, CheckSquare, Users, Calendar, ClipboardList, HelpCircle, DollarSign, ArrowRightLeft } from 'lucide-react';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>
    );
}

function Sidebar() {
    return (
        <aside className="w-64 bg-emerald-700 text-white flex flex-col justify-between p-4">
            <div>
                <Logo />
                <NavSection title="Présence" items={[
                    { icon: <Clock className="w-4 h-4" />, label: 'Horloge' },
                    { icon: <FileText className="w-4 h-4" />, label: 'Feuille de temps' },
                    { icon: <CheckSquare className="w-4 h-4" />, label: 'Approbations' },
                    { icon: <Users className="w-4 h-4" />, label: 'Présence', active: true },
                ]} />

                <NavSection title="Congés" items={[
                    { icon: <ArrowRightLeft className="w-4 h-4" />, label: 'Demander' },
                    { icon: <Calendar className="w-4 h-4" />, label: 'Calendrier' },
                    { icon: <ClipboardList className="w-4 h-4" />, label: 'Demandes' },
                    { icon: <CheckSquare className="w-4 h-4" />, label: 'Approbations' },
                    { icon: <Users className="w-4 h-4" />, label: 'Disponibilité' },
                ]} />
            </div>

            <div className="space-y-4">
                <DollarSign className="w-5 h-5" />
                <HelpCircle className="w-5 h-5" />
            </div>
        </aside>
    );
}

function Logo() {
    return (
        <div className="flex items-center mb-8 space-x-2">
            <img src="https://cdn-icons-png.flaticon.com/512/3262/3262070.png" alt="logo" className="w-8 h-8" />
            <span className="text-2xl font-bold">Calamari</span>
        </div>
    );
}

interface NavSectionProps {
    title: string;
    items: { icon: JSX.Element; label: string; active?: boolean }[];
}

function NavSection({ title, items }: NavSectionProps) {
    return (
        <div className="mb-6">
            <h3 className="text-sm uppercase tracking-wide text-emerald-200 mb-2">{title}</h3>
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`flex items-center space-x-2 cursor-pointer rounded-md px-2 py-1 transition-colors duration-150 ${item.active ? 'bg-emerald-600 text-emerald-50 font-semibold' : 'hover:bg-emerald-600 hover:text-white'
                            }`}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
