import React, { useState, useEffect } from 'react';
import type { SubmittedLayout } from '../types';
import { TrashIcon, EyeIcon } from './Icons';

interface SubmittedLayoutsPageProps {
    onViewLayout?: (layout: SubmittedLayout) => void;
}

const SubmittedLayoutsPage: React.FC<SubmittedLayoutsPageProps> = ({ onViewLayout }) => {
    const [submittedLayouts, setSubmittedLayouts] = useState<SubmittedLayout[]>([]);
    const [selectedLayout, setSelectedLayout] = useState<SubmittedLayout | null>(null);
    const [expandedId, setExpandedId] = useState<number | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem('submitted_layouts_clients');
        if (stored) {
            const layouts = JSON.parse(stored);
            // Ordina per data decrescente (più recente in alto)
            layouts.sort((a: SubmittedLayout, b: SubmittedLayout) => 
                new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
            );
            setSubmittedLayouts(layouts);
        }
    }, []);

    const handleDeleteSubmission = (id: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questa disposizione?')) {
            const updated = submittedLayouts.filter(l => l.id !== id);
            setSubmittedLayouts(updated);
            localStorage.setItem('submitted_layouts_clients', JSON.stringify(updated));
            if (selectedLayout?.id === id) {
                setSelectedLayout(null);
            }
        }
    };

    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat('it-IT', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    if (submittedLayouts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-stone-200">
                <p className="text-lg text-stone-600 mb-2">Nessuna disposizione ricevuta</p>
                <p className="text-sm text-stone-500">I clienti invieranno qui le loro disposizioni</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Lista Disposizioni */}
            <div className="lg:col-span-1 space-y-3">
                <div className="bg-white rounded-xl shadow-md p-4 border border-stone-200">
                    <h2 className="text-lg font-bold text-stone-800 mb-3">📋 Disposizioni Ricevute ({submittedLayouts.length})</h2>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {submittedLayouts.map(layout => (
                            <button
                                key={layout.id}
                                onClick={() => {
                                    setSelectedLayout(layout);
                                    setExpandedId(expandedId === layout.id ? null : layout.id);
                                }}
                                className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                                    selectedLayout?.id === layout.id
                                        ? 'border-amber-500 bg-amber-50'
                                        : 'border-stone-200 bg-white hover:border-stone-300'
                                }`}
                            >
                                <p className="font-semibold text-stone-800 text-sm">{layout.clientName}</p>
                                <p className="text-xs text-stone-600">{layout.layoutName}</p>
                                <p className="text-xs text-amber-600 font-medium mt-1">👥 {layout.totalGuests} ospiti</p>
                                <p className="text-xs text-stone-400 mt-1">{formatDate(layout.submittedAt)}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Dettagli e Visualizzazione */}
            <div className="lg:col-span-2">
                {selectedLayout ? (
                    <div className="space-y-4">
                        {/* Render Preview */}
                        {selectedLayout.renderImage && (
                            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-stone-200">
                                <img
                                    src={selectedLayout.renderImage}
                                    alt={`Render di ${selectedLayout.layoutName}`}
                                    className="w-full h-auto object-cover"
                                />
                            </div>
                        )}

                        {/* Info Generali */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <h3 className="text-xl font-bold text-stone-800 mb-4">📍 Dettagli Disposizione</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                    <span className="text-stone-600 font-medium">Cliente:</span>
                                    <span className="text-stone-800 font-semibold">{selectedLayout.clientName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                    <span className="text-stone-600 font-medium">Layout:</span>
                                    <span className="text-stone-800 font-semibold">{selectedLayout.layoutName}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                    <span className="text-stone-600 font-medium">Totale Ospiti:</span>
                                    <span className="text-amber-600 font-bold text-lg">{selectedLayout.totalGuests}</span>
                                </div>
                                <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                                    <span className="text-stone-600 font-medium">Tavoli:</span>
                                    <span className="text-stone-800 font-semibold">{selectedLayout.tables.length}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-stone-600 font-medium">Inviato:</span>
                                    <span className="text-stone-600 text-sm">{formatDate(selectedLayout.submittedAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Lista Tavoli con Ospiti */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <h3 className="text-lg font-bold text-stone-800 mb-4">🪑 Tavoli e Ospiti</h3>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {selectedLayout.tables.map((table, tableIndex) => (
                                    <div key={table.id} className="border border-stone-200 rounded-lg p-4 bg-stone-50/50">
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-stone-200">
                                            <h4 className="font-semibold text-stone-800">{table.name}</h4>
                                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                                                {table.guests.length} / {table.capacity}
                                            </span>
                                        </div>
                                        <p className="text-xs text-stone-600 mb-3">Tipologia: {table.type}</p>
                                        {table.guests.length > 0 ? (
                                            <div className="space-y-2">
                                                {table.guests.map((guest, guestIndex) => (
                                                    <div key={guest.id} className="bg-white p-2 rounded border border-stone-200 text-sm">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <p className="font-medium text-stone-800">{guest.name}</p>
                                                                {guest.menuType && guest.menuType !== 'Normale' && (
                                                                    <p className="text-xs text-stone-600">🍽️ {guest.menuType}</p>
                                                                )}
                                                            </div>
                                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-medium">
                                                                {guest.status}
                                                            </span>
                                                        </div>
                                                        {(guest.allergies || guest.intolerances) && (
                                                            <div className="mt-1 text-xs text-orange-600 space-y-1">
                                                                {guest.allergies && <p>⚠️ Allergie: {guest.allergies}</p>}
                                                                {guest.intolerances && <p>⚠️ Intolleranze: {guest.intolerances}</p>}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-stone-500 italic">Nessun ospite a questo tavolo</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Azioni */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => onViewLayout?.(selectedLayout)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                            >
                                <EyeIcon className="w-5 h-5" />
                                Visualizza Mappa
                            </button>
                            <button
                                onClick={() => handleDeleteSubmission(selectedLayout.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200 transition-colors"
                            >
                                <TrashIcon className="w-5 h-5" />
                                Elimina
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-8 text-center border border-stone-200 h-full flex items-center justify-center">
                        <p className="text-lg text-stone-500">Seleziona una disposizione per visualizzare i dettagli</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubmittedLayoutsPage;
