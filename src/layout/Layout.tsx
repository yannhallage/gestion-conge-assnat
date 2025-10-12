import type { ReactNode } from 'react';
import { Clock, FileText, CheckSquare, Users, Calendar, ClipboardList, HelpCircle, DollarSign, ArrowRightLeft } from 'lucide-react';

// import sidebarWithColor from './sidebarWithColor';
// import Sidebar from '../components/Sidebar';

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <div className="flex h-screen">
            {/* Barre verte à gauche */}
            <aside className="w-15 bg-[#27a082] text-white flex flex-col justify-between p-4"></aside>

            {/* Barre du milieu (avec scroll) */}
            <aside className="w-58 bg-[#F8F8F8] flex flex-col justify-between p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
                <div>
                    {/* Logo */}
                    <div className="flex items-center mb-5 space-x-2">
                        <img
                            src="https://app-new.calamari.io/version-5.249.2/assets/logo-C94mehfa.svg"
                            alt="logo"
                            className="w-50 h-30"
                        />
                    </div>

                    {/* Présence */}
                    <div className="mb-6">
                        <h3 className="text-sm uppercase tracking-wide text-emerald-200 mb-2">
                            Présence
                        </h3>
                        <ul className="space-y-4 mt-5">
                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g id="a-d/clock">
                                        <g id="ic_zegar">
                                            <g id="Group 5">
                                                <path
                                                    id="Fill 1"
                                                    fillRule="evenodd"
                                                    clipRule="evenodd"
                                                    d="M9 2H15V0H9V2Z"
                                                    fill="currentColor"
                                                ></path>
                                                <g id="Group 4">
                                                    <path
                                                        id="Fill 2"
                                                        fillRule="evenodd"
                                                        clipRule="evenodd"
                                                        d="M16.1626 17.0796C13.9092 19.334 10.2547 19.334 8.00076 17.0796C7.58924 16.6674 7.25384 16.2081 6.99302 15.7199L12.0819 12.9979V7.22466C13.5591 7.22466 15.0356 7.78853 16.1626 8.91578C18.4166 11.1703 18.4166 14.8251 16.1626 17.0796ZM22 6.87547L20.4503 4.64077L18.8662 5.7396C14.9474 2.02897 8.76849 2.0848 4.92883 5.92485C1.02372 9.83087 1.02372 16.1645 4.92883 20.0705C8.83446 23.9765 15.1661 23.9765 19.0712 20.0705C22.3821 16.7593 22.8748 11.7083 20.5721 7.86619L22 6.87547Z"
                                                        fill="currentColor"
                                                    ></path>
                                                </g>
                                            </g>
                                        </g>
                                    </g>
                                </svg>
                                <span>Horloge</span>
                            </li>

                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g id="r-u/timesheet">
                                        <path
                                            id="Fill 4"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M15.0358 6.14371V4.80379C15.0358 4.3601 14.7101 4 14.3072 4H11.9996H9.69281C9.29061 4 8.96419 4.3601 8.96419 4.80379V6.14371H2V10.7647C3.40552 11.4945 7.01876 13.0563 11.9996 12.9984C16.9812 13.0563 20.5945 11.4945 22 10.7647V6.14371H15.0358Z"
                                            fill="currentColor"
                                        ></path>
                                        <path
                                            id="Fill 1"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M13.7491 16.7216H12.0004H10.2517V14.8445C6.55754 14.6466 3.70279 13.7199 2 13V21H12.0004H22V13C20.2972 13.7199 17.4425 14.6466 13.7491 14.8445V16.7216Z"
                                            fill="currentColor"
                                        ></path>
                                    </g>
                                </svg>
                                <span>Feuille de temps</span>
                            </li>

                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg
                                    width="19"
                                    height="19"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g id="a-d/approval">
                                        <path
                                            id="Fill 1"
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M11.6505 16.9027L7.12951 12.715L8.61414 11.1118L11.5296 13.8111L16.2144 8.73324L17.8199 10.2155L11.6505 16.9027ZM12 2C6.4773 2 2 6.4779 2 12.0004C2 17.5229 6.4773 22 12 22C17.5227 22 22 17.5229 22 12.0004C22 6.4779 17.5227 2 12 2Z"
                                            fill="currentColor"
                                        ></path>
                                    </g>
                                </svg>
                                <span>Approbations</span>
                            </li>

                            <li className="flex items-center space-x-3 text-emerald-100 font-semibold">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g id="m-q/presence">
                                        <g id="Frame" clipPath="url(#clip0_2565_5)">
                                            <g id="Group">
                                                <path
                                                    id="Vector"
                                                    d="M15.8 13.9C15.5 13.9 15 13.8 14.4 13.6C12.9 13.1 12.8 11.7 12.8 11.7C13.5 11.2 14.1 10.5 14.7 9.6C15.4 8.5 15.5 6.5 15.5 5.5C15.5 5.2 15.5 5 15.4 4.7C15 2.6 13.2 1 10.9 1C8.6 1 6.8 2.6 6.4 4.7C6.4 4.9 6.3 5.2 6.3 5.5C6.3 6.6 6.4 8.5 7.1 9.6C7.5 10.4 8 11 8.6 11.4C8.6 11.4 8.3 13.2 6.9 13.6L3.7 14.3C2 14.9 2 16.9 2 16.9V20H12.5C12.4 19.7 12.4 19.3 12.4 19C12.4 16.7 13.8 14.7 15.8 13.9Z"
                                                    fill="currentColor"
                                                ></path>
                                                <path
                                                    id="Vector_2"
                                                    d="M18 23C20.2091 23 22 21.2091 22 19C22 16.7909 20.2091 15 18 15C15.7909 15 14 16.7909 14 19C14 21.2091 15.7909 23 18 23Z"
                                                    fill="currentColor"
                                                ></path>
                                            </g>
                                        </g>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2565_5">
                                            <rect width="20" height="22" fill="white" transform="translate(2 1)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span>Présence</span>
                            </li>
                        </ul>
                    </div>

                    {/* Congés */}
                    <div className='mt-3'>
                        <h3 className="uppercase tracking-wide text-bold text-emerald-200 mb-2">Congés</h3>
                        <ul className="space-y-4 mt-5">
                            <li className=" text-[#6b7280] flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors">
                                <svg width="19" height="19" className='' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/request"><g id="ic_wnioskuj"><g id="wnioskuj"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M18.7402 10.1818L13.8473 5.2806L17.1159 1.99414L22.0098 6.89644L18.7402 10.1818ZM6.90469 22.0173H2.00977V17.114L12.5043 6.56464L17.3992 11.468L6.90469 22.0173Z" fill="currentColor"></path></g></g></g></svg>
                                <span>Demander</span>
                            </li>
                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/calendar2"><g id="ic_kalendarz"><g id="kalendarz"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M2 22.001V12.145H22.001V22.001H2ZM2 5.216H5.256V2H7.6V5.216H16.879V2H19.223V5.216H22.001V10.235H2V5.216Z" fill="currentColor"></path></g></g></g></svg>
                                <span>Calendrier</span>
                            </li>
                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/requests"><g id="ic_zgloszenia"><g id="zgloszenia"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M16.915 1.99707H4V21.9941H21V6.10307L16.915 1.99707ZM16.235 17.7891H7.593V15.7521H16.235V17.7891ZM16.235 14.2411H7.593V12.2041H16.235V14.2411ZM15.896 7.14107V3.47007L19.542 7.14107H15.896Z" fill="currentColor"></path></g></g></g></svg>
                                <span>Demandes</span>
                            </li>
                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/ok"><path id="Subtract" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.0059 13.5635L8.08301 10.6406L6.61133 12.1123L11.0059 16.5068L11.1738 16.3379L11.1748 16.3389L17.5684 9.94531L16.0967 8.47363L11.0059 13.5635Z" fill="currentColor"></path></g></svg>
                                <span>Approbations</span>
                            </li>
                            <li className="flex items-center space-x-3 px-2 py-1 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="e-h/entitlement"><path id="Vector" d="M20.1232 18.9787H15.4721C15.4419 18.9787 15.4174 18.9522 15.4174 18.9198V6.65566C15.4174 6.62298 15.4419 6.59677 15.4721 6.59677H20.1232C20.1534 6.59677 20.1779 6.62298 20.1779 6.65566V18.9198C20.1779 18.9522 20.1534 18.9787 20.1232 18.9787ZM14.1399 18.9787H9.48884C9.45862 18.9787 9.43409 18.9471 9.43409 18.9079V4.07081C9.43409 4.03166 9.45862 4 9.48884 4H14.1399C14.1701 4 14.1946 4.03166 14.1946 4.07081V18.9079C14.1946 18.9471 14.1701 18.9787 14.1399 18.9787ZM8.17258 18.9787H3.52155C3.51433 18.9787 3.50718 18.9774 3.50052 18.9747C3.49385 18.972 3.4878 18.9682 3.48271 18.9632C3.47762 18.9583 3.47359 18.9525 3.47086 18.9461C3.46813 18.9397 3.46675 18.9329 3.4668 18.926V8.72681C3.4668 8.69787 3.49133 8.67438 3.52155 8.67438H8.17258C8.2028 8.67438 8.22733 8.69787 8.22733 8.72681V18.926C8.22738 18.9329 8.226 18.9397 8.22327 18.9461C8.22053 18.9525 8.21651 18.9583 8.21142 18.9632C8.20633 18.9682 8.20028 18.972 8.19361 18.9747C8.18695 18.9774 8.1798 18.9787 8.17258 18.9787Z" fill="currentColor"></path></g></svg>
                                <span>Disponibilité</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom icons */}
                <div className="space-y-4">
                    <DollarSign className="w-5 h-5" />
                    <HelpCircle className="w-5 h-5" />
                </div>
            </aside>

            {/* Partie principale */}
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>

    );
}
