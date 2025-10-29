import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";

import { ClipLoader } from "react-spinners";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerAddPersonne({ isOpen, onClose }: DrawerProps) {
  const [sendInvitation, setSendInvitation] = useState(false);
  const [activeTab, setActiveTab] = useState("Information personnel");
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

  const tabs = [
    "Information personnel",
    "Contact",
    // "Information congé",
    "Administration",
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "Information personnel":
        return <PrimaryComponent />;
      case "Contact":
        return <ContactComponent />;
      // case "Information congé":
      //   return <InformationConge />;
      case "Administration":
        return <AdministrationComponent />;
      default:
        return null;
    }
  };

  const handleClose = () => {
    setActiveTab("Information personnel");
    setSendInvitation(false);
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/20 z-40 transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[70%] bg-white shadow-xl z-50 transform transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } flex flex-col`}
      >
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="bg-[#27a082] hover:bg-teal-600 text-white px-6 py-2 rounded transition-colors">
              ✓ Save
            </button>
            <h1 className="text-xl font-normal text-gray-700">New Employee</h1>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={sendInvitation}
                onChange={() => setSendInvitation(!sendInvitation)}
                className="w-10 h-5 appearance-none bg-gray-300 rounded-full relative cursor-pointer transition-colors checked:bg-teal-500 before:content-[''] before:absolute before:w-4 before:h-4 before:rounded-full before:bg-white before:top-0.5 before:left-0.5 before:transition-transform checked:before:translate-x-5"
              />
              <span>Envoyer une invitation</span>
            </label>

            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
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

          <aside className="w-56 bg-white border-r border-gray-200">
            <nav className="py-4">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-6 py-3 text-sm cursor-pointer ${
                    tab === activeTab
                      ? "text-teal-600 font-medium border-l-2 border-teal-600 bg-teal-50"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {tab}
                </div>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 p-8 overflow-y-auto">
            {renderComponent()}
          </main>
        </div>
      </div>
    </>
  );
}

function PrimaryComponent() {
  return (
    <>
      <div className="bg-white space-y-5">
        <h2 className="text-[15px]  font-semibold text-gray-800 pb-2">
          Information personnels
        </h2>
        <div className="space-y-5">
          {["Nom de famille", "Prenoms", "Email", "Genre", "Birthdate"].map(
            (label, i) => (
              <div key={i} className="flex items-center justify-between gap-6">
                {label === "Genre" ? (
                  <>
                    <label className="w-1/3 text-[#abb2b9]">{label}</label>
                    <select
                      id="Genre"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                        focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    >
                      <option value="male">Homme</option>
                      <option value="female">Femme</option>
                    </select>
                  </>
                ) : label === "Birthdate" ? (
                  <div className="flex w-full items-center gap-6">
                    <label className="w-1/3 text-[#abb2b9]">{label}*</label>
                    <input
                      type="date"
                      placeholder="Enter your birthdate"
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                        focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                ) : (
                  <div className="flex w-full items-center gap-6">
                    <label className="w-1/3 text-[#abb2b9]">{label}*</label>
                    <input
                      type={label === "Email" ? "email" : "text"}
                      placeholder={`Enter ${label.toLowerCase()}`}
                      className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                        focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
                    />
                  </div>
                )}
              </div>
            ),
          )}
        </div>
      </div>
      <div className="bg-white space-y-5">
        <h2 className="text-[15px] font-semibold text-gray-800 pb-2">
          Identification
        </h2>
        <div className="space-y-5">
          {["Matricule Employé"].map((label, i) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <label className="w-1/3 text-[#abb2b9]">{label}*</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ContactComponent() {
  return (
    <>
      <div className="bg-white space-y-5">
        <h2 className="text-[15px]  font-semibold text-gray-800 pb-2">
          Business
        </h2>
        <div className="space-y-5">
          {["Email Professionel", "Telephone Professionel"].map((label, i) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <label className="w-1/3 text-[#abb2b9]">{label}*</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white space-y-5">
        <h2 className="text-[15px]  font-semibold text-gray-800 pb-2">
          Personal
        </h2>
        <div className="space-y-5">
          {["Email personnel", "Téléphone personnel"].map((label, i) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <label className="w-1/3 text-[#abb2b9]">{label}*</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white space-y-5">
        <h2 className="text-[15px]  font-semibold text-gray-800 pb-2">
          Address
        </h2>
        <div className="space-y-5">
          {[
            "Rue",
            "Building / flat number",
            "ville",
            "Commune",
            "code Postale",
            "Pays",
          ].map((label, i) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <label className="w-1/3 text-[#abb2b9]">{label}*</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white space-y-5">
        <h2 className="text-[15px]  font-semibold text-gray-800 pb-2">
          Emergency contact
        </h2>
        <div className="space-y-5">
          {[
            "Nom",
            // "Relationship",
            "Téléphone en cas d'urgence",
          ].map((label, i) => (
            <div key={i} className="flex items-center justify-between gap-6">
              <label className="w-1/3 text-[#abb2b9]">{label}*</label>
              <input
                type="text"
                placeholder={`Enter ${label.toLowerCase()}`}
                className="flex-1 px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdministrationComponent() {
  const roles = [
    {
      name: "Administrator",
      description: "Full access to all system functions",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-[#ffcf67]"
        >
          <g id="r-u/role-admin">
            <g id="r1">
              <g id="Group">
                <g id="Group_2">
                  <g id="Group_3">
                    <path
                      id="Vector"
                      d="M22.7284 7.67795C22.5128 7.52115 22.2188 7.52115 22.0032 7.66815L18.2986 10.1084C18.1516 10.2065 18.0536 10.3535 18.0242 10.5201C17.9948 10.6867 18.0242 10.8631 18.1222 11.0003C18.3378 11.3139 18.4456 11.6863 18.4456 12.0685C18.4456 13.1368 17.5734 13.9992 16.5149 13.9992C15.4565 13.9992 14.5843 13.127 14.5843 12.0685C14.5843 11.4413 14.8979 10.8533 15.4075 10.4907C15.7015 10.2849 15.7701 9.88304 15.5643 9.58903L12.5262 5.25726C12.291 4.91425 11.7128 4.91425 11.4677 5.25726L8.42963 9.58903C8.22382 9.88304 8.29243 10.2849 8.58644 10.4907C9.10586 10.8533 9.40967 11.4413 9.40967 12.0685C9.40967 13.1368 8.53744 13.9992 7.47899 13.9992C6.42055 13.9992 5.54832 13.127 5.54832 12.0685C5.54832 11.6863 5.65612 11.3139 5.87173 11.0003C5.96974 10.8533 5.99914 10.6867 5.96974 10.5201C5.94033 10.3535 5.84233 10.2065 5.69532 10.1084L2.00058 7.66815C1.77517 7.52115 1.49096 7.52115 1.27535 7.67795C1.05975 7.83476 0.951942 8.09937 1.02054 8.36398L3.63725 18.674C3.71565 18.9974 4.02926 19.213 4.37227 19.1542C9.43907 18.3114 14.5647 18.3114 19.6315 19.1542C19.6707 19.164 19.7001 19.164 19.7393 19.164C20.0333 19.164 20.2881 18.968 20.3665 18.674L22.9832 8.36398C23.042 8.09937 22.944 7.82496 22.7284 7.67795Z"
                      fill="currentColor"
                    ></path>
                  </g>
                </g>
              </g>
            </g>
          </g>
        </svg>
      ),
    },
    // { name: "Manager", description: "Can view and manage subordinates' data" },
    {
      name: "Company manager",
      description: "Can view and manage subordinates' data",
      icon: (
        <svg
          className="core_roleIcon_2c58qn2kvo"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6059 6.44444C19.8422 4.81481 18.6127 3.44444 17.0853 2.48148C15.5578 1.5 13.8069 1 12 1C10.1931 1 8.44216 1.5 6.91471 2.46296C6.11373 2.96296 5.38725 3.59259 4.77255 4.31481C3.30098 6.03704 2.5 8.2037 2.5 10.4444C2.5 12.6852 3.30098 14.8704 4.77255 16.5741C5.27549 17.1481 5.83431 17.6667 6.46765 18.1111V21.5926C6.46765 22.3704 7.10098 23 7.88333 23C8.08824 23 8.29314 22.9444 8.49804 22.8704L12.0186 21.2037L15.5392 22.8704C15.7255 22.963 15.9304 23 16.1539 23C16.5265 23 16.8618 22.8519 17.1412 22.6111C17.4206 22.3519 17.5696 21.9815 17.5696 21.5926V18.1111C18.8922 17.1667 19.9353 15.9074 20.6245 14.4444C21.2206 13.1852 21.5186 11.8333 21.5186 10.4444C21.5 9.03704 21.202 7.7037 20.6059 6.44444Z"
            fill="transparent"
          ></path>
          <path
            d="M11.9627 15.1666C14.5861 15.1666 16.7127 13.0524 16.7127 10.4444C16.7127 7.83638 14.5861 5.72217 11.9627 5.72217C9.33936 5.72217 7.21271 7.83638 7.21271 10.4444C7.21271 13.0524 9.33936 15.1666 11.9627 15.1666Z"
            fill="#27A082"
          ></path>
          <path
            d="M19.6 6.90738C18.9108 5.46294 17.8304 4.25923 16.4892 3.40738C15.1853 2.59257 13.6578 2.11108 12 2.11108C10.3421 2.11108 8.81467 2.59257 7.51075 3.40738C6.80291 3.85182 6.16958 4.40738 5.61075 5.03701C4.38134 6.49997 3.61761 8.38886 3.61761 10.4444C3.61761 12.5 4.36271 14.3889 5.62938 15.8518C6.09507 16.4074 6.65389 16.8889 7.24997 17.2963C7.36173 17.3703 7.4735 17.4444 7.58526 17.5185V21.5926C7.58526 21.8148 7.80879 21.9444 8.01369 21.8518L11.6088 20.1481C11.8696 20.037 12.149 20.037 12.4098 20.1481L16.0049 21.8518C16.2098 21.9444 16.4333 21.7963 16.4333 21.5926V17.5185C16.5451 17.4444 16.6568 17.3703 16.7686 17.2963C17.9794 16.4629 18.9666 15.3148 19.6 13.9815C20.1029 12.9074 20.3823 11.7037 20.3823 10.4444C20.3823 9.18516 20.1029 7.98145 19.6 6.90738ZM11.9627 16.2778C8.72154 16.2778 6.09507 13.6666 6.09507 10.4444C6.09507 7.2222 8.72154 4.61108 11.9627 4.61108C15.2039 4.61108 17.8117 7.2222 17.8117 10.4444C17.8117 13.6666 15.1853 16.2778 11.9627 16.2778Z"
            fill="#27A082"
          ></path>
        </svg>
      ),
    },
    {
      name: "Team manager",
      description: "Can view and manage subordinates' data",
      icon: (
        <svg
          className="core_roleIcon_2c58qn2kvo"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6059 6.44444C19.8422 4.81481 18.6127 3.44444 17.0853 2.48148C15.5578 1.5 13.8069 1 12 1C10.1931 1 8.44216 1.5 6.91471 2.46296C6.11373 2.96296 5.38725 3.59259 4.77255 4.31481C3.30098 6.03704 2.5 8.2037 2.5 10.4444C2.5 12.6852 3.30098 14.8704 4.77255 16.5741C5.27549 17.1481 5.83431 17.6667 6.46765 18.1111V21.5926C6.46765 22.3704 7.10098 23 7.88333 23C8.08824 23 8.29314 22.9444 8.49804 22.8704L12.0186 21.2037L15.5392 22.8704C15.7255 22.963 15.9304 23 16.1539 23C16.5265 23 16.8618 22.8519 17.1412 22.6111C17.4206 22.3519 17.5696 21.9815 17.5696 21.5926V18.1111C18.8922 17.1667 19.9353 15.9074 20.6245 14.4444C21.2206 13.1852 21.5186 11.8333 21.5186 10.4444C21.5 9.03704 21.202 7.7037 20.6059 6.44444Z"
            fill="transparent"
          ></path>
          <path
            d="M11.9627 15.1666C14.5861 15.1666 16.7127 13.0524 16.7127 10.4444C16.7127 7.83638 14.5861 5.72217 11.9627 5.72217C9.33936 5.72217 7.21271 7.83638 7.21271 10.4444C7.21271 13.0524 9.33936 15.1666 11.9627 15.1666Z"
            fill="#677AC0"
          ></path>
          <path
            d="M19.6 6.90738C18.9108 5.46294 17.8304 4.25923 16.4892 3.40738C15.1853 2.59257 13.6578 2.11108 12 2.11108C10.3421 2.11108 8.81467 2.59257 7.51075 3.40738C6.80291 3.85182 6.16958 4.40738 5.61075 5.03701C4.38134 6.49997 3.61761 8.38886 3.61761 10.4444C3.61761 12.5 4.36271 14.3889 5.62938 15.8518C6.09507 16.4074 6.65389 16.8889 7.24997 17.2963C7.36173 17.3703 7.4735 17.4444 7.58526 17.5185V21.5926C7.58526 21.8148 7.80879 21.9444 8.01369 21.8518L11.6088 20.1481C11.8696 20.037 12.149 20.037 12.4098 20.1481L16.0049 21.8518C16.2098 21.9444 16.4333 21.7963 16.4333 21.5926V17.5185C16.5451 17.4444 16.6568 17.3703 16.7686 17.2963C17.9794 16.4629 18.9666 15.3148 19.6 13.9815C20.1029 12.9074 20.3823 11.7037 20.3823 10.4444C20.3823 9.18516 20.1029 7.98145 19.6 6.90738ZM11.9627 16.2778C8.72154 16.2778 6.09507 13.6666 6.09507 10.4444C6.09507 7.2222 8.72154 4.61108 11.9627 4.61108C15.2039 4.61108 17.8117 7.2222 17.8117 10.4444C17.8117 13.6666 15.1853 16.2778 11.9627 16.2778Z"
            fill="#677AC0"
          ></path>
        </svg>
      ),
    },
    {
      name: "Direct manager",
      description: "Can view and manage subordinates' data",
      icon: (
        <svg
          className="core_roleIcon_2c58qn2kvo"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20.6059 6.44444C19.8422 4.81481 18.6127 3.44444 17.0853 2.48148C15.5578 1.5 13.8069 1 12 1C10.1931 1 8.44216 1.5 6.91471 2.46296C6.11373 2.96296 5.38725 3.59259 4.77255 4.31481C3.30098 6.03704 2.5 8.2037 2.5 10.4444C2.5 12.6852 3.30098 14.8704 4.77255 16.5741C5.27549 17.1481 5.83431 17.6667 6.46765 18.1111V21.5926C6.46765 22.3704 7.10098 23 7.88333 23C8.08824 23 8.29314 22.9444 8.49804 22.8704L12.0186 21.2037L15.5392 22.8704C15.7255 22.963 15.9304 23 16.1539 23C16.5265 23 16.8618 22.8519 17.1412 22.6111C17.4206 22.3519 17.5696 21.9815 17.5696 21.5926V18.1111C18.8922 17.1667 19.9353 15.9074 20.6245 14.4444C21.2206 13.1852 21.5186 11.8333 21.5186 10.4444C21.5 9.03704 21.202 7.7037 20.6059 6.44444Z"
            fill="transparent"
          ></path>
          <path
            d="M11.9627 15.1666C14.5861 15.1666 16.7127 13.0524 16.7127 10.4444C16.7127 7.83638 14.5861 5.72217 11.9627 5.72217C9.33936 5.72217 7.21271 7.83638 7.21271 10.4444C7.21271 13.0524 9.33936 15.1666 11.9627 15.1666Z"
            fill="#4FBFEF"
          ></path>
          <path
            d="M19.6 6.90738C18.9108 5.46294 17.8304 4.25923 16.4892 3.40738C15.1853 2.59257 13.6578 2.11108 12 2.11108C10.3421 2.11108 8.81467 2.59257 7.51075 3.40738C6.80291 3.85182 6.16958 4.40738 5.61075 5.03701C4.38134 6.49997 3.61761 8.38886 3.61761 10.4444C3.61761 12.5 4.36271 14.3889 5.62938 15.8518C6.09507 16.4074 6.65389 16.8889 7.24997 17.2963C7.36173 17.3703 7.4735 17.4444 7.58526 17.5185V21.5926C7.58526 21.8148 7.80879 21.9444 8.01369 21.8518L11.6088 20.1481C11.8696 20.037 12.149 20.037 12.4098 20.1481L16.0049 21.8518C16.2098 21.9444 16.4333 21.7963 16.4333 21.5926V17.5185C16.5451 17.4444 16.6568 17.3703 16.7686 17.2963C17.9794 16.4629 18.9666 15.3148 19.6 13.9815C20.1029 12.9074 20.3823 11.7037 20.3823 10.4444C20.3823 9.18516 20.1029 7.98145 19.6 6.90738ZM11.9627 16.2778C8.72154 16.2778 6.09507 13.6666 6.09507 10.4444C6.09507 7.2222 8.72154 4.61108 11.9627 4.61108C15.2039 4.61108 17.8117 7.2222 17.8117 10.4444C17.8117 13.6666 15.1853 16.2778 11.9627 16.2778Z"
            fill="#4FBFEF"
          ></path>
        </svg>
      ),
    },
    {
      name: "Employee",
      description: "Standard access to perform daily tasks",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="ui_icon_1z4c4c0lsv core_roleIcon_2c58qn2kvo core_basicPermissionsIcon_25oth6ymqy"
        >
          <g id="e-h/employee">
            <path
              id="Vector"
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M21 19.0093V21H3C3 20.686 3 19.2785 3 18.9981C3 17.4336 3.11364 16.4579 4.67614 15.914C4.89205 15.8467 5.11364 15.7794 5.38636 15.7234C7.91477 15.1738 10.3977 14.686 9.21023 12.6168C5.65341 6.47664 8.19318 3 11.9943 3C15.7273 3 18.3352 6.35327 14.7955 12.6224C13.6364 14.6804 16.0341 15.1794 18.6193 15.729C18.8693 15.785 19.0795 15.8411 19.2727 15.9084C20.875 16.4467 21 17.4224 21 19.0093Z"
              fill="currentColor"
            ></path>
          </g>
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-white space-y-6">
      <h2 className="font-semibold text-gray-700">
        Sélectionnez si l'utilisateur aura l'un des rôles suivants dans le
        système
      </h2>

      <p className="text-sm text-gray-600 leading-relaxed">
        Attribuez des rôles supplémentaires pour augmenter les privilèges dans
        le système de la personne ajoutée.
        <br />
        <strong className="text-gray-700">Administrateurs </strong> ont un accès
        complet à toutes les fonctions du système, tandis que les{" "}
        <strong className="text-gray-700">gestionnaires </strong> nt une
        meilleure connaissance des données de leurs subordonnés. Vous pouvez
        changer de rôle à tout moment.
      </p>

      <select
        id="category"
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
      >
        <option value="info">Direction informatique</option>
        <option value="urgent">Direction Ressource humaine</option>
        <option value="event">Direction Protocole</option>
        <option value="policy">Direction Courrier</option>
      </select>
      <select
        id="category"
        className="w-full px-4 py-3 border border-gray-300 bg-white text-gray-700
                                       focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition"
      >
        <option value="info">service Information</option>
        <option value="urgent">service Urgent</option>
        <option value="event">service Événement</option>
        <option value="policy">service Politique</option>
      </select>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
        {roles.map((role, index) => (
          <label
            key={index}
            className="flex items-center gap-3 p-3 border border-[#ccc] cursor-pointer hover:bg-gray-50 transition"
          >
            <input
              type="checkbox"
              className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <div className="flex items-center gap-3">
              {role.icon && <div className="text-teal-600">{role.icon}</div>}
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800">
                  {role.name}
                </span>
                <span className="text-xs text-gray-500">
                  {role.description}
                </span>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

// function InformationConge() {
//   // Données par défaut
//   const conges = [
//     {
//       annee: 2025,
//       prises: 5,
//       restant: 10,
//       dates: [
//         "2025-01-15",
//         "2025-03-20",
//         "2025-05-05",
//         "2025-07-12",
//         "2025-09-01",
//       ],
//     },
//     {
//       annee: 2024,
//       prises: 8,
//       restant: 7,
//       dates: [
//         "2024-02-10",
//         "2024-04-22",
//         "2024-06-15",
//         "2024-08-08",
//         "2024-10-01",
//         "2024-11-12",
//         "2024-12-20",
//         "2024-12-24",
//       ],
//     },
//   ];

//   return (
//     <div className="p-6 bg-white shadow-md rounded-lg w-full">
//       <h2 className="text-xl font-semibold mb-4">
//         Informations sur les congés
//       </h2>

//       {conges.map((conge, idx) => (
//         <div
//           key={idx}
//           className="mb-6 border-b border-gray-200 pb-4 last:border-none"
//         >
//           <h3 className="text-lg font-semibold mb-3">Année {conge.annee}</h3>

//           {/* Statistiques des congés */}
//           <div className="flex flex-col sm:flex-row gap-4 mb-3">
//             <div className="flex-1 bg-teal-50 p-4 rounded-lg text-center">
//               <CalendarDays className="mx-auto mb-1 text-teal-400" />
//               <p className="text-gray-500 text-sm">Congés pris</p>
//               <p className="text-teal-600 font-bold text-lg">{conge.prises}</p>
//             </div>
//             <div className="flex-1 bg-yellow-50 p-4 rounded-lg text-center">
//               <p className="text-gray-500 text-sm">Congés restants</p>
//               <p className="text-yellow-600 font-bold text-lg">
//                 {conge.restant}
//               </p>
//             </div>
//           </div>

//           {/* Liste des dates de congés */}
//           <div className="mt-3">
//             <p className="text-gray-500 text-sm mb-2 font-medium">
//               Dates des congés :
//             </p>
//             <div className="flex flex-wrap gap-2">
//               {conge.dates.map((date, i) => (
//                 <span
//                   key={i}
//                   className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full shadow-sm"
//                 >
//                   {date}
//                 </span>
//               ))}
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
