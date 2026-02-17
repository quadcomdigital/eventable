import React, { useState } from 'react';
import { ExclamationTriangleIcon } from './Icons';
// FIX: Correctly import UserRole from types.ts instead of App.tsx
import type { UserRole } from '../types';

interface LoginPageProps {
    onLogin: (role: UserRole, eventId?: string) => void;
}

// Stili CSS per animazione
const animationStyle = `
    @keyframes gradient-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
    }
    .animated-bg {
        animation: gradient-shift 15s ease infinite;
    }
`;

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [activeTab, setActiveTab] = useState<'admin' | 'client'>('admin');
    
    // Client state
    const [eventId, setEventId] = useState('');

    const [error, setError] = useState<string | null>(null);

    const handleClientLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        // Mock validation
        if (eventId.toUpperCase() === 'SM2024') {
            onLogin('client', eventId);
        } else {
            setError('Numero univoco evento non corretto.');
        }
    };

    const TabButton: React.FC<{tab: 'admin' | 'client', children: React.ReactNode}> = ({ tab, children }) => {
        const isActive = activeTab === tab;
        return (
            <button
                onClick={() => { setActiveTab(tab); setError(null); }}
                className={`w-1/2 py-3 text-center font-semibold border-b-2 transition-colors ${
                    isActive
                        ? 'border-amber-500 text-amber-600'
                        : 'border-transparent text-stone-500 hover:text-stone-700'
                }`}
            >
                {children}
            </button>
        )
    };

    return (
        <div className="min-h-screen bg-white flex overflow-hidden">
            <style>{animationStyle}</style>
            {/* Left Side - Image */}
            <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-amber-900 via-amber-800 to-orange-900 relative overflow-hidden flex-col justify-center items-center p-12 animated-bg" style={{
                backgroundSize: '200% 200%',
            }}>
                {/* Background image with overlay */}
                <div 
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: 'url("https://images.unsplash.com/photo-1519671482677-504be0ffa348?w=1000&h=1000&fit=crop")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-amber-800/80 to-orange-900/80"></div>
                
                {/* Content - Centered */}
                <div className="relative z-10 text-white text-center space-y-6 max-w-lg">
                    <h1 className="text-5xl font-bold leading-tight drop-shadow-lg">
                        Trasforma i tuoi eventi in esperienze indimenticabili
                    </h1>
                    <p className="text-lg text-amber-50 drop-shadow-md leading-relaxed">
                        Pianifica, gestisci e organizza con eleganza ogni dettaglio del tuo evento speciale.
                    </p>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 bg-gradient-to-br from-stone-50 via-white to-amber-50 flex flex-col justify-center items-center p-4 relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100/20 to-orange-100/20 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-100/20 to-yellow-100/20 rounded-full blur-3xl -z-10"></div>
                
                <div className="w-full max-w-md">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <img src="/loghi_vm.png" alt="EventMaster Pro Logo" className="h-12 object-contain drop-shadow-lg" />
                    </div>

                    {/* Login Card */}
                    <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-stone-200/60 overflow-hidden">
                        <div className="flex">
                            <TabButton tab="admin">👨‍💼 Accesso Admin</TabButton>
                            <TabButton tab="client">👤 Accesso Cliente</TabButton>
                        </div>

                        <div className="p-8 space-y-6">
                            {activeTab === 'admin' ? (
                                <div className="space-y-6 text-center">
                                    <p className="text-stone-600 leading-relaxed">
                                        Accedi al pannello di controllo per gestire tutti gli eventi e le configurazioni della piattaforma.
                                    </p>
                                    <button 
                                        onClick={() => onLogin('admin')}
                                        className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md"
                                    >
                                        Entra come Amministratore
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                <form onSubmit={handleClientLogin} className="space-y-6">
                                    <div>
                                        <label htmlFor="eventId" className="block text-sm font-semibold text-stone-700 mb-2">📌 Numero Univoco Evento</label>
                                        <input
                                            id="eventId"
                                            type="text"
                                            placeholder="Es. SM2024"
                                            value={eventId}
                                            onChange={(e) => setEventId(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-stone-50 transition-all"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md">
                                        Entra
                                    </button>
                                </form>

                                <div className="pt-4 border-t border-stone-200">
                                    <p className="text-xs text-stone-500 text-center mb-3 font-medium">O accedi direttamente senza codice:</p>
                                    <button onClick={() => onLogin('client')} className="w-full bg-gradient-to-r from-stone-200 to-stone-300 text-stone-800 font-semibold py-2.5 rounded-lg hover:from-stone-300 hover:to-stone-400 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">Accesso Cliente (salta codice)</button>
                                </div>
                                </div>
                            )}

                            {error && (
                                <div className="mt-4 flex items-center gap-3 bg-red-50/80 text-red-700 p-3.5 rounded-lg border border-red-300/50 backdrop-blur-sm animate-pulse">
                                    <ExclamationTriangleIcon className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;