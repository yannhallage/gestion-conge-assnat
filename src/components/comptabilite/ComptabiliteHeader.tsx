import { useState } from "react";
import { Tooltip } from "react-tooltip";
import DrawerNotifications from "../notificationComponent";
import DrawerAccountComponent from "../AccountComponent";
import { useAuth } from "../../contexts/AuthContext";
import { usePusherNotifications } from "../../hooks/notifications/usePusherNotifications";

export default function ComptabiliteHeader() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDrawerAccountComponent, setIsOpenDrawerAccountComponent] = useState(false);
    const { user } = useAuth();
    const { unreadCount, refreshUnreadCount } = usePusherNotifications();
    const [activeTab, setActiveTab] = useState("Comptabilité");
    const [viewMode, setViewMode] = useState("list");

    const tabs = [
        "Tableau de bord",
        "Clients",
        "Fournisseurs",
        "Comptabilité",
        "Révision",
        "Analyse",
        "Configuration"
    ];

    return (
        <>
            <header className="bg-[#27a082] text-white">
                {/* Top section */}
                <div className="px-6 py-3 flex items-center justify-between">
                    {/* Left side - Logo and Navigation */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <img
                                src="https://www.assnat.ci/imgsite/logo-anci4.png"
                                alt="Logo ASSNAT"
                                className="w-8 h-8 object-contain"
                            />
                            <span className="text-sm font-medium">Comptabilité</span>
                        </div>

                        {/* Navigation tabs */}
                        <div className="flex items-center gap-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors ${
                                        activeTab === tab
                                            ? "bg-white/20 text-white"
                                            : "text-white/80 hover:text-white hover:bg-white/10"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right side - Icons */}
                    <div className="flex items-center gap-2.5">
                        {/* AI Icon */}
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>

                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(true)}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors relative"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#27a082]">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>
                        </div>

                        {/* Clock */}
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>

                        {/* Settings */}
                        <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/>
                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>

                        {/* Central text */}
                        <span className="text-xs text-white font-medium px-1.5">central</span>

                        {/* User profile */}
                        <button
                            onClick={() => setIsOpenDrawerAccountComponent(true)}
                            className="relative p-0.5 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs relative shadow-sm">
                                {user?.prenom?.[0] || user?.nom?.[0] || 'C'}
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#27a082]"></span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Bottom section - Search and Actions */}
                <div className="px-6 py-2.5 bg-[#27a082] border-t border-white/10 flex items-center justify-between">
                    {/* Left - New button and current view */}
                    <div className="flex items-center gap-3">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
                            Nouveau
                        </button>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Paiements clients</span>
                            <button className="p-1 hover:bg-white/10 rounded">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-white">
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Center - Search bar */}
                    <div className="flex items-center gap-2 flex-1 max-w-2xl mx-8">
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Rechercher..."
                                className="w-full pl-10 pr-4 py-2 bg-white rounded text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center gap-2 transition-colors">
                            <span>Paiements clients</span>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>

                    {/* Right - View mode icons */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "list" ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
                                <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("grid")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "grid" ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
                                <path d="M3 3h7v7H3V3zM14 3h7v7h-7V3zM3 14h7v7H3v-7zM14 14h7v7h-7v-7z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode("image")}
                            className={`p-2 rounded transition-colors ${
                                viewMode === "image" ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                            }`}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-current">
                                <path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </header>

            <DrawerNotifications
                isOpen={isOpen}
                onClose={() => {
                    setIsOpen(false);
                    refreshUnreadCount();
                }}
            />

            <DrawerAccountComponent
                isOpen={isOpenDrawerAccountComponent}
                onClose={() => setIsOpenDrawerAccountComponent(false)}
            />
        </>
    );
}

