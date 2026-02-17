import React, { useState } from 'react';
import { XMarkIcon } from './Icons';
import { TABLE_TYPES } from './ClientTableEditModal';

interface AddTableModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (type: string, capacity: number) => void;
}

const AddTableModal: React.FC<AddTableModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [tableType, setTableType] = useState(TABLE_TYPES[3]); // Default to 'Ospiti Misti'
    const [capacity, setCapacity] = useState(8);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (capacity > 0) {
            onAdd(tableType, capacity);
            // Reset state for next time
            setTableType(TABLE_TYPES[3]);
            setCapacity(8);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                 <div className="flex justify-between items-center p-4 border-b border-stone-200/80">
                    <h2 className="text-lg font-semibold text-stone-800">Aggiungi un Nuovo Tavolo</h2>
                    <button onClick={onClose} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="tableType" className="block text-sm font-medium text-stone-700 mb-1">Tipologia Tavolo</label>
                            <select
                                id="tableType"
                                value={tableType}
                                onChange={(e) => setTableType(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                                required
                            >
                                {TABLE_TYPES.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="tableCapacity" className="block text-sm font-medium text-stone-700 mb-1">Capacità (N° Posti)</label>
                            <input
                                id="tableCapacity"
                                type="number"
                                min="1"
                                value={capacity}
                                onChange={(e) => setCapacity(parseInt(e.target.value, 10))}
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-200/80 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="bg-white text-stone-700 font-semibold px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors">Annulla</button>
                        <button type="submit" className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">Aggiungi Tavolo</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTableModal;