import React from 'react';
import type { Client } from '../types';
import { XMarkIcon, PhoneIcon, EnvelopeIcon, CalendarDaysIcon, DocumentTextIcon } from './Icons';

interface ClientDetailModalProps {
    client: Client | null;
    onClose: () => void;
}

const ClientDetailModal: React.FC<ClientDetailModalProps> = ({ client, onClose }) => {
    if (!client) return null;
    
    const quoteStatusClasses: {[key: string]: string} = {
        'Accettato': 'bg-green-100 text-green-800',
        'Inviato': 'bg-blue-100 text-blue-800',
        'Rifiutato': 'bg-red-100 text-red-800',
    };
    
    const eventStatusClasses: {[key: string]: string} = {
        'Completato': 'bg-green-100 text-green-800',
        'In Corso': 'bg-blue-100 text-blue-800',
        'Pianificazione': 'bg-amber-100 text-amber-800',
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="flex justify-between items-start p-6 border-b border-stone-200/80">
                    <div>
                        <h2 className="text-xl font-bold text-stone-800">{client.name}</h2>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-600">
                             <div className="flex items-center gap-2">
                                <EnvelopeIcon className="w-4 h-4 text-stone-400" />
                                <span>{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-stone-400" />
                                <span>{client.phone}</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-full">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </div>
                
                {/* Content */}
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Events Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-stone-700 flex items-center gap-2 mb-3">
                            <CalendarDaysIcon className="w-5 h-5 text-amber-500" />
                            Eventi Associati
                        </h3>
                        <div className="space-y-3">
                            {client.events.length > 0 ? client.events.map(event => (
                                <div key={event.id} className="p-3 bg-stone-50/70 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-stone-800">{event.name}</p>
                                        <p className="text-xs text-stone-500">{event.date}</p>
                                    </div>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${eventStatusClasses[event.status]}`}>{event.status}</span>
                                </div>
                            )) : <p className="text-sm text-stone-500 italic">Nessun evento associato.</p>}
                        </div>
                    </div>
                    
                    {/* Quotes Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-stone-700 flex items-center gap-2 mb-3">
                            <DocumentTextIcon className="w-5 h-5 text-amber-500" />
                            Preventivi
                        </h3>
                        <div className="space-y-3">
                            {client.quotes.length > 0 ? client.quotes.map(quote => (
                                <div key={quote.id} className="p-3 bg-stone-50/70 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-stone-800">{quote.name}</p>
                                        <p className="text-xs text-stone-500">Importo: €{quote.amount.toLocaleString('it-IT')}</p>
                                    </div>
                                     <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${quoteStatusClasses[quote.status]}`}>{quote.status}</span>
                                </div>
                            )) : <p className="text-sm text-stone-500 italic">Nessun preventivo associato.</p>}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-200/80 flex justify-end rounded-b-xl">
                    <button onClick={onClose} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">
                        Chiudi
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailModal;