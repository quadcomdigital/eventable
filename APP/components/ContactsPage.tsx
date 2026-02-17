import React, { useState, useMemo } from 'react';
import { MOCK_CLIENTS, MOCK_SUPPLIERS } from '../constants';
import type { Client, Supplier } from '../types';
import ClientDetailModal from './ClientDetailModal';
import { UserGroupIcon, MagnifyingGlassIcon, PlusIcon, PhoneIcon, EnvelopeIcon, EyeIcon } from './Icons';

const ContactsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'clients' | 'suppliers'>('clients');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);

    const filteredClients = useMemo(() =>
        MOCK_CLIENTS.filter(client =>
            client.name.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]);

    const filteredSuppliers = useMemo(() =>
        MOCK_SUPPLIERS.filter(supplier =>
            supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.category.toLowerCase().includes(searchTerm.toLowerCase())
        ), [searchTerm]);

    const TabButton: React.FC<{ tab: 'clients' | 'suppliers', children: React.ReactNode }> = ({ tab, children }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${isActive ? 'bg-amber-400 text-white shadow-sm' : 'text-stone-600 hover:bg-stone-100'}`}
            >
                {children}
            </button>
        );
    };

    return (
        <>
            {/* Header */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <UserGroupIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Gestione Contatti</h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    Consulta e gestisci la tua rubrica di clienti e fornitori.
                </p>
            </div>

            {/* Controls */}
            <div className="mb-8 p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-stone-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <TabButton tab="clients">Clienti ({MOCK_CLIENTS.length})</TabButton>
                    <TabButton tab="suppliers">Fornitori ({MOCK_SUPPLIERS.length})</TabButton>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Cerca..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-stone-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <button className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        Aggiungi Contatto
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeTab === 'clients' && filteredClients.map(client => (
                    <div key={client.id} className="bg-white/80 p-5 rounded-xl border border-stone-200/80 shadow-sm flex flex-col">
                        <h3 className="text-lg font-semibold text-stone-800">{client.name}</h3>
                        <div className="mt-2 space-y-2 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                                <EnvelopeIcon className="w-4 h-4 text-stone-400" />
                                <span>{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-stone-400" />
                                <span>{client.phone}</span>
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-stone-200/80 flex justify-end">
                            <button onClick={() => setSelectedClient(client)} className="text-sm font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1">
                                <EyeIcon className="w-4 h-4" />
                                Visualizza Scheda
                            </button>
                        </div>
                    </div>
                ))}

                {activeTab === 'suppliers' && filteredSuppliers.map(supplier => (
                    <div key={supplier.id} className="bg-white/80 p-5 rounded-xl border border-stone-200/80 shadow-sm">
                        <div className="flex justify-between items-start">
                             <h3 className="text-lg font-semibold text-stone-800">{supplier.name}</h3>
                             <span className="text-xs font-semibold px-2 py-1 rounded-full bg-blue-100 text-blue-800">{supplier.category}</span>
                        </div>
                        <p className="text-sm text-stone-500 mt-2">{supplier.serviceDescription}</p>
                         <div className="mt-4 pt-4 border-t border-stone-200/80 space-y-2 text-sm text-stone-600">
                            <div className="flex items-center gap-2">
                                <EnvelopeIcon className="w-4 h-4 text-stone-400" />
                                <span>{supplier.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <PhoneIcon className="w-4 h-4 text-stone-400" />
                                <span>{supplier.phone}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedClient && (
                <ClientDetailModal client={selectedClient} onClose={() => setSelectedClient(null)} />
            )}
        </>
    );
};

export default ContactsPage;
