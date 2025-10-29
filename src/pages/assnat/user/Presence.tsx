// import { useState } from 'react'
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function Presence() {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [search, setSearch] = useState('');
    // const people = [
    //     { initials: 'YH', name: 'Yann Hallage', status: 'Jour de congé' },
    //     { initials: 'YH', name: 'Yann Hallage Hallage', status: 'Jour de congé' },
    //     { initials: 'AO', name: 'Admin Orathsa', status: 'Jour de congé' },
    // ];

    const people = [
        { id: 1, name: 'yann hallage', initials: 'YH', status: 'Absent', color: 'bg-amber-500' },
        { id: 2, name: 'Sophie Martin', initials: 'SM', status: 'Present', color: 'bg-emerald-500' },
        { id: 3, name: 'Lucas Dubois', initials: 'LD', status: 'Absent', color: 'bg-rose-500' },
        { id: 4, name: 'Emma Bernard', initials: 'EB', status: 'Present', color: 'bg-blue-500' },
        { id: 5, name: 'Thomas Petit', initials: 'TP', status: 'Present', color: 'bg-violet-500' },
    ];
    const filteredPeople = people.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'All' || person.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    return (
        <div>
            <header className="border-b border-gray-200 px-5 py-3">
                <h1 className="text-xl text-gray-800">Mes demandes</h1>
            </header>
            <div className='p-3'>
                {/* Barre de recherche */}
                <div className="flex flex-wrap items-center gap-3 mb-6 ">
                    <input
                        type="text"
                        placeholder="Recherche de demande"
                        className="border border-[#ccc] px-3 py-1 w-64 focus:outline-none focus:ring-1 focus:ring-green-200"
                    />

                    {/* <button className="flex items-center bg-[#f6f7f9] hover:bg-gray-50 gap-2 text-sm text-gray-700 rounded border-[#ccc] px-3 py-2">
                        <span className="text-gray-500 "><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="a-d/date"><g id="Frame 4"><path id="Union" fill-rule="evenodd" clip-rule="evenodd" d="M8 3H6V5H5.11765C3.9481 5 3 5.95513 3 7.13333V18.8667C3 20.0449 3.9481 21 5.11765 21H18.8824C20.0519 21 21 20.0449 21 18.8667V7.13333C21 5.95513 20.0519 5 18.8824 5H18V3H16V5H8V3ZM5.11765 18.8667L5.11765 11H18.8824V18.8667H5.11765ZM7 16V14H9V16H7ZM11 14H13V16H11V14Z" fill="currentColor"></path></g></g></svg></span>
                        <span>Date: Tous</span>
                    </button> */}

                    <button className="flex items-center bg-[#f6f7f9] hover:bg-gray-50 rounded  gap-2 text-sm text-gray-700 border-[#ccc] px-3 py-2">
                        <span className="text-gray-500"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="r-u/status"><path id="Subtract" fill-rule="evenodd" clip-rule="evenodd" d="M12 22.5C17.799 22.5 22.5 17.799 22.5 12C22.5 6.20101 17.799 1.5 12 1.5C6.20101 1.5 1.5 6.20101 1.5 12C1.5 17.799 6.20101 22.5 12 22.5ZM17 12C17 14.7614 14.7614 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12ZM19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C15.866 5 19 8.13401 19 12Z" fill="currentColor"></path></g></svg></span>
                        <span>Statut: Tous</span>
                    </button>
{/* 
                    <button className="flex items-center gap-2 bg-[#f6f7f9] text-sm hover:bg-gray-50 rounded text-gray-700 border-[#ccc] px-3 py-2">
                        <span className="text-gray-500"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="m-q/palm"><g id="palm"><path id="Vector" d="M18.7303 10.5533C17.8577 9.6315 16.7769 9.27469 15.7654 9.18548L18.1254 8.46194L18.5221 7.45097L19.1964 8.18442L20.5449 7.61946C20.5449 7.61946 19.5434 4.82441 16.291 5.46866C15.2895 5.66689 14.5656 6.13273 14.0599 6.68778C13.9508 5.91468 13.6236 5.11185 12.9096 4.34866C10.5992 1.87078 8.22932 3.56565 8.22932 3.56565L9.01268 4.83432L9.96461 4.63609L9.73654 5.69663L11.3132 7.76814C10.391 7.12389 9.13167 6.73734 7.48562 7.27256C4.82814 8.15468 3.86629 10.5434 3.90596 11.4057L5.25453 11.2669L5.75033 10.4542L6.19654 11.0885L7.98142 10.9795L8.51688 9.94867L8.92343 10.7912L11.6999 10.3848C10.6091 11.6733 9.41923 13.7745 9.3994 16.7975C9.42915 16.7876 9.45889 16.7876 9.49856 16.7777C9.8952 16.7182 10.3018 16.6885 10.7083 16.6885C11.2636 16.6885 11.809 16.748 12.3444 16.857C12.3742 16.8669 12.394 16.8669 12.4238 16.8768C12.3048 15.3901 12.4733 12.6446 13.6038 10.6524L16.172 13.1402L16.9554 12.8726L16.9355 13.8637L18.3733 15.0729L19.0675 14.7855L18.9286 15.6974L20.0491 16.6885C20.7532 15.1225 21.0903 13.0312 18.7303 10.5533Z" fill="currentColor"></path><path id="Vector_2" d="M10.6982 17.2432C10.3115 17.2432 9.9347 17.2729 9.56781 17.3324C7.23756 17.6892 5.34361 19.1164 4.58008 20.9996H16.8164C16.1024 19.2255 14.377 17.8577 12.2352 17.4017C11.7493 17.2927 11.2337 17.2432 10.6982 17.2432Z" fill="currentColor"></path></g></g></svg></span>
                        <span>Type d'absence: Quelconque</span>
                    </button> */}
                </div>

            </div>
            {/* Tableau de présence */}
            <div className="bg-white">
                <div className=" ml-3">
                    <div className="grid grid-cols-2 gap-4 mb-4 px-4">
                        <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">Person</span>
                        <span className="text-[13px] font-semibold text-slate-500 uppercase tracking-wide">Status</span>
                    </div>

                    <div className="space-y-3">
                        {filteredPeople.map((person, index) => (
                            <motion.div
                                // key={person.id}
                                // initial={{ opacity: 0, x: -20 }}
                                // animate={{ opacity: 1, x: 0 }}
                                // transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="grid grid-cols-2 text-[13px] gap-4 items-center p-3 rounded-xl hover:bg-slate-50 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 ${person.color} rounded-full  flex items-center justify-center text-white font-bold shadow-md relative`}>
                                        {person.initials}
                                        {person.status === 'Absent' && (
                                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                        )}
                                    </div>
                                    <span className="font-medium text-slate-700">{person.name}</span>
                                </div>
                                <div>
                                    <span className={`inline-block px-4 py-2 rounded-lg font-medium text-[#555]`}>
                                        {person.status}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredPeople.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-slate-400 text-lg">No people found matching your criteria</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
