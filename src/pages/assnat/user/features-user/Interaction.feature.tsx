// import { Info, Lightbulb, Zap, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
// import React from 'react';


export default function InteractionUser() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.1, ease: "easeOut" }}
            >
                <header className="border-b border-gray-200 px-5 py-3">
                    <h1 className="text-xl text-gray-800">Interaction rh</h1>
                </header>
                <div className='p-3'>
                    {/* Barre de recherche */}
                    <div className="flex flex-wrap items-center gap-3 mb-6 ">
                        {/* <input
                        type="text"
                        placeholder="Recherche de demande"
                        className="border border-[#ccc] px-3 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-green-200"
                    /> */}

                        <button className="flex items-center bg-[#f6f7f9] hover:bg-gray-50 gap-2 text-sm text-gray-700 rounded border-[#ccc] px-3 py-2">
                            <span className="text-gray-500 "><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/date"><g id="Frame 4"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M8 3H6V5H5.11765C3.9481 5 3 5.95513 3 7.13333V18.8667C3 20.0449 3.9481 21 5.11765 21H18.8824C20.0519 21 21 20.0449 21 18.8667V7.13333C21 5.95513 20.0519 5 18.8824 5H18V3H16V5H8V3ZM5.11765 18.8667L5.11765 11H18.8824V18.8667H5.11765ZM7 16V14H9V16H7ZM11 14H13V16H11V14Z" fill="currentColor"></path></g></g></svg></span>
                            <span>Date: Tous</span>
                        </button>

                        <button className="flex items-center bg-[#f6f7f9] hover:bg-gray-50 rounded  gap-2 text-sm text-gray-700 border-[#ccc] px-3 py-2">
                            <span className="text-gray-500"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/status"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12ZM19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" fill="currentColor"></path></g></svg></span>
                            <span>Statut: Tous</span>
                        </button>

                        <button className="flex items-center gap-2 bg-[#f6f7f9] text-sm hover:bg-gray-50 rounded text-gray-700 border-[#ccc] px-3 py-2">
                            <span className="text-gray-500"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/palm"><g id="palm"><path id="Vector" d="M18.7303 10.5533C17.8577 9.6315 16.7769 9.27469 15.7654 9.18548L18.1254 8.46194L18.5221 7.45097L19.1964 8.18442L20.5449 7.61946C20.5449 7.61946 19.5434 4.82441 16.291 5.46866C15.2895 5.66689 14.5656 6.13273 14.0599 6.68778C13.9508 5.91468 13.6236 5.11185 12.9096 4.34866C10.5992 1.87078 8.22932 3.56565 8.22932 3.56565L9.01268 4.83432L9.96461 4.63609L9.73654 5.69663L11.3132 7.76814C10.391 7.12389 9.13167 6.73734 7.48562 7.27256C4.82814 8.15468 3.86629 10.5434 3.90596 11.4057L5.25453 11.2669L5.75033 10.4542L6.19654 11.0885L7.98142 10.9795L8.51688 9.94867L8.92343 10.7912L11.6999 10.3848C10.6091 11.6733 9.41923 13.7745 9.3994 16.7975C9.42915 16.7876 9.45889 16.7876 9.49856 16.7777C9.8952 16.7182 10.3018 16.6885 10.7083 16.6885C11.2636 16.6885 11.809 16.748 12.3444 16.857C12.3742 16.8669 12.394 16.8669 12.4238 16.8768C12.3048 15.3901 12.4733 12.6446 13.6038 10.6524L16.172 13.1402L16.9554 12.8726L16.9355 13.8637L18.3733 15.0729L19.0675 14.7855L18.9286 15.6974L20.0491 16.6885C20.7532 15.1225 21.0903 13.0312 18.7303 10.5533Z" fill="currentColor"></path><path id="Vector_2" d="M10.6982 17.2432C10.3115 17.2432 9.9347 17.2729 9.56781 17.3324C7.23756 17.6892 5.34361 19.1164 4.58008 20.9996H16.8164C16.1024 19.2255 14.377 17.8577 12.2352 17.4017C11.7493 17.2927 11.2337 17.2432 10.6982 17.2432Z" fill="currentColor"></path></g></g></svg></span>
                            <span>Type d'absence: Quelconque</span>
                        </button>
                    </div>
                </div>

                <InfoDisplay />
            </motion.div>
        </>
    )
}



// Composant d’affichage lorsqu’il n’y a aucune annonce
const AucuneHistorique = () => {
    return (
        <motion.div
            className="flex flex-col items-center justify-center h-[80vh] text-center text-gray-600"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >
            <div className="relative">
                <div className="w-[520px] h-[220px] flex items-center justify-center">
                    <img
                        src="data:image/svg+xml,%3csvg%20width='272'%20height='214'%20viewBox='0%200%20272%20214'%20fill='none'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20clip-path='url(%23clip0_652_30126)'%3e%3cpath%20d='M55.1728%2085.1073L53.7656%2083.7002L35.6002%20101.866L37.0074%20103.273L55.1728%2085.1073Z'%20fill='white'/%3e%3cpath%20d='M223.208%20207.9C161.078%20207.9%20147.258%20212.71%2088.1785%20213.31C29.0885%20213.91%2040.3885%20210.52%2023.5585%20200.7C6.72849%20190.88%20-14.9915%20188.81%2014.7185%20181.47C24.6185%20179.02%2056.5785%20179.48%2068.2785%20179.08C126.258%20176.95%20162.718%20179.4%20210.748%20179.08C227.948%20178.96%20303.519%20183.89%20257.139%20189.3C210.779%20194.68%20285.349%20207.9%20223.208%20207.9Z'%20fill='%23F5F7FA'/%3e%3c/g%3e%3cdefs%3e%3cclipPath%20id='clip0_652_30126'%3e%3crect%20width='271.98'%20height='213.38'%20fill='white'/%3e%3c/clipPath%3e%3c/defs%3e%3c/svg%3e"
                        alt="aucune donnée"
                    />
                </div>
            </div>

            <div className="mt-4">
                <h2 className="text-gray-700 text-lg mt-6">
                    Aucune demande historique
                </h2>
            </div>
            <p className="text-sm text-gray-400 mt-2 max-w-md">
                Il n'y a actuellement aucune demande historique. Toutes les annonces ou
                demandes passées apparaîtront ici.
            </p>
        </motion.div>
    );
};

// Composant principal d’affichage des annonces
const InfoDisplay = () => {
    const newsItems = [
        {
            date: "Today",
            time: "03:00",
            title: "Bienvenue dans l'Ère du Zéro !",
            description:
                "Chers Traders, le jour est enfin arrivé ! Aujourd'hui, nous avons officiellement lancé nos services de Spot Trading avec adhésion. Notre plateforme est...",
        },
        {
            date: "Jun 03",
            year: "2020",
            title: "L'Ère du Zéro approche !",
            description:
                "Chers Traders, le jour est enfin arrivé ! Aujourd'hui, nous avons officiellement lancé nos services de Spot Trading avec adhésion. Notre plateforme est...",
        },
        {
            date: "Jun 03",
            year: "2020",
            title: "L'Ère du Zéro approche !",
            description:
                "Chers Traders, le jour est enfin arrivé ! Aujourd'hui, nous avons officiellement lancé nos services de Spot Trading avec adhésion. Notre plateforme est...",
        },
        {
            date: "Jun 03",
            year: "2020",
            title: "L'Ère du Zéro approche !",
            description:
                "Chers Traders, le jour est enfin arrivé ! Aujourd'hui, nous avons officiellement lancé nos services de Spot Trading avec adhésion. Notre plateforme est...",
        },
        {
            date: "Jun 03",
            year: "2020",
            title: "L'Ère du Zéro approche !",
            description:
                "Chers Traders, le jour est enfin arrivé ! Aujourd'hui, nous avons officiellement lancé nos services de Spot Trading avec adhésion. Notre plateforme est...",
        },
        {
            date: "Jun 03",
            year: "2020",
            title: "L'Ère du Zéro approche !",
            description:
                "Chers Traders, le jour est enfin arrivé ! Aujourd'hui, nous avons officiellement lancé nos services de Spot Trading avec adhésion. Notre plateforme est...",
        },
    ];
    if (newsItems.length === 0) {
        return <AucuneHistorique />;
    }
    return (
        <div className="bg-white p-8">
            {newsItems.map((item, index) => (
                <div
                    key={index}
                    className={`flex ${index > 0 ? "mt-8 pt-8 border-t border-gray-200" : ""
                        }`}
                >
                    <div className="flex-shrink-0 w-24 text-right pr-6">
                        <p className="text-sm font-semibold text-gray-700">{item.date}</p>
                        {item.time && (
                            <p className="text-xs text-gray-500">{item.time}</p>
                        )}
                        {item.year && (
                            <p className="text-xs text-gray-500">{item.year}</p>
                        )}
                    </div>
                    <div className="flex-grow">
                        <h3 className="text-base text-gray-800 mb-1">{item.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {item.description}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};

