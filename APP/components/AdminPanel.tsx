import React from 'react';
import type { Page } from '../types';
import { AdjustmentsHorizontalIcon, UsersIcon, QueueListIcon, CreditCardIcon, ChartBarIcon, PencilIcon, TrashIcon } from './Icons';

const AdminCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    children: React.ReactNode;
}> = ({ icon, title, description, children }) => (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm flex flex-col">
        <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600">
                {icon}
            </div>
            <div>
                <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
                <p className="text-sm text-stone-500 mt-1">{description}</p>
            </div>
        </div>
        <div className="mt-6 flex-grow">
            {children}
        </div>
    </div>
);

const UserManagementCard: React.FC = () => {
    const users = [
        { id: 1, name: 'Mario Rossi', role: 'Amministratore', lastLogin: '2 ore fa' },
        { id: 2, name: 'Anna Verdi', role: 'Event Planner', lastLogin: '1 giorno fa' },
        { id: 3, name: 'Luca Bianchi', role: 'Event Planner', lastLogin: '3 giorni fa' },
    ];

    return (
        <AdminCard
            icon={<UsersIcon className="w-6 h-6" />}
            title="Gestione Utenti"
            description="Aggiungi, rimuovi o modifica i permessi degli utenti."
        >
            <div className="space-y-3 mb-4">
                {users.map(user => (
                    <div key={user.id} className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg">
                        <div>
                            <p className="font-medium text-stone-700">{user.name}</p>
                            <p className="text-xs text-stone-500">{user.role} - Ultimo accesso: {user.lastLogin}</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-100 rounded-md"><PencilIcon className="w-4 h-4" /></button>
                            <button className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-100 rounded-md"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-auto bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors text-sm">
                Aggiungi Utente
            </button>
        </AdminCard>
    );
};

const ServiceConfigurationCard: React.FC<{ onNavigate: (page: Page) => void; }> = ({ onNavigate }) => (
    <AdminCard
        icon={<QueueListIcon className="w-6 h-6" />}
        title="Configurazione Servizi"
        description="Aggiungi e gestisci categorie di servizi come Musica, Menù, Fiori, etc."
    >
        <div className="flex-grow flex flex-col justify-center text-center">
            <p className="text-stone-500 mb-4 text-sm">
                Definisci tutte le opzioni personalizzabili che i tuoi clienti potranno scegliere durante la pianificazione del loro evento.
            </p>
        </div>
        <button 
            onClick={() => onNavigate('configurations')}
            className="w-full mt-auto bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors text-sm"
        >
            Gestisci Servizi
        </button>
    </AdminCard>
);


const BillingSettingsCard: React.FC = () => (
    <AdminCard
        icon={<CreditCardIcon className="w-6 h-6" />}
        title="Impostazioni di Fatturazione"
        description="Configura i dati aziendali e i metodi di pagamento."
    >
        <div className="space-y-4 mb-4">
            <div>
                <label className="text-sm font-medium text-stone-600">Partita IVA</label>
                <input type="text" defaultValue="IT1234567890" className="w-full mt-1 px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg">
                <span className="font-medium text-stone-700">Abilita Pagamenti Online</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                    <input type="checkbox" name="toggle" id="toggle" defaultChecked className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                    <label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-stone-300 cursor-pointer"></label>
                </div>
                <style>{`.toggle-checkbox:checked { right: 0; border-color: #f59e0b; } .toggle-checkbox:checked + .toggle-label { background-color: #f59e0b; }`}</style>
            </div>
        </div>
        <button className="w-full mt-auto bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors text-sm">
            Configura Metodi di Pagamento
        </button>
    </AdminCard>
);

const AnalyticsCard: React.FC = () => (
    <AdminCard
        icon={<ChartBarIcon className="w-6 h-6" />}
        title="Report e Analisi"
        description="Visualizza le performance e i dati chiave della piattaforma."
    >
        <div className="grid grid-cols-2 gap-4 text-center mb-4">
            <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-sm text-stone-500">Eventi questo mese</p>
            </div>
            <div>
                <p className="text-2xl font-bold text-green-600">€25,4K</p>
                <p className="text-sm text-stone-500">Fatturato Mese</p>
            </div>
        </div>
        <button className="w-full mt-auto bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors text-sm">
            Visualizza Report Completi
        </button>
    </AdminCard>
);

interface AdminPanelProps {
    onNavigate: (page: Page) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onNavigate }) => {
    return (
        <div>
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <AdjustmentsHorizontalIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Pannello di Amministrazione</h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    Gestisci le impostazioni, gli utenti e monitora le performance della piattaforma.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UserManagementCard />
                <ServiceConfigurationCard onNavigate={onNavigate} />
                <BillingSettingsCard />
                <AnalyticsCard />
            </div>
        </div>
    );
};

export default AdminPanel;