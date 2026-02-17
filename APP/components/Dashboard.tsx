import React from 'react';
import { 
    CalendarDaysIcon, 
    UsersIcon, 
    CheckCircleIcon, 
    ClockIcon, 
    SparklesIcon, 
    PencilIcon, 
    ChatBubbleOvalLeftEllipsisIcon,
    ClipboardDocumentCheckIcon,
    BookOpenIcon
} from './Icons';
import type { Page } from '../types';
import { MOCK_EVENTS } from '../constants';

interface DashboardProps {
    onNavigate: (page: Page) => void;
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

const RecentEventItemRow: React.FC<{name: string; date: string; guests: number; status: 'Completato' | 'In Corso' | 'Pianificazione'; progress: number; onNavigate: (page: Page) => void}> = ({ name, date, guests, status, progress, onNavigate }) => {
    const statusClasses = {
        Completato: 'bg-green-100 text-green-800',
        'In Corso': 'bg-blue-100 text-blue-800',
        Pianificazione: 'bg-amber-100 text-amber-800',
    };
    const progressClasses = {
        Completato: 'bg-green-500',
        'In Corso': 'bg-blue-500',
        Pianificazione: 'bg-amber-500',
    };

    return (
        <tr className="hover:bg-stone-50/70 transition-colors">
            <td className="p-4 font-semibold text-stone-800">{name}</td>
            <td className="p-4 text-stone-600">{date}</td>
            <td className="p-4 text-stone-600">{guests}</td>
            <td className="p-4">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClasses[status]}`}>{status}</span>
            </td>
            <td className="p-4">
                <div className="flex items-center gap-3">
                    <div className="w-full bg-stone-200/80 rounded-full h-1.5">
                        <div className={`${progressClasses[status]} h-1.5 rounded-full`} style={{ width: `${progress}%` }}></div>
                    </div>
                    <span className="text-sm font-medium text-stone-600">{progress}%</span>
                </div>
            </td>
            <td className="p-4 text-right">
                <button onClick={() => onNavigate('planner')} className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-100 rounded-md mr-1"><PencilIcon className="w-4 h-4" /></button>
                <button onClick={() => onNavigate('chat')} className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-100 rounded-md"><ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" /></button>
            </td>
        </tr>
    );
};

const TaskItem: React.FC<{icon: React.ReactNode; title: string; subtitle: string;}> = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-4 p-3 hover:bg-stone-100/80 rounded-lg w-full text-left transition-colors">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600">
            {icon}
        </div>
        <div>
            <p className="font-semibold text-stone-800 text-sm">{title}</p>
            <p className="text-xs text-stone-500">{subtitle}</p>
        </div>
    </div>
);


const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
    // Calcola statistiche dai dati reali
    const totalEvents = MOCK_EVENTS.length;
    const totalGuests = MOCK_EVENTS.reduce((sum, event) => sum + event.guestCount, 0);
    const completedEvents = MOCK_EVENTS.filter(e => e.status === 'Completato').length;
    const confirmedGuests = MOCK_EVENTS.reduce((sum, event) => {
        const confirmed = event.guests.filter(g => g.status === 'Confermato').length;
        return sum + confirmed;
    }, 0);
    const inProgressEvents = MOCK_EVENTS.filter(e => e.status === 'In Corso').length;

    return (
        <div>
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-stone-800">Bentornato, Admin!</h1>
                    <p className="text-stone-500 mt-1">Ecco una panoramica della tua attività oggi.</p>
                </div>
                <button onClick={() => onNavigate('planner-create')} className="bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md flex items-center gap-2 justify-center">
                    <SparklesIcon className="w-5 h-5" />
                    Crea Nuovo Evento
                </button>
            </div>
          
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Eventi Totali" value={totalEvents.toString()} icon={<CalendarDaysIcon className="w-6 h-6 text-blue-500" />} />
                <StatCard title="Ospiti Totali" value={totalGuests.toString()} icon={<UsersIcon className="w-6 h-6 text-green-500" />} />
                <StatCard title="Ospiti Confermati" value={confirmedGuests.toString()} icon={<CheckCircleIcon className="w-6 h-6 text-emerald-500" />} />
                <StatCard title="In Elaborazione" value={inProgressEvents.toString()} icon={<ClockIcon className="w-6 h-6 text-orange-500" />} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Events Table */}
                <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-stone-800">Tutti gli Eventi</h2>
                        <button onClick={() => onNavigate('planner')} className="text-sm font-semibold text-amber-600 hover:text-amber-700">Gestisci</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-stone-500 uppercase bg-stone-50/70">
                                <tr>
                                    <th scope="col" className="p-4 rounded-l-lg">Evento</th>
                                    <th scope="col" className="p-4">Data</th>
                                    <th scope="col" className="p-4">Ospiti</th>
                                    <th scope="col" className="p-4">Stato</th>
                                    <th scope="col" className="p-4">Budget</th>
                                    <th scope="col" className="p-4 rounded-r-lg"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_EVENTS.map((event) => {
                                    const progressMap: { [key: string]: number } = {
                                        'Completato': 100,
                                        'In Corso': 60,
                                        'Pianificazione': 30,
                                    };
                                    const progress = progressMap[event.status] || 0;
                                    const statusClasses: { [key: string]: string } = {
                                        Completato: 'bg-green-100 text-green-800',
                                        'In Corso': 'bg-blue-100 text-blue-800',
                                        Pianificazione: 'bg-amber-100 text-amber-800',
                                    };

                                    return (
                                        <tr key={event.id} className="hover:bg-stone-50/70 transition-colors">
                                            <td className="p-4 font-semibold text-stone-800">{event.name}</td>
                                            <td className="p-4 text-stone-600">{event.date}</td>
                                            <td className="p-4 text-stone-600">{event.guestCount}</td>
                                            <td className="p-4">
                                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusClasses[event.status]}`}>{event.status}</span>
                                            </td>
                                            <td className="p-4 text-stone-600">€{event.budget.toLocaleString('it-IT')}</td>
                                            <td className="p-4 text-right">
                                                <button onClick={() => onNavigate('planner')} className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-100 rounded-md mr-1"><PencilIcon className="w-4 h-4" /></button>
                                                <button onClick={() => onNavigate('chat')} className="p-1.5 text-stone-500 hover:text-amber-600 hover:bg-amber-100 rounded-md"><ChatBubbleOvalLeftEllipsisIcon className="w-4 h-4" /></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                {/* Summary */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                     <h2 className="text-lg font-semibold text-stone-800 mb-4">Riepilogo Attività</h2>
                     <div className="space-y-4">
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                            <p className="text-xs font-semibold text-green-700 uppercase">Eventi Completati</p>
                            <p className="text-2xl font-bold text-green-800 mt-1">{completedEvents}</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="text-xs font-semibold text-blue-700 uppercase">In Elaborazione</p>
                            <p className="text-2xl font-bold text-blue-800 mt-1">{inProgressEvents}</p>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                            <p className="text-xs font-semibold text-amber-700 uppercase">Ospiti Medi per Evento</p>
                            <p className="text-2xl font-bold text-amber-800 mt-1">{Math.round(totalGuests / totalEvents)}</p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <p className="text-xs font-semibold text-purple-700 uppercase">Tasso Conferma</p>
                            <p className="text-2xl font-bold text-purple-800 mt-1">{Math.round((confirmedGuests / totalGuests) * 100)}%</p>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;