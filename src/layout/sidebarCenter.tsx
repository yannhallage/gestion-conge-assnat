import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Layout() {
    const navigate = useNavigate()
    const [activeItem, setActiveItem] = useState("presence");

    const menuSections = [
        {
            title: "Présence",
            items: [
                {
                    id: "horloge", label: "Horloge", icon: <svg
                        width="24"
                        height="24"
                        className="text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="a-d/clock">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 2H15V0H9V2Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16.1626 17.0796C13.9092 19.334 10.2547 19.334 8.00076 17.0796C7.58924 16.6674 7.25384 16.2081 6.99302 15.7199L12.0819 12.9979V7.22466C13.5591 7.22466 15.0356 7.78853 16.1626 8.91578C18.4166 11.1703 18.4166 14.8251 16.1626 17.0796ZM22 6.87547L20.4503 4.64077L18.8662 5.7396C14.9474 2.02897 8.76849 2.0848 4.92883 5.92485C1.02372 9.83087 1.02372 16.1645 4.92883 20.0705C8.83446 23.9765 15.1661 23.9765 19.0712 20.0705C22.3821 16.7593 22.8748 11.7083 20.5721 7.86619L22 6.87547Z"
                                fill="currentColor"
                            />
                        </g>
                    </svg>
                },
                { id: "presence", label: "Présence", icon: <svg width="24" className="text-gray-300" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/presence"><g id="Frame" clip-path="url(#clip0_2565_5)"><g id="Group"><path id="Vector" d="M15.8 13.9C15.5 13.9 15 13.8 14.4 13.6C12.9 13.1 12.8 11.7 12.8 11.7C13.5 11.2 14.1 10.5 14.7 9.6C15.4 8.5 15.5 6.5 15.5 5.5C15.5 5.2 15.5 5 15.4 4.7C15 2.6 13.2 1 10.9 1C8.6 1 6.8 2.6 6.4 4.7C6.4 4.9 6.3 5.2 6.3 5.5C6.3 6.6 6.4 8.5 7.1 9.6C7.5 10.4 8 11 8.6 11.4C8.6 11.4 8.3 13.2 6.9 13.6L3.7 14.3C2 14.9 2 16.9 2 16.9V20H12.5C12.4 19.7 12.4 19.3 12.4 19C12.4 16.7 13.8 14.7 15.8 13.9Z" fill="currentColor"></path><path id="Vector_2" d="M18 23C20.2091 23 22 21.2091 22 19C22 16.7909 20.2091 15 18 15C15.7909 15 14 16.7909 14 19C14 21.2091 15.7909 23 18 23Z" fill="currentColor"></path></g></g></g><defs><clipPath id="clip0_2565_5"><rect width="20" height="22" fill="white" transform="translate(2 1)"></rect></clipPath></defs></svg> },
            ],
        },
        {
            title: "Congés",
            items: [
                { id: "demander", label: "Demander", icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M18.7402 10.1818L13.8473 5.2806L17.1159 1.99414L22.0098 6.89644L18.7402 10.1818ZM6.90469 22.0173H2.00977V17.114L12.5043 6.56464L17.3992 11.468L6.90469 22.0173Z" fill="currentColor" /></svg> },
                {
                    id: "calendrier",
                    label: "Calendrier",
                    icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M2 22.001V12.145H22.001V22.001H2ZM2 5.216H5.256V2H7.6V5.216H16.879V2H19.223V5.216H22.001V10.235H2V5.216Z" fill="currentColor" /></svg>,
                },
                {
                    id: "demandes",
                    label: "Demandes",
                    icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M16.915 1.99707H4V21.9941H21V6.10307L16.915 1.99707ZM16.235 17.7891H7.593V15.7521H16.235V17.7891ZM16.235 14.2411H7.593V12.2041H16.235V14.2411ZM15.896 7.14107V3.47007L19.542 7.14107H15.896Z" fill="currentColor" /></svg>,
                },
                {
                    id: "approbations",
                    label: "Approbations",
                    icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/approval"><path id="Fill 1" fill-rule="evenodd" clip-rule="evenodd" d="M11.6505 16.9027L7.12951 12.715L8.61414 11.1118L11.5296 13.8111L16.2144 8.73324L17.8199 10.2155L11.6505 16.9027ZM12 2C6.4773 2 2 6.4779 2 12.0004C2 17.5229 6.4773 22 12 22C17.5227 22 22 17.5229 22 12.0004C22 6.4779 17.5227 2 12 2Z" fill="currentColor"></path></g></svg>,
                },
                {
                    id: "disponibilites",
                    label: "Disponibilités",
                    icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="e-h/entitlement"><path id="Vector" d="M20.1232 18.9787H15.4721C15.4419 18.9787 15.4174 18.9522 15.4174 18.9198V6.65566C15.4174 6.62298 15.4419 6.59677 15.4721 6.59677H20.1232C20.1534 6.59677 20.1779 6.62298 20.1779 6.65566V18.9198C20.1779 18.9522 20.1534 18.9787 20.1232 18.9787ZM14.1399 18.9787H9.48884C9.45862 18.9787 9.43409 18.9471 9.43409 18.9079V4.07081C9.43409 4.03166 9.45862 4 9.48884 4H14.1399C14.1701 4 14.1946 4.03166 14.1946 4.07081V18.9079C14.1946 18.9471 14.1701 18.9787 14.1399 18.9787ZM8.17258 18.9787H3.52155C3.51433 18.9787 3.50718 18.9774 3.50052 18.9747C3.49385 18.972 3.4878 18.9682 3.48271 18.9632C3.47762 18.9583 3.47359 18.9525 3.47086 18.9461C3.46813 18.9397 3.46675 18.9329 3.4668 18.926V8.72681C3.4668 8.69787 3.49133 8.67438 3.52155 8.67438H8.17258C8.2028 8.67438 8.22733 8.69787 8.22733 8.72681V18.926C8.22738 18.9329 8.226 18.9397 8.22327 18.9461C8.22053 18.9525 8.21651 18.9583 8.21142 18.9632C8.20633 18.9682 8.20028 18.972 8.19361 18.9747C8.18695 18.9774 8.1798 18.9787 8.17258 18.9787Z" fill="currentColor"></path></g></svg>,
                },
            ],
        },
        {
            title: "Congigurations",
            items: [
                {
                    id: "historique", label: "Historique", icon: <svg
                        width="24"
                        height="24"
                        className="text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <g id="a-d/clock">
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M9 2H15V0H9V2Z"
                                fill="currentColor"
                            />
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M16.1626 17.0796C13.9092 19.334 10.2547 19.334 8.00076 17.0796C7.58924 16.6674 7.25384 16.2081 6.99302 15.7199L12.0819 12.9979V7.22466C13.5591 7.22466 15.0356 7.78853 16.1626 8.91578C18.4166 11.1703 18.4166 14.8251 16.1626 17.0796ZM22 6.87547L20.4503 4.64077L18.8662 5.7396C14.9474 2.02897 8.76849 2.0848 4.92883 5.92485C1.02372 9.83087 1.02372 16.1645 4.92883 20.0705C8.83446 23.9765 15.1661 23.9765 19.0712 20.0705C22.3821 16.7593 22.8748 11.7083 20.5721 7.86619L22 6.87547Z"
                                fill="currentColor"
                            />
                        </g>
                    </svg>
                },
                {
                    id: "interaction",
                    label: "Interaction RH",
                    icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/question"><g id="ic_pytanie"><g id="pytanie"><path id="Shape" fill-rule="evenodd" clip-rule="evenodd" d="M2 2V22L5.278 18.9289H21.996V2H2ZM15.741 13.3666H6.558V11.4792H15.741V13.3666ZM17.788 10.0356H6.558V8.14916H17.788V10.0356Z" fill="currentColor"></path></g></g></g></svg>,
                },
                {
                    id: "rapport",
                    label: "Rapport",
                    icon: <svg width="24" height="24" className="text-gray-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/reports"><g id="ic_raporty"><g id="Group 3"><path id="Fill 1" fill-rule="evenodd" clip-rule="evenodd" d="M2 22H22V19H2V22Z" fill="currentColor"></path><path id="Fill 2" fill-rule="evenodd" clip-rule="evenodd" d="M9.39872 3L2 7.59834V17H22V5.19632L16.2604 8.8537L9.39872 3Z" fill="currentColor"></path></g></g></g></svg>,
                },
            ],
        },
    ];

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800">
            <aside className="w-64 bg-[#f6f7f9] border-r border-gray-300 flex flex-col justify-between p-5 overflow-y-auto">
                <div>
                    <div className="flex items-center mb-6">
                        <img
                            src="https://app-new.calamari.io/version-5.249.2/assets/logo-C94mehfa.svg"
                            alt="logo"
                            className="h-10"
                        />
                    </div>

                    {menuSections.map((section) => (
                        <div key={section.title} className="mb-8">
                            <h3 className="text-[12px] uppercase tracking-wide text-emerald-600 mb-3 font-semibold">
                                {section.title}
                            </h3>
                            <ul className="space-y-2 text-[15px]">
                                {section.items.map((item) => (
                                    <li
                                        key={item.id}
                                        onClick={() => {
                                            setActiveItem(item.id)
                                            navigate(`/dashboard/${item.id}`)
                                        }}
                                        className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${activeItem === item.id
                                            ? "bg-emerald-100 text-[#27a082] font-semibold"
                                            : "text-gray-500 hover:bg-emerald-50 hover:text-[#27a082]"
                                            }`}
                                    >
                                        {item.icon}
                                        <span>{item.label}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </aside>
        </div>
    );
}