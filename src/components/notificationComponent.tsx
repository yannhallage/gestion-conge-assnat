import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}
export default function DrawerNotifications({ isOpen, onClose }: DrawerProps) {
    const [sendInvitation, setSendInvitation] = useState(false);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<
        { id: number; title: string; message: string; date: string }[]
    >([]);

    // 🧠 Simulation du chargement de notifications
    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const timer = setTimeout(() => {
                // 👇 Change ce tableau par un appel API plus tard
                const data = [
                    {
                        id: 1,
                        title: "Mise à jour des congés",
                        message:
                            "Le service RH informe que les congés doivent être validés avant le 31 octobre.",
                        date: "Aujourd'hui à 09:30",
                    },
                    {
                        id: 2,
                        title: "Nouvelle politique de télétravail",
                        message:
                            "À partir du 1er novembre, un jour supplémentaire de télétravail sera possible chaque semaine.",
                        date: "Hier à 16:45",
                    },
                ];
                setNotifications(data);
                setLoading(false);
            }, 700);

            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Empêche le scroll en arrière-plan
    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleClose = () => {
        setSendInvitation(false);
        onClose();
    };

    return (
        <>
            {/* --- Overlay --- */}
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleClose}
            />

            {/* --- Drawer --- */}
            <div
                className={`fixed top-0 right-0 h-full w-[40%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                {/* --- Header --- */}
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400"
                        >
                            <path
                                d="M17.9111 12.8C17.2444 12.8 16.5778 12.6222 15.9556 12.3111C14.6667 11.6444 13.8222 10.2667 13.8222 8.75556C13.8222 7.73333 14.1778 6.8 14.8889 6.04444C15.6444 5.2 16.7556 4.71111 17.9111 4.71111C20.1778 4.71111 22 6.53333 22 8.75556C22 10.9778 20.1778 12.8 17.9111 12.8ZM15.9556 13.3333C15.9556 14.0444 16.1778 16.0889 18.4 16.8444V18.9778H2V16.8444C4.71111 15.9111 4.44444 13.0667 4.44444 13.0667V10V9.86667C4.48889 7.15556 6.48889 4.88889 9.11111 4.35556C9.82222 4.22222 10.5778 4.22222 11.3333 4.35556C12.3111 4.53333 13.2444 4.97778 14.0444 5.64444C13.3333 6.53333 12.9333 7.6 12.9333 8.71111C12.9333 10.8 14.1778 12.5778 15.9556 13.3333ZM9.11111 3.64444V3.11111C9.11111 2.48889 9.6 2 10.2222 2C10.8 2 11.3333 2.48889 11.3333 3.11111V3.64444C10.9778 3.6 10.5778 3.55556 10.2222 3.55556C9.82222 3.55556 9.46667 3.6 9.11111 3.64444ZM10.5333 19.6889H12.7556C12.6667 20.9778 11.5556 22 10.2222 22C8.88889 22 7.77778 20.9778 7.68889 19.6889H10.5333Z"
                                fill="currentColor"
                            />
                        </svg>
                        <h1 className="text-xl font-normal text-gray-700">Notifications</h1>
                    </div>
                </header>

                {/* --- Contenu --- */}
                <div className="flex h-full overflow-hidden relative">
                    {/* Loader */}
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <ClipLoader
                                color="#27a082"
                                loading={loading}
                                size={40}
                                speedMultiplier={3}
                            />
                        </div>
                    )}

                    <main className="flex-1 p-6 overflow-y-auto">
                        {/* Si pas de notifications */}
                        {!loading && notifications.length === 0 && <AucuneHistorique />}

                        {/* Si notifications disponibles */}
                        {!loading &&
                            notifications.length > 0 &&
                            notifications.map((notif) => (
                                <div
                                    key={notif.id}
                                    className="p-4 mb-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
                                >
                                    <h3 className="font-semibold text-gray-800">
                                        {notif.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {notif.message}
                                    </p>
                                    <span className="text-xs text-gray-400 mt-2 block">
                                        {notif.date}
                                    </span>
                                </div>
                            ))}
                    </main>
                </div>
            </div>
        </>
    );
}

// 🧩 Composant affiché quand il n’y a aucune notification
const AucuneHistorique = () => (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center text-gray-600">
        <div className="relative">
            <div className="w-[320px] h-[180px] flex items-center justify-center">
                <img
                    src="data:image/svg+xml,%3csvg%20width='272'%20height='214'%20viewBox='0%200%20272%20214'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_652_30126)'%3e%3cpath%20d='M55.1728%2085.1073L53.7656%2083.7002L35.6002%20101.866L37.0074%20103.273L55.1728%2085.1073Z'%20fill='white'/%3e%3cpath%20d='M223.208%20207.9C161.078%20207.9%20147.258%20212.71%2088.1785%20213.31C29.0885%20213.91%2040.3885%20210.52%2023.5585%20200.7C6.72849%20190.88%20-14.9915%20188.81%2014.7185%20181.47C24.6185%20179.02%2056.5785%20179.48%2068.2785%20179.08C126.258%20176.95%20162.718%20179.4%20210.748%20179.08C227.948%20178.96%20303.519%20183.89%20257.139%20189.3C210.779%20194.68%20285.349%20207.9%20223.208%20207.9Z'%20fill='%23F5F7FA'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_652_30126'%3e%3crect%20width='271.98'%20height='213.38'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                    alt="aucune donnée"
                />
            </div>
        </div>
        <h2 className="text-gray-700 text-lg mt-4 font-medium">
            Aucune notification
        </h2>
        <p className="text-sm text-gray-400 mt-2 max-w-md">
            Vous n'avez actuellement aucune notification. Les nouvelles annonces
            apparaîtront ici dès leur publication.
        </p>
    </div>
);
