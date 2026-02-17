import React, { useState, useEffect } from 'react';
import { MOCK_CLIENT_LAYOUTS } from '../constants';
import type { SavedLayout } from '../types';
import { TableCellsIcon, UsersIcon } from './Icons';

interface ClientLayoutSelectionPageProps {
    onSelectLayout: (layout: SavedLayout) => void;
}

const ClientLayoutSelectionPage: React.FC<ClientLayoutSelectionPageProps> = ({ onSelectLayout }) => {
    const [allLayouts, setAllLayouts] = useState<SavedLayout[]>([]);

    useEffect(() => {
        // Leggi i layout salvati da admin e combinali con i mock
        try {
            const stored = localStorage.getItem('saved_layouts_admin');
            const savedLayouts = stored ? JSON.parse(stored) : [];
            setAllLayouts([...savedLayouts, ...MOCK_CLIENT_LAYOUTS]);
        } catch (error) {
            console.error('Errore lettura localStorage:', error);
            setAllLayouts(MOCK_CLIENT_LAYOUTS);
        }
    }, []);

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <TableCellsIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Scegli una Proposta di Allestimento</h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    Abbiamo preparato alcune disposizioni per il tuo evento. Selezionane una per visualizzare i dettagli e assegnare i tuoi ospiti.
                </p>
                {allLayouts.length > 0 && (
                    <p className="mt-3 text-sm text-green-600 font-semibold">✓ {allLayouts.length} disposizione/i disponibile/i</p>
                )}
            </div>

            {/* Layout Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allLayouts.length > 0 ? (
                    allLayouts.map(layout => {
                        const totalCapacity = layout.tables.reduce((acc, table) => acc + table.capacity, 0);
                        return (
                            <div key={layout.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm flex flex-col text-center transition hover:shadow-lg hover:-translate-y-1">
                                <div className="flex-grow">
                                    <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-amber-100 text-amber-500">
                                        <TableCellsIcon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-stone-800">{layout.name}</h3>
                                    <div className="mt-4 flex items-center justify-center gap-6 text-stone-600">
                                        <div className="flex items-center gap-2">
                                            <TableCellsIcon className="w-5 h-5" />
                                            <span>{layout.tables.length} Tavoli</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <UsersIcon className="w-5 h-5" />
                                            <span>{totalCapacity} Posti</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => onSelectLayout(layout)}
                                    className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold px-4 py-2.5 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
                                    Visualizza e Assegna Ospiti
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-stone-500 text-lg">Nessun layout disponibile. Contatta l'amministratore.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ClientLayoutSelectionPage;
