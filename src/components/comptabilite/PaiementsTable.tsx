import { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';
import { useComptabiliteService } from '../../hooks/comptabilite/useComptabiliteService';
import DrawerPersonnelComptabilite from './DrawerPersonnelComptabilite';

interface Personnel {
    id_personnel: string;
    nom_personnel: string;
    prenom_personnel: string;
    email_personnel?: string;
    email_travail?: string;
    matricule_personnel?: string;
    telephone_travail?: string;
    telephone_personnel?: string;
    poste?: string;
    type_contrat?: string;
    salaire_base?: number;
    statut_professionnel?: string;
    service?: {
        nom_service: string;
        code_service: string;
    };
}

export default function PaiementsTable() {
    const { getAllPersonnel, loading, error } = useComptabiliteService();
    const [personnel, setPersonnel] = useState<Personnel[]>([]);
    const [refreshLoading, setRefreshLoading] = useState(false);
    const [selectedPersonnel, setSelectedPersonnel] = useState<Personnel | null>(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const fetchPersonnel = async () => {
        try {
            const data = await getAllPersonnel();
            setPersonnel(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Erreur lors du chargement du personnel:', err);
        }
    };

    useEffect(() => {
        fetchPersonnel();
    }, [getAllPersonnel]);

    const handleRefresh = async () => {
        setRefreshLoading(true);
        try {
            await fetchPersonnel();
        } finally {
            setRefreshLoading(false);
        }
    };

    const columns = [
        "Matricule",
        "Nom",
        "Prénom",
        "Email",
        "Poste",
        "Service",
        "Statut"
    ];

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-center py-20">
                    <ClipLoader
                        color="#27a082"
                        loading={loading}
                        size={29}
                        speedMultiplier={3}
                        aria-label="Chargement..."
                        data-testid="loader"
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <p className="text-red-600 mb-2">Erreur lors du chargement</p>
                        <p className="text-gray-600 text-sm">{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="grid grid-cols-[120px_140px_140px_1fr_150px_150px_100px] gap-4 flex-1 min-w-0">
                        {columns.map((col, index) => (
                            <div key={index} className="flex items-center min-w-0">
                                <span className="text-xs font-semibold text-gray-700 uppercase truncate">
                                    {col}
                                </span>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                            onClick={handleRefresh}
                            disabled={refreshLoading || loading}
                            className="flex items-center gap-2 text-sm text-[#27a082] hover:text-teal-600 font-medium cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors px-2 py-1 rounded hover:bg-gray-100 whitespace-nowrap"
                            title="Rafraîchir les données"
                        >
                            {refreshLoading ? (
                                <>
                                    <ClipLoader size={14} color="#27a082" />
                                    <span>Chargement...</span>
                                </>
                            ) : (
                                <>
                                    <svg 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transition-transform ${refreshLoading ? 'animate-spin' : ''}`}
                                    >
                                        <path 
                                            d="M12 4V1L8 5L12 9V6C15.31 6 18 8.69 18 12C18 13.01 17.75 13.97 17.3 14.8L18.76 16.26C19.54 15.03 20 13.57 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 10.99 6.25 10.03 6.7 9.2L5.24 7.74C4.46 8.97 4 10.43 4 12C4 16.42 7.58 20 12 20V23L16 19L12 15V18Z" 
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span>Rafraîchir</span>
                                </>
                            )}
                        </button>
                        <button className="p-1 hover:bg-gray-200 rounded flex-shrink-0" title="Filtres">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                                <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Table Body */}
            {personnel.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="w-18 h-18 bg-purple-100 rounded-full flex items-center justify-center mb-6 border-4 border-purple-200">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Aucun personnel trouvé
                    </h2>
                    <p className="text-gray-600 text-center max-w-md">
                        Il n'y a actuellement aucun personnel enregistré dans le système.
                    </p>
                </div>
            ) : (
                <>
                    <div className="divide-y divide-gray-200">
                        {personnel.map((person) => (
                            <div
                                key={person.id_personnel}
                                onClick={() => {
                                    setSelectedPersonnel(person);
                                    setIsDrawerOpen(true);
                                }}
                                className="grid grid-cols-[120px_140px_140px_1fr_150px_150px_100px] gap-4 px-4 py-3 hover:bg-gray-50 transition-colors min-w-0 cursor-pointer"
                            >
                            <div className="flex items-center min-w-0">
                                <span className="text-sm text-gray-900 truncate">
                                    {person.matricule_personnel || '—'}
                                </span>
                            </div>
                            <div className="flex items-center min-w-0">
                                <span className="text-sm text-gray-900 font-medium truncate">
                                    {person.nom_personnel}
                                </span>
                            </div>
                            <div className="flex items-center min-w-0">
                                <span className="text-sm text-gray-900 truncate">
                                    {person.prenom_personnel}
                                </span>
                            </div>
                            <div className="flex items-center min-w-0">
                                <span className="text-sm text-gray-600 truncate" title={person.email_travail || person.email_personnel || ''}>
                                    {person.email_travail || person.email_personnel || '—'}
                                </span>
                            </div>
                            <div className="flex items-center min-w-0">
                                <span className="text-sm text-gray-600 truncate" title={person.poste || ''}>
                                    {person.poste || '—'}
                                </span>
                            </div>
                            <div className="flex items-center min-w-0">
                                <span className="text-sm text-gray-600 truncate" title={person.service?.nom_service || ''}>
                                    {person.service?.nom_service || '—'}
                                </span>
                            </div>
                            <div className="flex items-center min-w-0">
                                <span className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                                    person.statut_professionnel === 'ACTIF' 
                                        ? 'bg-green-100 text-green-800' 
                                        : person.statut_professionnel === 'SUSPENDU'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : person.statut_professionnel === 'EN_CONGE'
                                        ? 'bg-blue-100 text-blue-800'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {person.statut_professionnel || '—'}
                                </span>
                            </div>
                            </div>
                        ))}
                    </div>
                    <DrawerPersonnelComptabilite
                        isOpen={isDrawerOpen}
                        onClose={() => {
                            setIsDrawerOpen(false);
                            setSelectedPersonnel(null);
                        }}
                        personnel={selectedPersonnel}
                    />
                </>
            )}
        </div>
    );
}

