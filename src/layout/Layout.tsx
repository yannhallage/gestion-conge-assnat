import type { ReactNode } from 'react';
import SidebarWithColor from '../layout/SidebarWithColor';
import SidebarCenter from './sidebarCenter';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen">
            <SidebarWithColor />
            <SidebarCenter />
            <main className="flex-1  overflow-y-auto">{children}</main>
        </div>

    );
}
