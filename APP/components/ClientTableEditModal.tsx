
import React, { useState, useEffect } from 'react';
import { XMarkIcon, TrashIcon, PlusIcon } from './Icons';
// FIX: Correctly import UserRole from types.ts instead of App.tsx
import type { UserRole } from '../types';
import type { Guest, Table } from '../types';

interface ClientTableEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    table: Table | null;
    onSave: (table: Table) => void;
    onDelete: (tableId: number) => void;
    userRole: UserRole;
}

export const TABLE_TYPES = [
    'Tavolo Sposi',
    'Ospiti Sposa',
    'Ospiti Sposo',
    'Ospiti Misti',
    'Tavolo Band/Staff',
];

const ClientTableEditModal: React.FC<ClientTableEditModalProps> = ({ isOpen, onClose, table, onSave, onDelete, userRole }) => {
    const [editableTable, setEditableTable] = useState<Table | null>(null);
    const [newGuestName, setNewGuestName] = useState('');
    const [expandedGuestId, setExpandedGuestId] = useState<number | null>(null);

    useEffect(() => {
        if (table) {
            setEditableTable(JSON.parse(JSON.stringify(table)));
        } else {
            setEditableTable(null);
        }
    }, [table]);

    if (!isOpen || !editableTable) return null;

    const isAdmin = userRole === 'admin';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const parsedValue = name === 'capacity' ? parseInt(value, 10) || 0 : value;
        setEditableTable({ ...editableTable, [name]: parsedValue });
    };

    const handleAddGuest = () => {
        if (newGuestName.trim() && editableTable.guests.length < editableTable.capacity) {
            // FIX: The Guest type requires `status` and `notes` properties. Added default values.
            const newGuest: Guest = { 
                id: Date.now(), 
                name: newGuestName.trim(), 
                status: 'In attesa', 
                notes: '',
                allergies: '',
                intolerances: '',
                menuType: 'Normale'
            };
            setEditableTable({ ...editableTable, guests: [...editableTable.guests, newGuest] });
            setNewGuestName('');
        }
    };

    const handleUpdateGuest = (guestId: number, field: string, value: string) => {
        setEditableTable({
            ...editableTable,
            guests: editableTable.guests.map(g => 
                g.id === guestId ? { ...g, [field]: value } : g
            )
        });
    };
    
    const handleRemoveGuest = (guestId: number) => {
        setEditableTable({ ...editableTable, guests: editableTable.guests.filter(g => g.id !== guestId) });
    };

    const handleSave = () => {
        onSave(editableTable);
    };
    
    const handleDelete = () => {
      if (window.confirm(`Sei sicuro di voler eliminare il tavolo "${editableTable.name}"?`)) {
        onDelete(editableTable.id);
      }
    }
    
    const isTableFull = editableTable.guests.length >= editableTable.capacity;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex justify-between items-center p-4 border-b border-stone-200/80">
                    <h2 className="text-lg font-semibold text-stone-800">{isAdmin ? 'Modifica Tavolo' : 'Gestisci Ospiti Tavolo'}</h2>
                    <button onClick={onClose} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2">
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Nome Tavolo</label>
                            {isAdmin ? (
                                <input type="text" name="name" id="name" value={editableTable.name} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                            ) : (
                                <p className="w-full px-3 py-2 bg-stone-100/70 text-stone-700 rounded-md">{editableTable.name}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-stone-700 mb-1">Capacità</label>
                            {isAdmin ? (
                                <input type="number" name="capacity" id="capacity" min="1" value={editableTable.capacity} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"/>
                             ) : (
                                <p className="w-full px-3 py-2 bg-stone-100/70 text-stone-700 rounded-md">{editableTable.capacity}</p>
                            )}
                        </div>
                    </div>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-stone-700 mb-1">Tipologia</label>
                        {isAdmin ? (
                            <select name="type" id="type" value={editableTable.type} onChange={handleInputChange} className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white">
                                {TABLE_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        ) : (
                             <p className="w-full px-3 py-2 bg-stone-100/70 text-stone-700 rounded-md">{editableTable.type}</p>
                        )}
                    </div>
                    
                    <div>
                        <h3 className="text-md font-semibold text-stone-700 mb-2">Ospiti ({editableTable.guests.length} / {editableTable.capacity})</h3>
                        <div className="space-y-2 max-h-80 overflow-y-auto pr-2 bg-stone-50/70 p-3 rounded-lg border border-stone-200/80">
                           {editableTable.guests.length > 0 ? editableTable.guests.map(guest => (
                                <div key={guest.id} className="bg-white rounded-md text-sm shadow-sm border border-stone-200/50">
                                    <div className="flex justify-between items-center p-3 cursor-pointer" onClick={() => setExpandedGuestId(expandedGuestId === guest.id ? null : guest.id)}>
                                        <span className="font-medium text-stone-700">{guest.name}</span>
                                        <div className="flex items-center gap-2">
                                            {(guest.allergies || guest.intolerances || (guest.menuType && guest.menuType !== 'Normale')) && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                                    Esigenze
                                                </span>
                                            )}
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRemoveGuest(guest.id);
                                                }} 
                                                className="p-1 text-stone-400 hover:text-red-600 hover:bg-red-100 rounded-full">
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    {expandedGuestId === guest.id && (
                                        <div className="border-t border-stone-200/50 p-3 bg-stone-50/30 space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-stone-600 mb-1">Allergie</label>
                                                <input
                                                    type="text"
                                                    value={guest.allergies || ''}
                                                    onChange={(e) => handleUpdateGuest(guest.id, 'allergies', e.target.value)}
                                                    placeholder="Es: Arachidi, Noci..."
                                                    className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-xs font-semibold text-stone-600 mb-1">Intolleranze</label>
                                                <input
                                                    type="text"
                                                    value={guest.intolerances || ''}
                                                    onChange={(e) => handleUpdateGuest(guest.id, 'intolerances', e.target.value)}
                                                    placeholder="Es: Lattosio, Glutine..."
                                                    className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-stone-600 mb-1">Tipo Menù</label>
                                                <select
                                                    value={guest.menuType || 'Normale'}
                                                    onChange={(e) => handleUpdateGuest(guest.id, 'menuType', e.target.value)}
                                                    className="w-full px-2 py-1.5 border border-stone-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                                                >
                                                    <option value="Normale">Normale</option>
                                                    <option value="Vegetariano">Vegetariano</option>
                                                    <option value="Vegano">Vegano</option>
                                                    <option value="Senza Glutine">Senza Glutine</option>
                                                    <option value="Senza Lattosio">Senza Lattosio</option>
                                                    <option value="Altro">Altro</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}
                                </div>
                           )) : (
                               <p className="text-sm text-stone-500 italic text-center py-2">Nessun ospite a questo tavolo.</p>
                           )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            <input
                                type="text"
                                value={newGuestName}
                                onChange={(e) => setNewGuestName(e.target.value)}
                                placeholder="Nome nuovo ospite..."
                                className="flex-1 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                disabled={isTableFull}
                            />
                            <button onClick={handleAddGuest} disabled={isTableFull} className="bg-amber-400 text-white p-2.5 rounded-md hover:bg-amber-500 disabled:bg-stone-300 disabled:cursor-not-allowed">
                                <PlusIcon className="w-4 h-4" />
                            </button>
                        </div>
                        {isTableFull && <p className="text-xs text-red-600 mt-1">Il tavolo ha raggiunto la capacità massima.</p>}
                    </div>
                </div>

                <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-200/80 flex justify-between items-center rounded-b-xl">
                    {isAdmin ? (
                        <button onClick={handleDelete} className="text-sm text-red-600 font-semibold hover:bg-red-100 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                            <TrashIcon className="w-4 h-4"/>
                            Elimina Tavolo
                        </button>
                    ) : (
                        <div></div> 
                    )}
                    <div>
                        <button onClick={onClose} className="bg-white text-stone-700 font-semibold px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors mr-2">
                            Annulla
                        </button>
                        <button onClick={handleSave} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">
                            {isAdmin ? 'Salva Modifiche' : 'Salva Ospiti'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientTableEditModal;