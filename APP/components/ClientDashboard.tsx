import React from 'react';
import type { Page } from '../types';
import { CalendarDaysIcon, UsersIcon, CheckCircleIcon, ClockIcon, TableCellsIcon, PencilSquareIcon, SparklesIcon } from './Icons';

interface ClientDashboardProps {
    onNavigate: (page: Page) => void;
}

const InfoCard: React.FC<{ title: string; value: string; icon: React.ReactNode; }> = ({ title, value, icon }) => (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-stone-100 text-amber-500">
            {icon}
        </div>
        <div>
            <p className="text-sm text-stone-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">{value}</p>
        </div>
    </div>
);

const ActionCard: React.FC<{ title: string; description: string; icon: React.ReactNode; buttonText: string; onClick: () => void; }> = ({ title, description, icon, buttonText, onClick }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm flex flex-col items-start text-left hover:shadow-lg transition-shadow">
        <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-amber-100 text-amber-600 mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
        <p className="text-stone-500 mt-1 mb-4 flex-grow">{description}</p>
        <button onClick={onClick} className="w-full bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm">
            {buttonText}
        </button>
    </div>
);

const ClientDashboard: React.FC<ClientDashboardProps> = ({ onNavigate }) => {
    // Mock data for a specific client event
    const event = {
        name: 'Matrimonio Sarah & Marco',
        date: '15 Agosto 2024',
        guests: '120',
        confirmed: '118',
        tables: '15'
    };

    const timeline = [
        { status: 'Completato', title: 'Contratto Firmato', description: 'Accordo finalizzato e acconto versato.', icon: <CheckCircleIcon className="w-5 h-5 text-white" />, progress: 100 },
        { status: 'Completato', title: 'Scelta del Menù', description: 'Menù degustazione e scelte dei vini confermate.', icon: <CheckCircleIcon className="w-5 h-5 text-white" />, progress: 100 },
        { status: 'In Corso', title: 'Disposizione Tavoli', description: 'Assegna i posti ai tuoi invitati e definisci i tavoli.', icon: <ClockIcon className="w-5 h-5 text-white" />, progress: 50 },
        { status: 'Da Fare', title: 'Scelte Musicali', description: 'Seleziona i brani per i momenti chiave della cerimonia.', icon: <SparklesIcon className="w-5 h-5 text-white" />, progress: 0 },
    ];

    return (
        <div>
            <div className="text-center mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">Benvenuti, Sarah & Marco!</h1>
                <p className="mt-2 text-lg text-stone-600">
                    Questa è la vostra area personale per la gestione del vostro evento.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <InfoCard title="Data Evento" value={event.date} icon={<CalendarDaysIcon className="w-6 h-6" />} />
                <InfoCard title="Invitati Previsti" value={event.guests} icon={<UsersIcon className="w-6 h-6" />} />
                <InfoCard title="Ospiti Confermati" value={event.confirmed} icon={<CheckCircleIcon className="w-6 h-6" />} />
                <InfoCard title="Numero Tavoli" value={event.tables} icon={<TableCellsIcon className="w-6 h-6" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Actions */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <ActionCard 
                        title="Visualizza Layout"
                        description="Sfoglia le disposizioni disponibili con foto render. Scegli quella che preferisci per il tuo evento."
                        icon={<TableCellsIcon className="w-6 h-6" />}
                        buttonText="Vedi Disposizioni"
                        onClick={() => onNavigate('layouts-view')}
                    />
                    <ActionCard 
                        title="Disposizioni"
                        description="Accedi al designer per creare la mappa dei tavoli e assegnare i posti ai tuoi ospiti."
                        icon={<TableCellsIcon className="w-6 h-6" />}
                        buttonText="Scegli Disposizione"
                        onClick={() => onNavigate('layout-selection')}
                    />
                     <ActionCard 
                        title="Dettagli Evento"
                        description="Rivedi le tue selezioni, dal menù alle decorazioni. Contatta il tuo planner per modifiche."
                        icon={<PencilSquareIcon className="w-6 h-6" />}
                        buttonText="Vedi Riepilogo"
                        onClick={() => alert('Funzionalità di riepilogo in arrivo!')}
                    />
                </div>
                
                {/* Timeline */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                    <h3 className="text-lg font-semibold text-stone-800 mb-4">La tua To-Do List</h3>
                    <div className="space-y-6">
                        {timeline.map((item, index) => {
                            const progressColor = 
                                item.status === 'Completato' ? 'bg-green-500' :
                                item.status === 'In Corso' ? 'bg-amber-500' :
                                'bg-stone-300';
                            
                            return (
                                <div key={index}>
                                    <div className="flex items-start gap-4">
                                        <div className={`w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-full ${
                                            item.status === 'Completato' ? 'bg-green-500' :
                                            item.status === 'In Corso' ? 'bg-amber-500' :
                                            'bg-stone-400'
                                        }`}>
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800">{item.title}</p>
                                            <p className="text-sm text-stone-500">{item.description}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3 pl-[52px]"> {/* 36px icon width + 16px gap = 52px */}
                                        <div className="flex items-center gap-2">
                                            <div className="w-full bg-stone-200/80 rounded-full h-2">
                                                <div className={`${progressColor} h-2 rounded-full transition-all duration-500`} style={{ width: `${item.progress}%` }}></div>
                                            </div>
                                            <span className="text-xs font-semibold text-stone-600 w-9 text-right">{item.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;