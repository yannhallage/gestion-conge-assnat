import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarWithColor from '../layout/sidebarWithColor';
import SidebarCenter from './sidebarCenter';
import ComptabiliteLayout from './ComptabiliteLayout';



interface LayoutProps {
    children: ReactNode;
    role?: 'user' | 'admin' | 'rh' | 'compta_admin'; // optionnel pour compatibilité
}

export default function Layout({ children, role }: LayoutProps) {
    const location = useLocation();
    // const [activeItem, setActiveItem] = useState<string>("");

    useEffect(() => {
        // const pathParts = location.pathname.split("/");
        // const lastPart = pathParts[pathParts.length - 1];
        // setActiveItem(lastPart);
    }, [location.pathname]);

    // Utiliser le layout spécial pour compta_admin
    if (role === "compta_admin") {
        return <ComptabiliteLayout>{children}</ComptabiliteLayout>;
    }

    return (
        <div className="flex h-screen">
            {/* Sidebar principale avec couleur et rôle */}
            <SidebarWithColor  />
            <SidebarCenter role={role!} />
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}