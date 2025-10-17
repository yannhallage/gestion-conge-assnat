import { useState, useEffect } from "react";
import DiscussionComponent from "./DiscussionComponent";
import FileDrawer from "./FileDrawer";



interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
}


export default function Drawer({ isOpen,
    onClose, }: DrawerProps) {
    // const [isOpen, setIsOpen] = useState(false);
    const [onClickOnButton, setOnClickOnButton] = useState('Discussion');

    useEffect(() => {
        document.body.style.overflow = isOpen ? "hidden" : "auto";
    }, [isOpen]);
    return (
        <>

            <div
                className={`fixed inset-0 bg-black/10 z-20 transition-opacity ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onClose}
            ></div>


            <div
                className={`fixed top-0 right-0 h-full w-[55%] bg-white shadow-xl z-50 transform transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >

                <div className="flex h-full shadow-lg overflow-hidden border-gray-100">
                    <div className="w-[7%] border-r border-[#ccc]  flex flex-col items-center py-4 gap-6">
                        <button
                            className="w-9 h-9 rounded-md cursor-pointer flex items-center justify-center text-gray-400"
                            id=""
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv text-[#ccc]"><g id="i-l/info"><g id="Group"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M11.998 1.99902C6.47605 1.99902 1.99805 6.47602 1.99805 11.999C1.99805 17.522 6.47605 21.999 11.998 21.999C17.521 21.999 21.998 17.522 21.998 11.999C21.998 6.47602 17.521 1.99902 11.998 1.99902ZM13.248 17.35H10.748V10.574H13.248V17.35ZM13.248 9.25802H10.748V6.89002H13.248V9.25802Z" fill="currentColor"></path></g></g></svg>
                        </button>

                        <button
                            className="w-9 h-9 rounded-md cursor-pointer flex items-center justify-center text-gray-400"
                            id="Discussion"
                            onClick={() => { setOnClickOnButton('Discussion') }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv text-[#ccc]"><g id="a-d/comment"><g id="Group"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M21.17 1.99707H2.82402C2.36802 1.99707 1.99902 2.36196 1.99902 3.08274V18.2972C1.99902 18.4761 2.36802 18.841 2.82402 18.841H8.80002L11.998 21.9971L15.194 18.841H21.17C21.627 18.841 21.996 18.4761 21.996 18.2972V3.08274C21.996 2.36196 21.627 1.99707 21.17 1.99707ZM14.004 14.1884H7.33102V11.7431H14.004V14.1884ZM17.273 9.05995H7.33102V6.61568H17.273V9.05995Z" fill="currentColor"></path></g></g></svg>
                        </button>

                        <button
                            className="w-9 h-9 rounded-md cursor-pointer flex items-center justify-center text-gray-400"
                            id="Fichier"
                            onClick={() => { setOnClickOnButton('Fichier') }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv text-[#ccc]"><g id="a-d/attachment"><path id="Vector" fill-rule="evenodd" clip-rule="evenodd" d="M20.4798 13.1734C20.9997 12.6377 21.3852 12.0172 21.6409 11.3572C21.9794 10.482 22.0708 9.53801 21.9479 8.616C21.798 7.49056 21.321 6.40025 20.4798 5.53385C19.6372 4.66746 18.5789 4.17718 17.485 4.02351C15.9164 3.8012 14.2723 4.28927 13.0657 5.52862C13.0642 5.53014 13.0614 5.53197 13.0595 5.53294C13.0576 5.53391 13.057 5.53463 13.0555 5.53616L7.16166 11.6038C7.16127 11.6042 7.16127 11.6048 7.16166 11.6052C7.16206 11.6056 7.16206 11.6063 7.16166 11.6067L7.03956 11.7318C5.89276 13.0007 5.91989 14.994 7.11953 16.2292C8.32203 17.4658 10.26 17.4922 11.4939 16.3082L13.8746 13.8598L14.6958 13.0138L16.7936 10.8554C17.1953 10.4421 17.1952 9.78426 16.7935 9.37101C16.3753 8.94075 15.6843 8.94087 15.2662 9.37128L13.212 11.4859L12.3908 12.3319L10.0615 14.7276C9.65306 15.1198 9.0004 15.1096 8.6048 14.7013C8.20921 14.2959 8.19778 13.6227 8.52483 13.2597L11.591 10.1015L14.5402 7.06468L14.5444 7.06029C15.5113 6.06803 16.948 5.86753 18.1162 6.4383C18.4319 6.59343 18.7332 6.79247 18.9945 7.06176C19.6601 7.74668 19.9528 8.66283 19.8971 9.56143C19.8486 10.321 19.5572 11.0674 18.9945 11.6455C18.2091 12.4548 18.6875 11.963 18.8931 11.7508L16.0426 14.6852L13.0789 17.7354C13.0782 17.7361 13.0772 17.7363 13.0763 17.7359C13.0755 17.7354 13.0744 17.7356 13.0738 17.7363C13.0686 17.7423 13.0644 17.7516 13.0577 17.7571C11.0112 19.8645 7.68222 19.8645 5.63569 17.7571C3.58917 15.6511 3.58917 12.2236 5.63569 10.1176C5.6426 10.1119 5.65083 10.1062 5.65782 10.0993C5.65823 10.0989 5.65823 10.0982 5.65783 10.0978C5.65743 10.0974 5.65743 10.0967 5.65783 10.0963L10.8321 4.76956C11.2333 4.3565 11.2333 3.69927 10.8322 3.28617C10.4141 2.85572 9.7231 2.85565 9.30497 3.286L4.17185 8.56917C4.16614 8.57502 4.15757 8.58381 4.15185 8.58966C1.28272 11.543 1.28272 16.3316 4.15185 19.285C7.02099 22.2383 11.6725 22.2383 14.5416 19.285C14.5485 19.2793 14.5541 19.2709 14.5609 19.2638C14.5613 19.2634 14.5619 19.2634 14.5623 19.2638C14.5627 19.2642 14.5633 19.2642 14.5637 19.2638L20.4573 13.1965C20.4579 13.1958 20.4581 13.1947 20.4577 13.1939C20.4572 13.193 20.4574 13.1919 20.4581 13.1912C20.4649 13.1847 20.4717 13.1817 20.4798 13.1734Z" fill="currentColor"></path></g></svg>
                        </button>

                        <button
                            className="w-9 h-9 rounded-md cursor-pointer flex items-center justify-center text-gray-400"
                            id="Chemin"
                            onClick={() => { setOnClickOnButton('Chemin') }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv text-[#ccc]"><g id="e-h/history"><g id="Group 12"><rect id="Rectangle 38" width="9" height="3" transform="matrix(1 0 0 -1 7 13)" fill="currentColor"></rect><rect id="Rectangle 43" width="15" height="3" transform="matrix(1 0 0 -1 7 20)" fill="currentColor"></rect><rect id="Rectangle 40" width="15" height="3" transform="matrix(1 0 0 -1 7 6)" fill="currentColor"></rect><rect id="Rectangle 44" width="3" height="3" transform="matrix(1 0 0 -1 2 6)" fill="currentColor"></rect><rect id="Rectangle 45" width="3" height="3" transform="matrix(1 0 0 -1 2 13)" fill="currentColor"></rect><rect id="Rectangle 46" width="3" height="3" transform="matrix(1 0 0 -1 2 20)" fill="currentColor"></rect></g></g></svg>
                        </button>
                    </div>
                    <div className="flex-1 bg-white p-6 relative overflow-y-auto">
                        {/* Header icons top-right */}
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                            {/* PDF icon */}
                            <div className="w-9 h-9 rounded-md flex items-center justify-center text-gray-600">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path
                                        d="M16.85 3H3v18h18V7.167L16.85 3z"
                                        stroke="currentColor"
                                        strokeWidth="1.2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                    <path
                                        d="M12.018 18.4545 7.7775 14.214H10.215V8.7855H13.7145V14.214H16.2585L12.018 18.4545Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <div className="w-9 h-9 rounded-md flex items-center justify-center text-gray-600">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <circle cx="6" cy="12" r="1.5" fill="currentColor" />
                                    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                                    <circle cx="18" cy="12" r="1.5" fill="currentColor" />
                                </svg>
                            </div>

                            <button
                                onClick={onClose}
                                className="w-9 h-9 rounded-md flex items-center justify-center text-gray-600 hover:bg-gray-100"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex h-full">

                            <div className="w-[40%] pr-6 border-r border-gray-100">
                                <div className="flex items-start gap-4">
                                    <div className="relative">
                                        <div className="w-20 h-20 rounded-full bg-[#8dc572] text-white flex items-center justify-center text-gray-700 font-bold text-xl">
                                            AO
                                        </div>
                                        <div className="absolute -top-2 right-0 bg-red-100 text-red-600 text-xs font-extrabold px-2 py-0.5 rounded">
                                            ANNULÉ
                                        </div>
                                    </div>
                                    <div className="pt-1">
                                        <div className="text-gray-800 font-semibold text-lg">admin orathsa</div>
                                        <div className="text-gray-500 text-sm mt-1">Annual leave</div>
                                    </div>
                                </div>

                                <div className="mt-11 space-y-4 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400 uppercase tracking-wider">Date</span>
                                        <span className="text-gray-800">13/10/2025 - 16/10/2025</span>
                                    </div>

                                    <div className="flex justify-between ">
                                        <span className="text-gray-400 uppercase tracking-wider">Demandé</span>
                                        <span className="text-gray-800">4 jour</span>
                                    </div>

                                    <div className="flex justify-between items-center mt-5">
                                        <span className="text-gray-400 uppercase tracking-wider">Restant</span>
                                        <div className="flex items-center gap-3 w-1/2">
                                            <span className="text-gray-800 whitespace-nowrap">17 jour</span>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div className="h-2 bg-emerald-600 w-[85%]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-400 uppercase tracking-wider">Approbation</span>
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                                                AO
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-14">
                                        <h4 className="text-emerald-700 font-semibold text-sm mb-2">
                                            Absents en même temps
                                        </h4>
                                        <div className="flex items-center justify-between bg-gray-50 p-4 rounded border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                                        <path
                                                            d="M12 14c3.866 0 7 3.134 7 7H5c0-3.866 3.134-7 7-7zM12 14a4 4 0 100-8 4 4 0 000 8z"
                                                            fill="currentColor"
                                                        />
                                                    </svg>
                                                </div>
                                                <div className="text-sm text-gray-600">Toute l'organisation</div>
                                            </div>
                                            <div className="text-sm text-gray-400">Pas d'absents</div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <div className="flex-1 pl-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="text-sm text-gray-500">Organisé par</div>
                                        <div className="text-gray-800 font-semibold text-sm">admin orathsa</div>
                                    </div>
                                </div>

                                {onClickOnButton === "Discussion" && <DiscussionComponent />}

                                {onClickOnButton === "Fichier" && (
                                    <div className="p-4 text-gray-500 text-sm">
                                        <FileDrawer />
                                    </div>
                                )}

                                {onClickOnButton === "Chemin" && (
                                    <div className="p-4 text-gray-500 text-sm">
                                        Aucun chemin disponible.
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
