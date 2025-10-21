// import { useState } from 'react'
import { Search } from 'lucide-react';
import { useState } from 'react';

export default function PresenceRh() {
    const [search, setSearch] = useState('');
    const people = [
        { initials: 'YH', name: 'Yann Hallage', status: 'Jour de congé' },
        { initials: 'YH', name: 'Yann Hallage Hallage', status: 'Jour de congé' },
        { initials: 'AO', name: 'Admin Orathsa', status: 'Jour de congé' },
    ];

    return (
        <div>
            <h1 className="text-2xl font-semibold mb-6">Présence</h1>

            {/* Barre de recherche */}
            <div className="flex items-center gap-2 mb-6">
                <div className="relative w-80">
                    <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Recherche une personne"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-8 w-full border border-gray-300 rounded-md py-2 text-sm focus:outline-none"
                    />
                </div>
                <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                    <option>Tous</option>
                    <option>Présent</option>
                    <option>En congé</option>
                </select>
            </div>

            {/* Tableau de présence */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b text-gray-600">
                            <th className="py-3 px-4">Personne</th>
                            <th className="py-3 px-4">Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {people.map((p, i) => (
                            <tr key={i} className="border-b hover:bg-gray-50">
                                <td className="flex items-center gap-3 py-3 px-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-700">
                                        {p.initials}
                                    </div>
                                    <span>{p.name}</span>
                                </td>
                                <td className="py-3 px-4 text-gray-700">{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
