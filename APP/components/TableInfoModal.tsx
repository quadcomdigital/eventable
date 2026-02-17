import React from 'react';
import type { Table } from '../types';
import { XMarkIcon } from './Icons';

interface TableInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: Table | null;
}

const TableInfoModal: React.FC<TableInfoModalProps> = ({ isOpen, onClose, table }) => {
    if (!isOpen || !table) return null;

    const capacityPercentage = table.capacity > 0 ? (table.guests.length / table.capacity) * 100 : 0;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
                <div className="flex justify-between items-start p-4 border-b border-stone-200/80">
                    <div>
                        <h2 className="text-lg font-semibold text-stone-800">{table.name}</h2>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-100 text-stone-700">{table.type}</span>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6">
                    <div className="mb-4">
                        <label className="text-sm font-medium text-stone-600">Posti: {table.guests.length} / {table.capacity}</label>
                        <div className="w-full bg-stone-200/80 rounded-full h-2 mt-1">
                           <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${capacityPercentage}%` }}></div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-md font-semibold text-stone-700 mb-2">Ospiti Assegnati</h3>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 bg-stone-50/70 p-3 rounded-lg border border-stone-200/80">
                           {table.guests.length > 0 ? (
                            <ul className="space-y-1">
                                {table.guests.map(guest => (
                                    <li key={guest.id} className="text-sm text-stone-800">
                                        - {guest.name}
                                    </li>
                                ))}
                            </ul>
                           ) : (
                               <p className="text-sm text-stone-500 italic">Nessun ospite a questo tavolo.</p>
                           )}
                        </div>
                    </div>
                </div>

                <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-200/80 flex justify-end rounded-b-xl">
                    <button onClick={onClose} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TableInfoModal;