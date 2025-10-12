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
            <aside className="w-15 bg-[#27a082] text-white flex flex-col justify-between p-4">
                <div className="space-y-4 mt-auto">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv cursor-pointer"><g id="m-q/notifications"><path id="Vector" d="M17.9111 12.8C17.2444 12.8 16.5778 12.6222 15.9556 12.3111C14.6667 11.6444 13.8222 10.2667 13.8222 8.75556C13.8222 7.73333 14.1778 6.8 14.8889 6.04444C15.6444 5.2 16.7556 4.71111 17.9111 4.71111C20.1778 4.71111 22 6.53333 22 8.75556C22 10.9778 20.1778 12.8 17.9111 12.8ZM15.9556 13.3333C15.9556 14.0444 16.1778 16.0889 18.4 16.8444V18.9778H2V16.8444C4.71111 15.9111 4.44444 13.0667 4.44444 13.0667V10V9.86667C4.48889 7.15556 6.48889 4.88889 9.11111 4.35556C9.82222 4.22222 10.5778 4.22222 11.3333 4.35556C12.3111 4.53333 13.2444 4.97778 14.0444 5.64444C13.3333 6.53333 12.9333 7.6 12.9333 8.71111C12.9333 10.8 14.1778 12.5778 15.9556 13.3333ZM9.11111 3.64444V3.11111C9.11111 2.48889 9.6 2 10.2222 2C10.8 2 11.3333 2.48889 11.3333 3.11111V3.64444C10.9778 3.6 10.5778 3.55556 10.2222 3.55556C9.82222 3.55556 9.46667 3.6 9.11111 3.64444ZM10.5333 19.6889H12.7556C12.6667 20.9778 11.5556 22 10.2222 22C8.88889 22 7.77778 20.9778 7.68889 19.6889H10.5333Z" fill="currentColor"></path></g></svg>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ui_icon_1z4c4c0lsv core_helpIcon_1smntdnyha"><g id="e-h/help"><g id="help" clip-path="url(#clip0_15_100)"><g id="Group"><path id="Vector" d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM11.7 18C10.8 18 10.2 17.4 10.2 16.5C10.2 15.7 10.8 15.1 11.6 15.1C12.5 15.1 13 15.7 13 16.6C13.1 17.4 12.5 18 11.7 18ZM15.2 11C15 11.3 14.6 11.6 14 12L13.4 12.4C13.1 12.7 12.9 12.9 12.8 13.1C12.8 13.2 12.7 13.3 12.7 13.4C12.7 13.8 12.4 13.8 12.4 13.8H10.9C10.9 13.8 10.5 13.9 10.5 13.2C10.5 12.6 10.6 12.3 10.9 12C11.4 11.4 12.6 10.7 12.6 10.6C12.8 10.5 12.9 10.3 13 10.2C13.2 9.9 13.3 9.6 13.3 9.4C13.3 9 13.2 8.7 13 8.4C12.8 8.2 12.4 8 11.8 8C11.3 8 10.9 8.2 10.7 8.6C10.5 8.9 10.3 9.3 10.3 9.7V9.8H8V9.7C8.1 8.3 8.6 7.2 9.5 6.6C10.1 6.2 10.9 6 11.7 6C12.8 6 13.8 6.3 14.6 6.8C15.4 7.4 15.8 8.2 15.8 9.3C15.8 9.9 15.6 10.5 15.2 11Z" fill="currentColor"></path></g></g></g><defs><clipPath id="clip0_15_100"><rect width="20" height="20" fill="white" transform="translate(2 2)"></rect></clipPath></defs></svg>
                    <img
                        className='rounded-full cursor-pointer'
                        src="https://calamari-prod-avatars-eu-west-1.s3.amazonaws.com/38293/90de9e720a098f3fdce7049a798bb623.1Yf8r6AqopaNcmLExJrEKtrq1.png" alt="admin orathsa"
                    />
                </div>
            </aside>

            {/* Barre du milieu (avec scroll) */}
            <aside className="w-60 bg-[#f6f7f9] border-r-1 border-[#ccc] flex flex-col justify-between p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-300 scrollbar-track-gray-100">
                <div>
                    {/* Logo */}
                    <div className="flex items-center mb-5 space-x-2">
                        <img
                            src="https://app-new.calamari.io/version-5.249.2/assets/logo-C94mehfa.svg"
                            alt="logo"
                            className="w-50 h-30"
                        />
                    </div>
                    <div className='space-y-4'>
                        {/* Congés */}
                        <div className='mt-3'>
                            <h3 className="uppercase text-[#27a082] font-bold mb-2 text-[12px]">Congés</h3>
                            <ul className="space-y-2 mt-2">
                                <li className=" text-[#6b7280] flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors">
                                    <svg width="23" height="23" className='' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/request"><g id="ic_wnioskuj"><g id="wnioskuj"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M18.7402 10.1818L13.8473 5.2806L17.1159 1.99414L22.0098 6.89644L18.7402 10.1818ZM6.90469 22.0173H2.00977V17.114L12.5043 6.56464L17.3992 11.468L6.90469 22.0173Z" fill="currentColor"></path></g></g></g></svg>
                                    <span>Demander</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/calendar2"><g id="ic_kalendarz"><g id="kalendarz"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M2 22.001V12.145H22.001V22.001H2ZM2 5.216H5.256V2H7.6V5.216H16.879V2H19.223V5.216H22.001V10.235H2V5.216Z" fill="currentColor"></path></g></g></g></svg>
                                    <span>Calendrier</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/requests"><g id="ic_zgloszenia"><g id="zgloszenia"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M16.915 1.99707H4V21.9941H21V6.10307L16.915 1.99707ZM16.235 17.7891H7.593V15.7521H16.235V17.7891ZM16.235 14.2411H7.593V12.2041H16.235V14.2411ZM15.896 7.14107V3.47007L19.542 7.14107H15.896Z" fill="currentColor"></path></g></g></g></svg>
                                    <span>Demandes</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/ok"><path id="Subtract" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.0059 13.5635L8.08301 10.6406L6.61133 12.1123L11.0059 16.5068L11.1738 16.3379L11.1748 16.3389L17.5684 9.94531L16.0967 8.47363L11.0059 13.5635Z" fill="currentColor"></path></g></svg>
                                    <span>Approbations</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="e-h/entitlement"><path id="Vector" d="M20.1232 18.9787H15.4721C15.4419 18.9787 15.4174 18.9522 15.4174 18.9198V6.65566C15.4174 6.62298 15.4419 6.59677 15.4721 6.59677H20.1232C20.1534 6.59677 20.1779 6.62298 20.1779 6.65566V18.9198C20.1779 18.9522 20.1534 18.9787 20.1232 18.9787ZM14.1399 18.9787H9.48884C9.45862 18.9787 9.43409 18.9471 9.43409 18.9079V4.07081C9.43409 4.03166 9.45862 4 9.48884 4H14.1399C14.1701 4 14.1946 4.03166 14.1946 4.07081V18.9079C14.1946 18.9471 14.1701 18.9787 14.1399 18.9787ZM8.17258 18.9787H3.52155C3.51433 18.9787 3.50718 18.9774 3.50052 18.9747C3.49385 18.972 3.4878 18.9682 3.48271 18.9632C3.47762 18.9583 3.47359 18.9525 3.47086 18.9461C3.46813 18.9397 3.46675 18.9329 3.4668 18.926V8.72681C3.4668 8.69787 3.49133 8.67438 3.52155 8.67438H8.17258C8.2028 8.67438 8.22733 8.69787 8.22733 8.72681V18.926C8.22738 18.9329 8.226 18.9397 8.22327 18.9461C8.22053 18.9525 8.21651 18.9583 8.21142 18.9632C8.20633 18.9682 8.20028 18.972 8.19361 18.9747C8.18695 18.9774 8.1798 18.9787 8.17258 18.9787Z" fill="currentColor"></path></g></svg>
                                    <span>Disponibilité</span>
                                </li>
                            </ul>
                        </div>
                        <div className='mt-3'>
                            <h3 className="uppercase text-[#27a082] font-bold mb-2 text-[12px]">Congés</h3>
                            <ul className="space-y-2 mt-2">
                                <li className=" text-[#6b7280] flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors">
                                    <svg width="23" height="23" className='' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/request"><g id="ic_wnioskuj"><g id="wnioskuj"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M18.7402 10.1818L13.8473 5.2806L17.1159 1.99414L22.0098 6.89644L18.7402 10.1818ZM6.90469 22.0173H2.00977V17.114L12.5043 6.56464L17.3992 11.468L6.90469 22.0173Z" fill="currentColor"></path></g></g></g></svg>
                                    <span>Demander</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/calendar2"><g id="ic_kalendarz"><g id="kalendarz"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M2 22.001V12.145H22.001V22.001H2ZM2 5.216H5.256V2H7.6V5.216H16.879V2H19.223V5.216H22.001V10.235H2V5.216Z" fill="currentColor"></path></g></g></g></svg>
                                    <span>Calendrier</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/requests"><g id="ic_zgloszenia"><g id="zgloszenia"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M16.915 1.99707H4V21.9941H21V6.10307L16.915 1.99707ZM16.235 17.7891H7.593V15.7521H16.235V17.7891ZM16.235 14.2411H7.593V12.2041H16.235V14.2411ZM15.896 7.14107V3.47007L19.542 7.14107H15.896Z" fill="currentColor"></path></g></g></g></svg>
                                    <span>Demandes</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/ok"><path id="Subtract" d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2ZM11.0059 13.5635L8.08301 10.6406L6.61133 12.1123L11.0059 16.5068L11.1738 16.3379L11.1748 16.3389L17.5684 9.94531L16.0967 8.47363L11.0059 13.5635Z" fill="currentColor"></path></g></svg>
                                    <span>Approbations</span>
                                </li>
                                <li className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-emerald-200 hover:text-emerald-900 cursor-pointer transition-colors text-[#6b7280]">
                                    <svg width="23" height="23" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="e-h/entitlement"><path id="Vector" d="M20.1232 18.9787H15.4721C15.4419 18.9787 15.4174 18.9522 15.4174 18.9198V6.65566C15.4174 6.62298 15.4419 6.59677 15.4721 6.59677H20.1232C20.1534 6.59677 20.1779 6.62298 20.1779 6.65566V18.9198C20.1779 18.9522 20.1534 18.9787 20.1232 18.9787ZM14.1399 18.9787H9.48884C9.45862 18.9787 9.43409 18.9471 9.43409 18.9079V4.07081C9.43409 4.03166 9.45862 4 9.48884 4H14.1399C14.1701 4 14.1946 4.03166 14.1946 4.07081V18.9079C14.1946 18.9471 14.1701 18.9787 14.1399 18.9787ZM8.17258 18.9787H3.52155C3.51433 18.9787 3.50718 18.9774 3.50052 18.9747C3.49385 18.972 3.4878 18.9682 3.48271 18.9632C3.47762 18.9583 3.47359 18.9525 3.47086 18.9461C3.46813 18.9397 3.46675 18.9329 3.4668 18.926V8.72681C3.4668 8.69787 3.49133 8.67438 3.52155 8.67438H8.17258C8.2028 8.67438 8.22733 8.69787 8.22733 8.72681V18.926C8.22738 18.9329 8.226 18.9397 8.22327 18.9461C8.22053 18.9525 8.21651 18.9583 8.21142 18.9632C8.20633 18.9682 8.20028 18.972 8.19361 18.9747C8.18695 18.9774 8.1798 18.9787 8.17258 18.9787Z" fill="currentColor"></path></g></svg>
                                    <span>Disponibilité</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Partie principale */}
            <main className="flex-1 p-8 overflow-y-auto">{children}</main>
        </div>

    );
}
