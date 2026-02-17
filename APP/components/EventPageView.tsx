import React, { useState, useEffect } from 'react';
import type { EventPageSettings, EventPagePhoto } from '../types';

interface EventPageViewProps {
    eventPageId?: string;
}

const EventPageView: React.FC<EventPageViewProps> = ({ eventPageId = 'SM2024' }) => {
    const [settings, setSettings] = useState<EventPageSettings | null>(null);
    const [photos, setPhotos] = useState<EventPagePhoto[]>([]);
    const [uploaderName, setUploaderName] = useState('');
    const [uploaderEmail, setUploaderEmail] = useState('');
    const [countdown, setCountdown] = useState<string>('');
    const [uploadedCount, setUploadedCount] = useState(0);

    useEffect(() => {
        // Carica le impostazioni della pagina
        const saved = JSON.parse(localStorage.getItem('event_page_settings') || '{}');
        if (saved[eventPageId]) {
            setSettings(saved[eventPageId]);
        } else {
            // Fallback con dati demo
            setSettings({
                id: 1,
                eventId: eventPageId,
                headline: 'Sarah & Marco - Il Grande Giorno',
                description: 'Vi invitiamo a celebrare il nostro matrimonio con noi!',
                eventDateTime: 'Sabato 12 Giugno 2024 - 19:00',
                location: 'Villa Rossi, Milano',
                dressCode: 'Abito Elegante',
                customColors: {
                    primary: '#f59e0b',
                    secondary: '#d97706',
                    accent: '#fbbf24'
                }
            });
        }

        // Carica foto
        const savedPhotos = JSON.parse(localStorage.getItem(`event_photos_${eventPageId}`) || '[]');
        setPhotos(savedPhotos);
        setUploadedCount(savedPhotos.length);
    }, [eventPageId]);

    useEffect(() => {
        // Countdown timer
        if (!settings) return;

        const interval = setInterval(() => {
            const eventDate = new Date('2024-06-12T19:00:00').getTime();
            const now = new Date().getTime();
            const distance = eventDate - now;

            if (distance <= 0) {
                setCountdown('🎉 L\'evento è iniziato!');
            } else {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                setCountdown(`${days}g ${hours}h ${minutes}m`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [settings]);

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !uploaderName || !uploaderEmail) {
            alert('Per favore inserisci nome ed email');
            return;
        }

        Array.from(files).forEach((file: File) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target?.result) {
                    const newPhoto: EventPagePhoto = {
                        id: Date.now() + Math.random(),
                        eventPageId: 1,
                        uploaderName,
                        uploaderEmail,
                        photoUrl: event.target.result as string,
                        uploadedAt: new Date().toISOString(),
                        caption: ''
                    };

                    const updatedPhotos = [...photos, newPhoto];
                    setPhotos(updatedPhotos);
                    setUploadedCount(updatedPhotos.length);

                    // Salva in localStorage
                    localStorage.setItem(`event_photos_${eventPageId}`, JSON.stringify(updatedPhotos));
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset input
        e.target.value = '';
    };

    if (!settings) {
        return <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 flex items-center justify-center">
            <p className="text-stone-600">Caricamento...</p>
        </div>;
    }

    return (
        <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${settings.customColors.primary}20, ${settings.customColors.secondary}20)` }}>
            {/* Hero Section */}
            <div 
                className="relative h-96 flex items-center justify-center text-white overflow-hidden"
                style={{ backgroundColor: settings.customColors.primary }}
            >
                {/* Animated background */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/10 rounded-full animate-pulse"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center space-y-4">
                    <h1 className="text-5xl font-bold drop-shadow-lg">{settings.headline}</h1>
                    <div 
                        className="inline-block px-6 py-3 rounded-full text-lg font-bold drop-shadow-lg"
                        style={{ backgroundColor: settings.customColors.secondary }}
                    >
                        ⏱️ {countdown}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-12">
                {/* Event Details */}
                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {/* Left - Info */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderColor: settings.customColors.primary }}>
                        <h2 className="text-2xl font-bold text-stone-800 mb-6">📍 Dettagli Evento</h2>
                        
                        {settings.description && (
                            <p className="text-stone-600 mb-6 leading-relaxed">{settings.description}</p>
                        )}

                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-semibold text-stone-500 uppercase">🕐 Data e Ora</p>
                                <p className="text-lg text-stone-800 font-semibold">{settings.eventDateTime}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-stone-500 uppercase">📍 Luogo</p>
                                <p className="text-lg text-stone-800 font-semibold">{settings.location}</p>
                            </div>
                            {settings.dressCode && (
                                <div>
                                    <p className="text-xs font-semibold text-stone-500 uppercase">👔 Dress Code</p>
                                    <p className="text-lg text-stone-800 font-semibold">{settings.dressCode}</p>
                                </div>
                            )}
                            {settings.menuUrl && (
                                <a 
                                    href={settings.menuUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="inline-block mt-4 px-4 py-2 rounded-lg text-white font-semibold transition-all hover:shadow-lg"
                                    style={{ backgroundColor: settings.customColors.accent }}
                                >
                                    🍽️ Visualizza Menu
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right - Upload */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4" style={{ borderColor: settings.customColors.secondary }}>
                        <h2 className="text-2xl font-bold text-stone-800 mb-6">📸 Condividi le Tue Foto</h2>
                        
                        {/* Upload Stats */}
                        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: `${settings.customColors.accent}20` }}>
                            <p className="text-center">
                                <span className="text-3xl font-bold" style={{ color: settings.customColors.accent }}>
                                    {uploadedCount}
                                </span>
                                <span className="text-stone-600 ml-2">foto caricate</span>
                            </p>
                        </div>

                        {/* Form */}
                        <div className="space-y-4">
                            <input
                                type="text"
                                placeholder="Il tuo nome"
                                value={uploaderName}
                                onChange={(e) => setUploaderName(e.target.value)}
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ '--tw-ring-color': settings.customColors.primary } as any}
                            />
                            <input
                                type="email"
                                placeholder="La tua email"
                                value={uploaderEmail}
                                onChange={(e) => setUploaderEmail(e.target.value)}
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style={{ '--tw-ring-color': settings.customColors.primary } as any}
                            />

                            {/* File Input */}
                            <label 
                                className="block w-full py-4 px-4 rounded-lg border-2 border-dashed text-center cursor-pointer transition-all hover:bg-stone-50"
                                style={{ 
                                    borderColor: settings.customColors.primary,
                                    color: settings.customColors.primary
                                }}
                            >
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <div className="space-y-2">
                                    <p className="text-2xl">📷</p>
                                    <p className="font-semibold">Carica le tue foto</p>
                                    <p className="text-xs opacity-75">Seleziona una o più immagini</p>
                                </div>
                            </label>

                            <p className="text-xs text-stone-500 text-center">
                                Le foto saranno archiviate e inviate per email dopo l'evento
                            </p>
                        </div>
                    </div>
                </div>

                {/* Photos Gallery */}
                {photos.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-stone-800 mb-6">🎞️ Galleria Foto</h2>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {photos.map((photo) => (
                                <div key={photo.id} className="group relative overflow-hidden rounded-lg shadow-lg">
                                    <img 
                                        src={photo.photoUrl} 
                                        alt="Event" 
                                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-end">
                                        <div className="w-full p-3 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            <p className="font-semibold">{photo.uploaderName}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {photos.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-2xl mb-3">📷</p>
                        <p className="text-stone-600 mb-2">Nessuna foto ancora</p>
                        <p className="text-sm text-stone-500">Sii il primo a caricare una foto!</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="bg-white/50 border-t border-stone-200 mt-12 py-6 text-center text-stone-600">
                <p className="text-sm">Powered by EventMaster Pro</p>
            </footer>
        </div>
    );
};

export default EventPageView;
