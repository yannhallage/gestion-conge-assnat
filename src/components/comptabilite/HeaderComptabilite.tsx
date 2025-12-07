import { useState } from "react";
import { Tooltip } from "react-tooltip";
import DrawerNotifications from "../notificationComponent";
import DrawerAccountComponent from "../AccountComponent";
import { useAuth } from "../../contexts/AuthContext";
import { usePusherNotifications } from "../../hooks/notifications/usePusherNotifications";
import { ConfirmModal } from "../modal-component";

export default function HeaderComptabilite() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenDrawerAccountComponent, setIsOpenDrawerAccountComponent] = useState(false);
    const [isOpenSignOut, setIsOpenSignOut] = useState<boolean>(false);
    const { logout, user } = useAuth();
    const { unreadCount, refreshUnreadCount } = usePusherNotifications();

    return (
        <>
            <header className="bg-[#27a082] text-white px-6 py-2.5 flex items-center justify-between">
                {/* Left side - Chevron menu */}
                {/* <div className="flex items-center">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-white"
                        >
                            <path
                                d="M9 18L15 12L9 6"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div> */}

                <div className="flex items-center justify-center">
                    <img
                        src="https://www.assnat.ci/imgsite/logo-anci4.png"
                        alt="Logo ASSNAT"
                        className="w-8 h-8 object-contain"
                    />
                </div>
                {/* Right side - Icons and user info */}
                <div className="flex items-center gap-2.5">
                    {/* Logo ASSNAT */}
                    {/* <div className="flex items-center justify-center">
                        <img
                            src="https://www.assnat.ci/imgsite/logo-anci4.png"
                            alt="Logo ASSNAT"
                            className="w-8 h-8 object-contain"
                        />
                    </div> */}

                    {/* Notifications */}
                    <div className="relative flex items-center justify-center">
                        <button
                            onClick={() => setIsOpen(true)}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors relative flex items-center justify-center"
                            data-tooltip-id="notifications"
                            data-tooltip-content="Notifications"
                        >
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                className="text-white"
                            >
                                <path
                                    d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M13.73 21a2 2 0 0 1-3.46 0"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-[#27a082]">
                                    {unreadCount > 9 ? '9+' : unreadCount}
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Clock */}
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-white"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="M12 6v6l4 2"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>

                    {/* Settings */}
                    <button
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center"
                        data-tooltip-id="settings"
                        data-tooltip-content="Paramètres"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            className="text-white"
                        >
                            <path
                                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <path
                                d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>

                    {/* Central text */}
                    <span className="text-xs text-white font-medium px-1.5">central</span>

                    {/* User profile */}
                    <button
                        onClick={() => setIsOpenDrawerAccountComponent(true)}
                        className="relative p-0.5 hover:bg-white/10 rounded-full transition-colors flex items-center justify-center"
                        data-tooltip-id="account"
                        data-tooltip-content="Compte"
                    >
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs relative shadow-sm">
                            {user?.prenom?.[0] || user?.nom?.[0] || 'C'}
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#27a082]"></span>
                        </div>
                    </button>
                </div>
            </header>

            <Tooltip id="notifications" />
            <Tooltip id="settings" />
            <Tooltip id="account" />

            <ConfirmModal
                isOpen={isOpenSignOut}
                title="Vous allez vous déconnecter"
                description="Votre session sera supprimée !!"
                cancelText="Annuler"
                confirm={() => {
                    logout();
                    setIsOpenSignOut(false);
                }}
                cancel={() => setIsOpenSignOut(false)}
                confirmText="Accepter"
            />

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
