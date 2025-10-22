import { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DrawerNotifications({ isOpen, onClose }: DrawerProps) {
    const [sendInvitation, setSendInvitation] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            const timer = setTimeout(() => setLoading(false), 700);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);

    const handleClose = () => {
        setSendInvitation(false);
        onClose();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={handleClose}
            />

            <div
                className={`fixed top-0 right-0 h-full w-[40%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    } flex flex-col`}
            >
                <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="cursor-pointer text-gray-300"><g id="m-q/notifications"><path id="Vector" d="M17.9111 12.8C17.2444 12.8 16.5778 12.6222 15.9556 12.3111C14.6667 11.6444 13.8222 10.2667 13.8222 8.75556C13.8222 7.73333 14.1778 6.8 14.8889 6.04444C15.6444 5.2 16.7556 4.71111 17.9111 4.71111C20.1778 4.71111 22 6.53333 22 8.75556C22 10.9778 20.1778 12.8 17.9111 12.8ZM15.9556 13.3333C15.9556 14.0444 16.1778 16.0889 18.4 16.8444V18.9778H2V16.8444C4.71111 15.9111 4.44444 13.0667 4.44444 13.0667V10V9.86667C4.48889 7.15556 6.48889 4.88889 9.11111 4.35556C9.82222 4.22222 10.5778 4.22222 11.3333 4.35556C12.3111 4.53333 13.2444 4.97778 14.0444 5.64444C13.3333 6.53333 12.9333 7.6 12.9333 8.71111C12.9333 10.8 14.1778 12.5778 15.9556 13.3333ZM9.11111 3.64444V3.11111C9.11111 2.48889 9.6 2 10.2222 2C10.8 2 11.3333 2.48889 11.3333 3.11111V3.64444C10.9778 3.6 10.5778 3.55556 10.2222 3.55556C9.82222 3.55556 9.46667 3.6 9.11111 3.64444ZM10.5333 19.6889H12.7556C12.6667 20.9778 11.5556 22 10.2222 22C8.88889 22 7.77778 20.9778 7.68889 19.6889H10.5333Z" fill="currentColor"></path></g></svg>
                        <h1 className="text-xl font-normal text-gray-700">Notifications</h1>
                    </div>
                </header>

                <div className="flex h-full overflow-hidden relative">
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-white z-50">
                            <ClipLoader
                                color="#27a082"
                                loading={loading}
                                size={40}
                                speedMultiplier={3}
                                aria-label="Chargement..."
                                data-testid="loader"
                            />
                        </div>
                    )}
                    {/* <main className="flex-1 p-8 overflow-y-auto">{renderComponent()}</main> */}
                    <main className="flex-1 p-8 overflow-y-auto">{""}</main>
                </div>
            </div>
        </>
    );
}

