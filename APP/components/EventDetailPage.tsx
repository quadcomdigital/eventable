import React, { useState, useMemo } from 'react';
import type { Event, Payment } from '../types';
import { ArrowLeftIcon, CalendarDaysIcon, UsersIcon, CreditCardIcon, ExclamationTriangleIcon, PlusIcon, TrashIcon, ArrowDownTrayIcon } from './Icons';

interface EventDetailPageProps {
    event: Event;
    onBack: () => void;
    onUpdateEvent: (event: Event) => void;
}

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-stone-100">
            {icon}
        </div>
        <div>
            <p className="text-sm text-stone-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">{value}</p>
        </div>
    </div>
);

const EventDetailPage: React.FC<EventDetailPageProps> = ({ event, onBack, onUpdateEvent }) => {
    
    const [newPayment, setNewPayment] = useState({ description: '', amount: '' });
    
    const statusClasses: { [key: string]: string } = {
        Completato: 'bg-green-100 text-green-800',
        'In Corso': 'bg-blue-100 text-blue-800',
        Pianificazione: 'bg-amber-100 text-amber-800',
    };

    const guestStatusClasses: { [key: string]: string } = {
        Confermato: 'bg-green-100 text-green-800',
        'In attesa': 'bg-yellow-100 text-yellow-800',
        Rifiutato: 'bg-red-100 text-red-800',
    };

    const { totalPaid, balance, confirmedGuests, intoleranceNotes } = useMemo(() => {
        const totalPaid = event.payments.reduce((sum, p) => sum + p.amount, 0);
        const balance = event.budget - totalPaid;
        const confirmedGuests = event.guests.filter(g => g.status === 'Confermato').length;
        const intoleranceNotes = event.guests.filter(g => g.notes.trim() !== '');
        return { totalPaid, balance, confirmedGuests, intoleranceNotes };
    }, [event]);

    const handleAddPayment = (e: React.FormEvent) => {
        e.preventDefault();
        const amountNumber = parseFloat(newPayment.amount);
        if (newPayment.description.trim() && !isNaN(amountNumber) && amountNumber > 0) {
            const payment: Payment = {
                id: Date.now(),
                amount: amountNumber,
                description: newPayment.description,
                date: new Date().toLocaleDateString('it-IT'),
            };
            const updatedEvent = {
                ...event,
                payments: [...event.payments, payment]
            };
            onUpdateEvent(updatedEvent);
            setNewPayment({ description: '', amount: '' });
        }
    };

    const handlePrint = () => {
        const printContents = document.getElementById('printable-guest-list')?.innerHTML;
        const originalContents = document.body.innerHTML;
        if (printContents) {
            document.body.innerHTML = `
                <html>
                    <head>
                        <title>Lista Ospiti - ${event.name}</title>
                        <style>
                            body { font-family: sans-serif; }
                            table { width: 100%; border-collapse: collapse; }
                            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                            th { background-color: #f2f2f2; }
                            h1, h2 { color: #333; }
                        </style>
                    </head>
                    <body>
                        <h1>Lista Ospiti: ${event.name}</h1>
                        <h2>Data: ${event.date}</h2>
                        <hr/>
                        ${printContents}
                    </body>
                </html>
            `;
            window.print();
            document.body.innerHTML = originalContents;
            // We need to re-attach the React app event listeners, a reload is the simplest way.
            window.location.reload(); 
        }
    };
    

    return (
        <div>
             <style>{`
                @media print {
                    .no-print { display: none !important; }
                    body > *:not(.print-section) { display: none; }
                    .print-section {
                        position: absolute;
                        top: 0;
                        left: 0;
                        width: 100%;
                    }
                }
            `}</style>
            {/* Header */}
            <div className="flex items-center gap-4 mb-8 no-print">
                <button onClick={onBack} className="p-2 bg-white rounded-md border border-stone-200/80 shadow-sm hover:bg-stone-100 transition-colors">
                    <ArrowLeftIcon className="w-5 h-5 text-stone-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-stone-800">{event.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <CalendarDaysIcon className="w-4 h-4 text-stone-500" />
                        <p className="text-stone-500">{event.date}</p>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClasses[event.status]}`}>{event.status}</span>
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 no-print">
                <StatCard title="Budget Totale" value={`€${event.budget.toLocaleString('it-IT')}`} icon={<CreditCardIcon className="w-6 h-6 text-blue-500" />} />
                <StatCard title="Importo Saldato" value={`€${totalPaid.toLocaleString('it-IT')}`} icon={<CreditCardIcon className="w-6 h-6 text-green-500" />} />
                <StatCard title="Saldo Rimanente" value={`€${balance.toLocaleString('it-IT')}`} icon={<CreditCardIcon className="w-6 h-6 text-red-500" />} />
                <StatCard title="Ospiti Confermati" value={`${confirmedGuests} / ${event.guestCount}`} icon={<UsersIcon className="w-6 h-6 text-amber-500" />} />
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start no-print">
                {/* Guest & Food Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Disposizioni Created */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        <h2 className="text-lg font-semibold text-stone-800 mb-4">📋 Disposizioni Create</h2>
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
                            <p className="text-sm text-stone-600">
                                <strong>Numero di tavoli:</strong> In base ai layout salvati <br/>
                                <strong>Capacità totale:</strong> Consultare le disposizioni nel menu "Disposizioni"
                            </p>
                            <a href="#" className="mt-3 inline-block text-sm font-semibold text-amber-700 hover:text-amber-900 bg-amber-100 px-4 py-2 rounded-lg transition-colors">
                                🔗 Gestisci Disposizioni
                            </a>
                        </div>
                    </div>

                    {/* Food & Menu */}
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-stone-800">🍽️ Preparazione Cibo e Menù</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-green-900 mb-2">Ospiti Confermati</h3>
                                <p className="text-sm text-green-800">
                                    <strong>{confirmedGuests}</strong> ospiti confermati su <strong>{event.guestCount}</strong> previsti
                                </p>
                                <p className="text-xs text-green-700 mt-2">Calcolo porzioni: {confirmedGuests} × 1 = {confirmedGuests} piatti</p>
                            </div>

                            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-amber-200 rounded-lg p-4">
                                <h3 className="font-semibold text-amber-900 mb-2">Esigenze Dietetiche</h3>
                                {event.guests.filter(g => g.notes.trim() !== '' || g.menuType).length > 0 ? (
                                    <ul className="space-y-1 text-sm text-amber-800">
                                        <li><strong>Vegetariani:</strong> {event.guests.filter(g => g.menuType === 'Vegetariano').length}</li>
                                        <li><strong>Vegani:</strong> {event.guests.filter(g => g.menuType === 'Vegano').length}</li>
                                        <li><strong>Senza Glutine:</strong> {event.guests.filter(g => g.menuType === 'Senza Glutine').length}</li>
                                        <li><strong>Con Allergie/Intolleranze:</strong> {event.guests.filter(g => g.notes.includes('Celiaco') || g.notes.includes('allergi') || g.notes.includes('intolleran')).length}</li>
                                    </ul>
                                ) : (
                                    <p className="text-sm text-amber-700">Nessuna esigenza dietetica speciale registrata</p>
                                )}
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="font-semibold text-blue-900 mb-2">Checklist Cibo</h3>
                                <div className="space-y-2 text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-blue-100/50 p-2 rounded">
                                        <input type="checkbox" className="w-4 h-4 rounded" defaultChecked={false} />
                                        <span className="text-blue-800">Menu principale preparato</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-blue-100/50 p-2 rounded">
                                        <input type="checkbox" className="w-4 h-4 rounded" defaultChecked={false} />
                                        <span className="text-blue-800">Piatti vegetariani/vegani preparati</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-blue-100/50 p-2 rounded">
                                        <input type="checkbox" className="w-4 h-4 rounded" defaultChecked={false} />
                                        <span className="text-blue-800">Allergie verificate con i fornitori</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer hover:bg-blue-100/50 p-2 rounded">
                                        <input type="checkbox" className="w-4 h-4 rounded" defaultChecked={false} />
                                        <span className="text-blue-800">Bevande e alcoli ordinati</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-stone-800">Elenco Ospiti</h2>
                            <button onClick={handlePrint} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2 text-sm">
                               <ArrowDownTrayIcon className="w-5 h-5" />
                               Stampa Lista
                            </button>
                        </div>

                        {/* Intolerances Summary */}
                        {intoleranceNotes.length > 0 && (
                             <div className="mb-4 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-lg">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ExclamationTriangleIcon className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-semibold text-amber-800">Riepilogo Intolleranze e Note</h3>
                                        <div className="mt-2 text-sm text-amber-700">
                                            <ul className="list-disc space-y-1 pl-5">
                                                {intoleranceNotes.map(guest => (
                                                    <li key={guest.id}><strong>{guest.name}:</strong> {guest.notes}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                       
                        <div id="printable-guest-list" className="overflow-x-auto max-h-96">
                             <table className="w-full text-sm text-left">
                                <thead className="text-xs text-stone-500 uppercase bg-stone-50/70 sticky top-0">
                                    <tr>
                                        <th scope="col" className="p-3 rounded-l-lg">Nome Ospite</th>
                                        <th scope="col" className="p-3">Stato</th>
                                        <th scope="col" className="p-3 rounded-r-lg">Note (Allergie, Intolleranze, ecc.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {event.guests.map((guest, index) => (
                                        <tr key={guest.id} className={`border-b border-stone-200/80 last:border-b-0 ${guest.notes ? 'bg-red-50' : ''}`}>
                                            <td className="p-3 font-semibold text-stone-800">{guest.name}</td>
                                            <td className="p-3"><span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${guestStatusClasses[guest.status]}`}>{guest.status}</span></td>
                                            <td className="p-3 text-stone-600">{guest.notes || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Payments & Notes Column */}
                <div className="space-y-8">
                     <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        <h2 className="text-lg font-semibold text-stone-800 mb-4">Pagamenti e Acconti</h2>
                        <div className="space-y-2 mb-4">
                            {event.payments.map(p => (
                                <div key={p.id} className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg">
                                    <div>
                                        <p className="font-medium text-stone-700">{p.description}</p>
                                        <p className="text-xs text-stone-500">{p.date}</p>
                                    </div>
                                    <p className="font-semibold text-green-700">€{p.amount.toLocaleString('it-IT')}</p>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleAddPayment} className="space-y-2">
                             <input type="text" value={newPayment.description} onChange={e => setNewPayment({...newPayment, description: e.target.value})} placeholder="Descrizione (es. Saldo)" className="w-full text-sm px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                             <input type="number" value={newPayment.amount} onChange={e => setNewPayment({...newPayment, amount: e.target.value})} placeholder="Importo" className="w-full text-sm px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                             <button type="submit" className="w-full bg-blue-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2">
                                 <PlusIcon className="w-4 h-4" /> Aggiungi Pagamento
                             </button>
                        </form>
                    </div>
                    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        <h2 className="text-lg font-semibold text-stone-800 mb-4">Note Generali</h2>
                        <textarea
                            value={event.generalNotes}
                            onChange={(e) => onUpdateEvent({ ...event, generalNotes: e.target.value })}
                            rows={4}
                            className="w-full text-sm p-3 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/70"
                            placeholder="Aggiungi note o dettagli importanti per l'evento..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;
