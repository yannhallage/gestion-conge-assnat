import { useState, useEffect } from "react";
import type{ ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";

interface LayoutProps {
  children?: ReactNode;
  role: "user" | "admin" | "rh";
}

export default function SidebarCenter({ children, role }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState<string>("");
  const [DomaineName, _] = useState<"user" | "admin" | "rh">(role);

  useEffect(() => {
    // Définir automatiquement l'élément actif selon l'URL
    const pathParts = location.pathname.split("/");
    const lastPart = pathParts[pathParts.length - 1];
    setActiveItem(lastPart);
  }, [location.pathname]);
  
  const menuSections = [
    {
      title: "Présence",
      items: [
        // {
        //   id: "horloge",
        //   label: "Horloge",
        //   icon: (
        //     <svg
        //       width="24"
        //       height="24"
        //       className="text-gray-300"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       xmlns="http://www.w3.org/2000/svg"
        //     >
        //       <g id="a-d/clock">
        //         <path
        //           fillRule="evenodd"
        //           clipRule="evenodd"
        //           d="M9 2H15V0H9V2Z"
        //           fill="currentColor"
        //         />
        //         <path
        //           fillRule="evenodd"
        //           clipRule="evenodd"
        //           d="M16.1626 17.0796C13.9092 19.334 10.2547 19.334 8.00076 17.0796C7.58924 16.6674 7.25384 16.2081 6.99302 15.7199L12.0819 12.9979V7.22466C13.5591 7.22466 15.0356 7.78853 16.1626 8.91578C18.4166 11.1703 18.4166 14.8251 16.1626 17.0796ZM22 6.87547L20.4503 4.64077L18.8662 5.7396C14.9474 2.02897 8.76849 2.0848 4.92883 5.92485C1.02372 9.83087 1.02372 16.1645 4.92883 20.0705C8.83446 23.9765 15.1661 23.9765 19.0712 20.0705C22.3821 16.7593 22.8748 11.7083 20.5721 7.86619L22 6.87547Z"
        //           fill="currentColor"
        //         />
        //       </g>
        //     </svg>
        //   ),
        // },
        {
          id: "presence",
          label: "Présence",
          icon: (
            <svg
              width="24"
              className="text-gray-300"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="m-q/presence">
                <g id="Frame" clip-path="url(#clip0_2565_5)">
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
                  <rect
                    width="20"
                    height="22"
                    fill="white"
                    transform="translate(2 1)"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
          ),
        },
      ],
    },
    {
      title: "Congés",
      items: [
        {
          id: "demander",
          label: "Demander",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.7402 10.1818L13.8473 5.2806L17.1159 1.99414L22.0098 6.89644L18.7402 10.1818ZM6.90469 22.0173H2.00977V17.114L12.5043 6.56464L17.3992 11.468L6.90469 22.0173Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          id: "calendrier",
          label: "Calendrier",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 22.001V12.145H22.001V22.001H2ZM2 5.216H5.256V2H7.6V5.216H16.879V2H19.223V5.216H22.001V10.235H2V5.216Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          id: "demandes",
          label: "Demandes",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.915 1.99707H4V21.9941H21V6.10307L16.915 1.99707ZM16.235 17.7891H7.593V15.7521H16.235V17.7891ZM16.235 14.2411H7.593V12.2041H16.235V14.2411ZM15.896 7.14107V3.47007L19.542 7.14107H15.896Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          id: "disponibilites",
          label: "Disponibilités",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="e-h/entitlement">
                <path
                  id="Vector"
                  d="M20.1232 18.9787H15.4721C15.4419 18.9787 15.4174 18.9522 15.4174 18.9198V6.65566C15.4174 6.62298 15.4419 6.59677 15.4721 6.59677H20.1232C20.1534 6.59677 20.1779 6.62298 20.1779 6.65566V18.9198C20.1779 18.9522 20.1534 18.9787 20.1232 18.9787ZM14.1399 18.9787H9.48884C9.45862 18.9787 9.43409 18.9471 9.43409 18.9079V4.07081C9.43409 4.03166 9.45862 4 9.48884 4H14.1399C14.1701 4 14.1946 4.03166 14.1946 4.07081V18.9079C14.1946 18.9471 14.1701 18.9787 14.1399 18.9787ZM8.17258 18.9787H3.52155C3.51433 18.9787 3.50718 18.9774 3.50052 18.9747C3.49385 18.972 3.4878 18.9682 3.48271 18.9632C3.47762 18.9583 3.47359 18.9525 3.47086 18.9461C3.46813 18.9397 3.46675 18.9329 3.4668 18.926V8.72681C3.4668 8.69787 3.49133 8.67438 3.52155 8.67438H8.17258C8.2028 8.67438 8.22733 8.69787 8.22733 8.72681V18.926C8.22738 18.9329 8.226 18.9397 8.22327 18.9461C8.22053 18.9525 8.21651 18.9583 8.21142 18.9632C8.20633 18.9682 8.20028 18.972 8.19361 18.9747C8.18695 18.9774 8.1798 18.9787 8.17258 18.9787Z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          ),
        },
        {
          id: "historique",
          label: "Historique",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
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
          ),
        },
      ],
    },
    {
      title: "Congigurations",
      items: [
        {
          id: "interaction",
          label: "Interaction RH",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="m-q/question">
                <g id="ic_pytanie">
                  <g id="pytanie">
                    <path
                      id="Shape"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 2V22L5.278 18.9289H21.996V2H2ZM15.741 13.3666H6.558V11.4792H15.741V13.3666ZM17.788 10.0356H6.558V8.14916H17.788V10.0356Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          ),
        },
        {
          id: "rapport",
          label: "Rapport",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g id="r-u/reports">
                <g id="ic_raporty">
                  <g id="Group 3">
                    <path
                      id="Fill 1"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M2 22H22V19H2V22Z"
                      fill="currentColor"
                    ></path>
                    <path
                      id="Fill 2"
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.39872 3L2 7.59834V17H22V5.19632L16.2604 8.8537L9.39872 3Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </g>
              </g>
            </svg>
          ),
        },
        {
          id: "profil",
          label: "Profil",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M4 22V20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V22H4Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
      ],
    },
  ];

  if (DomaineName === "admin") {
    menuSections[1].items.push({
      id: "approbations",
      label: "Approbations",
      icon: (
        <svg
          width="24"
          height="24"
          className="text-gray-300"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="a-d/approval">
            <path
              id="Fill 1"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.6505 16.9027L7.12951 12.715L8.61414 11.1118L11.5296 13.8111L16.2144 8.73324L17.8199 10.2155L11.6505 16.9027ZM12 2C6.4773 2 2 6.4779 2 12.0004C2 17.5229 6.4773 22 12 22C17.5227 22 22 17.5229 22 12.0004C22 6.4779 17.5227 2 12 2Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
    });

    const configIndex = menuSections.findIndex(
      (section) => section.title === "Congigurations",
    );

    if (configIndex !== -1) {
      menuSections.splice(configIndex, 0, {
        title: "Personnes",
        items: [
          {
            id: "personne",
            label: "Personnes",
            icon: (
              <svg
                width="24"
                height="24"
                className="text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="m-q/people">
                  <path
                    id="Vector"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17 18.2305V20H1C1 19.7209 1 18.4698 1 18.2206C1 16.8299 1.10101 15.9626 2.4899 15.4791C2.68182 15.4193 2.87879 15.3595 3.12121 15.3097C5.36869 14.8212 7.57576 14.3875 6.5202 12.5483C3.35859 7.09034 5.61616 4 8.99495 4C12.3131 4 14.6313 6.98069 11.4848 12.5533C10.4545 14.3826 12.5859 14.8262 14.8838 15.3146C15.1061 15.3645 15.2929 15.4143 15.4646 15.4741C16.8889 15.9526 17 16.8199 17 18.2305Z"
                    fill="currentColor"
                  ></path>
                  <path
                    id="Subtract"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.9992 18H23.0002V16.6729C23.0002 15.615 22.9168 14.9645 21.8486 14.6056C21.7199 14.5607 21.5797 14.5234 21.413 14.486L21.3895 14.481C19.675 14.1166 18.0946 13.7807 18.8638 12.415C21.2236 8.23551 19.485 6 16.9964 6C14.4623 6 12.7691 8.31776 15.1403 12.4112C15.6844 13.3593 15.0726 13.8094 14.0896 14.1171C14.3998 14.1894 14.7299 14.2595 15.0774 14.3334L15.1029 14.3388C15.3436 14.3928 15.5691 14.4519 15.7885 14.528C16.6825 14.8294 17.327 15.3188 17.677 16.0891C17.9509 16.6919 17.9932 17.3773 17.9992 18Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            ),
          },
          {
            id: "document",
            label: "Documents",
            icon: (
              <svg
                width="24"
                height="24"
                className="text-gray-300"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="r-u/undefined-file">
                  <path
                    id="Subtract"
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.60004 21.002C4.61179 21.002 3 19.3902 3 17.4019L3 6.60177C3 4.61353 4.6118 3.00173 6.60005 3.00173L16 3.00173L21.0002 7.99994L21.0002 17.4019C21.0002 19.3902 19.3884 21.002 17.4002 21.002L6.60004 21.002ZM15.1502 8.9271C15.1502 9.13404 15.3179 9.30181 15.5249 9.30181L19.2738 9.30181C19.6077 9.30181 19.7749 8.89819 19.5388 8.66214L15.7898 4.91316C15.5538 4.6771 15.1502 4.84429 15.1502 5.17811L15.1502 8.9271Z"
                    fill="currentColor"
                  ></path>
                </g>
              </svg>
            ),
          },
        ],
      });
    }
  }

  if (DomaineName === "rh") {
    const presenceIndex = menuSections.findIndex(
      (section) => section.title === "Présence",
    );
    if (presenceIndex !== -1) {
      menuSections[presenceIndex].items = [
        {
          id: "dashboard",
          label: "Dashboard",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M3 13H11V21H3V13ZM13 3H21V11H13V3ZM13 13H21V21H13V13ZM3 3H11V11H3V3Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
      ];
    }
    const congeIndex = menuSections.findIndex(
      (section) => section.title === "Congés",
    );
    if (congeIndex !== -1) {
      menuSections[congeIndex].items = [
        {
          id: "calendrier",
          label: "Calendrier",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2 22.001V12.145H22.001V22.001H2ZM2 5.216H5.256V2H7.6V5.216H16.879V2H19.223V5.216H22.001V10.235H2V5.216Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          id: "demandes",
          label: "Demandes",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.915 1.99707H4V21.9941H21V6.10307L16.915 1.99707Z"
                fill="currentColor"
              />
            </svg>
          ),
        },
        {
          id: "historique",
          label: "Historique",
          icon: (
            <svg
              width="24"
              height="24"
              className="text-gray-300"
              viewBox="0 0 24 24"
              fill="currentColor"
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
          ),
        },
      ];
    }
    const configIndex = menuSections.findIndex(
      (section) => section.title === "Congigurations",
    );

    if (configIndex !== -1) {
      menuSections.splice(configIndex, 0, {
        title: "Organisation",
        items: [
          {
            id: "employes",
            label: "Employés",
            icon: (
              <svg
                width="24"
                height="24"
                className="text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z"
                  fill="currentColor"
                />
                <path
                  d="M4 22V20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V22H4Z"
                  fill="currentColor"
                />
              </svg>
            ),
          },
          {
            id: "direction",
            label: "Direction",
            icon: (
              <svg
                width="24"
                height="24"
                className="text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2L22 9H2L12 2Z" fill="currentColor" />
                <path d="M2 11H22V22H2V11Z" fill="currentColor" />
              </svg>
            ),
          },
          {
            id: "service",
            label: "Service",
            icon: (
              <svg
                width="24"
                height="24"
                className="text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 3H20V5H4V3Z" fill="currentColor" />
                <path d="M4 7H20V9H4V7Z" fill="currentColor" />
                <path d="M4 11H20V13H4V11Z" fill="currentColor" />
                <path d="M4 15H20V21H4V15Z" fill="currentColor" />
              </svg>
            ),
          },
          {
            id: "typeconge",
            label: "typeconge",
            icon: (
              <svg
                width="24"
                height="24"
                className="text-gray-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M4 3H20V5H4V3Z" fill="currentColor" />
                <path d="M4 7H20V9H4V7Z" fill="currentColor" />
                <path d="M4 11H20V13H4V11Z" fill="currentColor" />
                <path d="M4 15H20V21H4V15Z" fill="currentColor" />
              </svg>
            ),
          },
        ],
      });
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 text-gray-800">
      <aside className="w-64 bg-[#f6f7f9] border-r border-gray-300 flex flex-col justify-between p-5 overflow-y-auto">
        <div>
          <div className="flex items-center mb-6">
            {/* <img
              src="https://app-new.calamari.io/version-5.249.2/assets/logo-C94mehfa.svg"
              alt="logo"
              className="h-10"
            /> */}
            <img
              src="https://www.assnat.ci/imgsite/logo-anci4.png"
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
                      setActiveItem(item.id);
                      navigate(`/assnat-${DomaineName}/dashboard/${item.id}`);
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-md cursor-pointer transition-colors ${
                      activeItem === item.id
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
