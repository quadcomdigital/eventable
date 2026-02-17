import React from 'react';
import type { Event, Page } from '../types';
import { EyeIcon } from './Icons';

interface EventPlannerProps {
    events: Event[];
    onNavigate: (page: Page, payload?: any) => void;
}

const EventPlanner: React.FC<EventPlannerProps> = ({ events, onNavigate }) => {
    
    const typeColorMap: { [key: string]: string } = {
        'Matrimonio': 'bg-pink-100 text-pink-800',
        'Anniversario': 'bg-sky-100 text-sky-800',
        'Evento Aziendale': 'bg-indigo-100 text-indigo-800',
    };
    
    const defaultTypeColor = 'bg-stone-100 text-stone-800';

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Tutti gli Eventi</h1>
                <p className="mt-2 text-lg text-stone-600">
                    Visualizza, gestisci e monitora lo stato di avanzamento di tutti gli eventi.
                </p>
            </div>

            {/* Event Table */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-stone-500 uppercase bg-stone-50/70">
                            <tr>
                                <th scope="col" className="p-4 rounded-tl-lg">Nome Evento</th>
                                <th scope="col" className="p-4">Data</th>
                                <th scope="col" className="p-4">Ospiti</th>
                                <th scope="col" className="p-4">Budget</th>
                                <th scope="col" className="p-4">Tipologia</th>
                                <th scope="col" className="p-4 rounded-tr-lg text-right">Azioni</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-200/80">
                            {events.map(event => (
                                <tr key={event.id} className="hover:bg-stone-50/70 transition-colors">
                                    <td className="p-4 font-semibold text-stone-800">
                                        <button 
                                            type="button"
                                            onClick={() => onNavigate('event-detail', { eventId: event.id })}
                                            className="text-left hover:text-amber-600 transition-colors"
                                        >
                                            {event.name}
                                        </button>
                                    </td>
                                    <td className="p-4 text-stone-600">{event.date}</td>
                                    <td className="p-4 text-stone-600">{event.guestCount}</td>
                                    <td className="p-4 text-stone-600">€{event.budget.toLocaleString('it-IT')}</td>
                                    <td className="p-4">
                                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${typeColorMap[event.type] || defaultTypeColor}`}>
                                            {event.type}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            type="button"
                                            onClick={() => onNavigate('event-detail', { eventId: event.id })}
                                            className="p-2 text-stone-500 hover:text-amber-600 hover:bg-amber-100 rounded-md transition-colors"
                                            aria-label={`Visualizza dettagli per ${event.name}`}
                                        >
                                            <EyeIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default EventPlanner;