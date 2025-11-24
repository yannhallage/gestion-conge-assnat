import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import SidebarWithColor from '../layout/sidebarWithColor';
import SidebarCenter from './sidebarCenter';



interface LayoutProps {
    children: ReactNode;
    role?: 'user' | 'admin' | 'rh'; // optionnel pour compatibilité
}

export default function Layout({ children, role }: LayoutProps) {
    const location = useLocation();
    // const [activeItem, setActiveItem] = useState<string>("");

    useEffect(() => {
        const pathParts = location.pathname.split("/");
        const lastPart = pathParts[pathParts.length - 1];
        // setActiveItem(lastPart);
    }, [location.pathname]);

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
