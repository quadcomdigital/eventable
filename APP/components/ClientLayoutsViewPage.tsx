import React, { useState, useEffect } from 'react';
import type { SavedLayout } from '../types';
import { MOCK_CLIENT_LAYOUTS } from '../constants';

interface ClientLayoutsViewPageProps {
    onSelectLayout: (layout: SavedLayout) => void;
}

const ClientLayoutsViewPage: React.FC<ClientLayoutsViewPageProps> = ({ onSelectLayout }) => {
    const [allLayouts, setAllLayouts] = useState<SavedLayout[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('saved_layouts_admin');
            const savedLayouts = stored ? JSON.parse(stored) : [];
            setAllLayouts([...savedLayouts, ...MOCK_CLIENT_LAYOUTS]);
        } catch (error) {
            console.error('Errore lettura localStorage:', error);
            setAllLayouts(MOCK_CLIENT_LAYOUTS);
        }
    }, []);

    if (allLayouts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-stone-200">
                <p className="text-lg text-stone-600 mb-2">Nessun layout disponibile</p>
                <p className="text-sm text-stone-500">Contatta l'amministratore per visualizzare i layout</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">🎨 Visualizza Layout</h1>
                <p className="text-stone-600">Sfoglia i layout disponibili e scegli quello che preferisci per il tuo evento.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allLayouts.map(layout => (
                    <div
                        key={layout.id}
                        className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
                        onClick={() => onSelectLayout(layout)}
                    >
                        {/* Render Image Preview */}
                        <div className="relative bg-stone-100 aspect-video overflow-hidden flex items-center justify-center">
                            {layout.renderImage ? (
                                <>
                                    <img
                                        src={layout.renderImage}
                                        alt={`Render di ${layout.name}`}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                        <button className="px-4 py-2 bg-amber-400 text-white rounded-lg font-semibold opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-100 scale-90">
                                            👀 Visualizza
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center">
                                    <p className="text-stone-400 text-sm font-medium">Nessun render disponibile</p>
                                    <p className="text-stone-300 text-xs mt-1">Click per visualizzare</p>
                                </div>
                            )}
                        </div>

                        {/* Layout Info */}
                        <div className="p-4 space-y-2">
                            <h3 className="font-semibold text-stone-800 text-lg">{layout.name}</h3>
                            <p className="text-sm text-stone-600">
                                {layout.tables.length} tavoli
                                {layout.tables.length > 0 && ` • ${layout.tables.reduce((sum, t) => sum + t.guests.length, 0)} ospiti`}
                            </p>
                            <div className="pt-2 border-t border-stone-200">
                                <button
                                    onClick={() => onSelectLayout(layout)}
                                    className="w-full px-3 py-2 text-sm bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-colors font-medium"
                                >
                                    Seleziona Layout
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ClientLayoutsViewPage;
