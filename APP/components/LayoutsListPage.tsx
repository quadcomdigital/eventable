import React, { useState, useEffect } from 'react';
import type { SavedLayout } from '../types';
import { TrashIcon, PencilIcon } from './Icons';

interface LayoutsListPageProps {
    onEditLayout: (layout: SavedLayout) => void;
}

const LayoutsListPage: React.FC<LayoutsListPageProps> = ({ onEditLayout }) => {
    const [layouts, setLayouts] = useState<SavedLayout[]>([]);
    const [selectedLayoutId, setSelectedLayoutId] = useState<number | null>(null);

    useEffect(() => {
        // Carica i layout salvati da localStorage
        const stored = localStorage.getItem('saved_layouts_admin');
        if (stored) {
            setLayouts(JSON.parse(stored));
        }
    }, []);

    const handleDeleteLayout = (layoutId: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questo layout?')) {
            const updatedLayouts = layouts.filter(l => l.id !== layoutId);
            setLayouts(updatedLayouts);
            localStorage.setItem('saved_layouts_admin', JSON.stringify(updatedLayouts));
        }
    };

    const handleUploadRender = (layoutId: number, file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const renderImage = e.target?.result as string;
            const updatedLayouts = layouts.map(l =>
                l.id === layoutId ? { ...l, renderImage } : l
            );
            setLayouts(updatedLayouts);
            localStorage.setItem('saved_layouts_admin', JSON.stringify(updatedLayouts));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveRender = (layoutId: number) => {
        const updatedLayouts = layouts.map(l =>
            l.id === layoutId ? { ...l, renderImage: undefined } : l
        );
        setLayouts(updatedLayouts);
        localStorage.setItem('saved_layouts_admin', JSON.stringify(updatedLayouts));
    };

    if (layouts.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-stone-200">
                <p className="text-lg text-stone-600 mb-2">Nessun layout salvato</p>
                <p className="text-sm text-stone-500">Crea il primo layout dalla sezione "Disposizioni"</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-stone-800 mb-2">📋 Gestione Layout</h1>
                <p className="text-stone-600">Visualizza e gestisci i tuoi layout salvati. Aggiungi foto render per mostrare ai clienti come verrà il risultato finale.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {layouts.map(layout => (
                    <div
                        key={layout.id}
                        onClick={() => setSelectedLayoutId(selectedLayoutId === layout.id ? null : layout.id)}
                        className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        {/* Render Image Preview */}
                        <div className="relative bg-stone-100 aspect-video overflow-hidden flex items-center justify-center">
                            {layout.renderImage ? (
                                <img
                                    src={layout.renderImage}
                                    alt={`Render di ${layout.name}`}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center">
                                    <p className="text-stone-400 text-sm font-medium">Nessun render</p>
                                    <p className="text-stone-300 text-xs mt-1">Carica una foto</p>
                                </div>
                            )}
                        </div>

                        {/* Layout Info */}
                        <div className="p-4 space-y-3">
                            <div>
                                <h3 className="font-semibold text-stone-800 text-lg">{layout.name}</h3>
                                <p className="text-sm text-stone-600 mt-1">
                                    {layout.tables.length} tavoli
                                    {layout.tables.length > 0 && ` • ${layout.tables.reduce((sum, t) => sum + t.guests.length, 0)} ospiti`}
                                </p>
                            </div>

                            {/* Render Upload/Actions */}
                            {selectedLayoutId === layout.id && (
                                <div className="space-y-2 pt-2 border-t border-stone-200">
                                    {layout.renderImage ? (
                                        <>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const input = document.createElement('input');
                                                    input.type = 'file';
                                                    input.accept = 'image/*';
                                                    input.onchange = (e) => {
                                                        const file = (e.target as HTMLInputElement).files?.[0];
                                                        if (file) handleUploadRender(layout.id, file);
                                                    };
                                                    input.click();
                                                }}
                                                className="w-full px-3 py-2 text-sm bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-colors font-medium"
                                            >
                                                📸 Cambia Render
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveRender(layout.id);
                                                }}
                                                className="w-full px-3 py-2 text-sm bg-stone-200 text-stone-700 rounded-md hover:bg-stone-300 transition-colors font-medium"
                                            >
                                                ✕ Rimuovi Render
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const input = document.createElement('input');
                                                input.type = 'file';
                                                input.accept = 'image/*';
                                                input.onchange = (e) => {
                                                    const file = (e.target as HTMLInputElement).files?.[0];
                                                    if (file) handleUploadRender(layout.id, file);
                                                };
                                                input.click();
                                            }}
                                            className="w-full px-3 py-2 text-sm bg-amber-400 text-white rounded-md hover:bg-amber-500 transition-colors font-medium"
                                        >
                                            📸 Aggiungi Render
                                        </button>
                                    )}

                                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-200">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onEditLayout(layout);
                                            }}
                                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                            Modifica
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteLayout(layout.id);
                                            }}
                                            className="flex items-center justify-center gap-1 px-3 py-2 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors font-medium"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                            Elimina
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LayoutsListPage;
