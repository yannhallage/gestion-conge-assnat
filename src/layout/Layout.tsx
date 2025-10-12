import type { ReactNode } from 'react';
import SidebarWithColor from './sidebarWithColor';
import SidebarCenter from './sidebarCenter';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen">
            <SidebarWithColor />
            <SidebarCenter />
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>

    );
}
