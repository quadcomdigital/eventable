import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, ArrowUpTrayIcon, TrashIcon } from './Icons';

interface SavedLayout {
    id: number;
    name: string;
}

interface TableToolsProps {
    onAddTable: () => void;
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onRenderImageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveLayout: (name: string) => void;
    savedLayouts: SavedLayout[];
    onLoadLayout: (id: number) => void;
    onDeleteLayout: (id: number) => void;
    currentLayoutId: number | null;
    currentLayoutName?: string;
}

const TableTools: React.FC<TableToolsProps> = ({ 
    onAddTable, 
    onFileChange,
    onRenderImageChange,
    onSaveLayout,
    savedLayouts,
    onLoadLayout,
    onDeleteLayout,
    currentLayoutId,
    currentLayoutName
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const renderImageInputRef = useRef<HTMLInputElement>(null);
    const [layoutName, setLayoutName] = useState('');

    useEffect(() => {
        // When the loaded layout changes, update the input field
        if (currentLayoutName) {
            setLayoutName(currentLayoutName);
        } else {
            setLayoutName(''); // Clear if no layout is loaded
        }
    }, [currentLayoutName]);

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleRenderUploadClick = () => {
        renderImageInputRef.current?.click();
    };
    
    const handleSaveClick = () => {
        onSaveLayout(layoutName);
    };

    return (
        <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-stone-200/80 shadow-sm flex-shrink-0">
            <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Left Side: Actions */}
                <div className="flex items-center gap-2">
                    <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
                    <input type="file" ref={renderImageInputRef} onChange={onRenderImageChange} accept="image/*" className="hidden" />
                    <button onClick={handleUploadClick} className="bg-white text-stone-600 font-semibold px-3 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors shadow-sm text-sm flex items-center gap-2">
                        <ArrowUpTrayIcon className="w-4 h-4" />
                        Carica Piantina
                    </button>
                    <button onClick={handleRenderUploadClick} className="bg-white text-stone-600 font-semibold px-3 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors shadow-sm text-sm flex items-center gap-2">
                        📸 Render
                    </button>
                    <button onClick={onAddTable} className="bg-amber-400 text-white font-semibold px-3 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm text-sm flex items-center gap-2">
                        <PlusIcon className="w-4 h-4" />
                        Aggiungi Tavolo
                    </button>
                </div>

                {/* Right Side: Layout Management */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={layoutName}
                            onChange={(e) => setLayoutName(e.target.value)}
                            placeholder="Nome del layout..."
                            className="text-sm px-3 py-2 border border-stone-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-amber-500 w-40"
                        />
                        <button 
                            onClick={handleSaveClick} 
                            className="bg-blue-500 text-white font-semibold px-3 py-2 rounded-r-lg hover:bg-blue-600 transition-colors text-sm"
                        >
                            {currentLayoutId ? 'Aggiorna' : 'Salva'}
                        </button>
                    </div>
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-stone-600">Layouts:</span>
                        <select
                            value={currentLayoutId || ''}
                            onChange={(e) => onLoadLayout(Number(e.target.value))}
                            className="text-sm px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                        >
                            <option value="" disabled>Carica un layout</option>
                            {savedLayouts.map(layout => (
                                <option key={layout.id} value={layout.id}>{layout.name}</option>
                            ))}
                        </select>
                        {currentLayoutId && (
                             <button onClick={() => onDeleteLayout(currentLayoutId)} className="p-2 text-stone-500 hover:text-red-600 hover:bg-red-100 rounded-full">
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableTools;