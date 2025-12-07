export default function PaiementsTable() {
    const columns = [
        "Date",
        "Numéro",
        "Journal",
        "Mode de paiement",
        "Client",
        "Montant",
        "État"
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-7 gap-4 px-4 py-3">
                    {columns.map((col, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-700 uppercase">
                                {col}
                            </span>
                            {index === columns.length - 1 && (
                                <button className="p-1 hover:bg-gray-200 rounded">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-gray-500">
                                        <path d="M3 6h18M7 12h10M11 18h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Empty State */}
            <div className="flex flex-col items-center justify-center py-20 px-4">
                <div className="w-18 h-18 bg-purple-100 rounded-full flex items-center justify-center mb-6 border-4 border-purple-200">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-purple-600">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                    Enregistrer un paiement
                </h2>
                <p className="text-gray-600 text-center max-w-md">
                    Les paiements sont utilisés pour enregistrer les mouvements de liquidité. Vous pouvez traiter ces paiements par vos propres moyens ou en utilisant les applications installées.
                </p>
            </div>
        </div>
    );
}

