import React, { useState } from 'react';
import { MOCK_EVENTS } from '../constants';
import type { EventPageSettings } from '../types';

interface EventPageBuilderProps {
    onSave?: (settings: EventPageSettings) => void;
}

const EventPageBuilder: React.FC<EventPageBuilderProps> = ({ onSave }) => {
    const [selectedEventId, setSelectedEventId] = useState(MOCK_EVENTS[0].id);
    const [settings, setSettings] = useState<EventPageSettings>({
        id: 1,
        eventId: selectedEventId,
        headline: '',
        description: '',
        heroImageUrl: '',
        eventDateTime: '',
        location: '',
        dressCode: '',
        menuUrl: '',
        customColors: {
            primary: '#f59e0b',
            secondary: '#d97706',
            accent: '#fbbf24'
        }
    });

    const selectedEvent = MOCK_EVENTS.find(e => e.id === selectedEventId);

    const handleEventChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const eventId = e.target.value;
        setSelectedEventId(eventId);
        const event = MOCK_EVENTS.find(ev => ev.id === eventId);
        if (event) {
            setSettings(prev => ({
                ...prev,
                eventId,
                headline: event.name,
                eventDateTime: event.date,
            }));
        }
    };

    const handleInputChange = (field: keyof Omit<EventPageSettings, 'customColors'>, value: string) => {
        setSettings(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleColorChange = (colorKey: 'primary' | 'secondary' | 'accent', value: string) => {
        setSettings(prev => ({
            ...prev,
            customColors: {
                ...prev.customColors,
                [colorKey]: value
            }
        }));
    };

    const handleSave = () => {
        if (onSave) {
            onSave(settings);
        }
        // Salva in localStorage
        const saved = JSON.parse(localStorage.getItem('event_page_settings') || '{}');
        saved[settings.eventId] = settings;
        localStorage.setItem('event_page_settings', JSON.stringify(saved));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold text-stone-800 mb-2">Crea Pagina Ricevimento</h1>
                <p className="text-stone-600 mb-8">Personalizza la pagina del tuo evento da condividere con gli invitati</p>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left - Editor */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Selection */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <label className="block text-sm font-semibold text-stone-700 mb-3">
                                📅 Seleziona Evento
                            </label>
                            <select
                                value={selectedEventId}
                                onChange={handleEventChange}
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            >
                                {MOCK_EVENTS.map(event => (
                                    <option key={event.id} value={event.id}>
                                        {event.name} - {event.date}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Headline */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <label className="block text-sm font-semibold text-stone-700 mb-3">
                                ✨ Titolo Principale
                            </label>
                            <input
                                type="text"
                                value={settings.headline}
                                onChange={(e) => handleInputChange('headline', e.target.value)}
                                placeholder="Es. Sarah & Marco - Il Grande Giorno"
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <label className="block text-sm font-semibold text-stone-700 mb-3">
                                📝 Descrizione
                            </label>
                            <textarea
                                value={settings.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                placeholder="Racconta la storia del vostro evento..."
                                rows={4}
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Event Details */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                                <label className="block text-sm font-semibold text-stone-700 mb-3">
                                    🕐 Data e Ora
                                </label>
                                <input
                                    type="text"
                                    value={settings.eventDateTime}
                                    onChange={(e) => handleInputChange('eventDateTime', e.target.value)}
                                    placeholder="Lunedì 12 Giugno 2024 - 19:00"
                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>

                            <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                                <label className="block text-sm font-semibold text-stone-700 mb-3">
                                    📍 Luogo
                                </label>
                                <input
                                    type="text"
                                    value={settings.location}
                                    onChange={(e) => handleInputChange('location', e.target.value)}
                                    placeholder="Es. Villa Rossi, Milano"
                                    className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                        </div>

                        {/* Dress Code */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <label className="block text-sm font-semibold text-stone-700 mb-3">
                                👔 Dress Code (opzionale)
                            </label>
                            <input
                                type="text"
                                value={settings.dressCode}
                                onChange={(e) => handleInputChange('dressCode', e.target.value)}
                                placeholder="Es. Abito Elegante"
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Menu URL */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <label className="block text-sm font-semibold text-stone-700 mb-3">
                                🍽️ Link Menu (opzionale)
                            </label>
                            <input
                                type="url"
                                value={settings.menuUrl}
                                onChange={(e) => handleInputChange('menuUrl', e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                            />
                        </div>

                        {/* Colors */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-stone-200">
                            <label className="block text-sm font-semibold text-stone-700 mb-4">
                                🎨 Colori Personalizzati
                            </label>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="flex flex-col items-center">
                                    <label className="text-xs font-semibold text-stone-600 mb-2">Primario</label>
                                    <input
                                        type="color"
                                        value={settings.customColors.primary}
                                        onChange={(e) => handleColorChange('primary', e.target.value)}
                                        className="w-16 h-16 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-xs font-semibold text-stone-600 mb-2">Secondario</label>
                                    <input
                                        type="color"
                                        value={settings.customColors.secondary}
                                        onChange={(e) => handleColorChange('secondary', e.target.value)}
                                        className="w-16 h-16 rounded-lg cursor-pointer"
                                    />
                                </div>
                                <div className="flex flex-col items-center">
                                    <label className="text-xs font-semibold text-stone-600 mb-2">Accento</label>
                                    <input
                                        type="color"
                                        value={settings.customColors.accent}
                                        onChange={(e) => handleColorChange('accent', e.target.value)}
                                        className="w-16 h-16 rounded-lg cursor-pointer"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-white font-semibold py-3 rounded-lg hover:from-amber-500 hover:to-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            💾 Salva Pagina
                        </button>
                    </div>

                    {/* Right - Preview */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8">
                            <h2 className="text-xl font-bold text-stone-800 mb-4">📱 Anteprima</h2>
                            <div 
                                className="rounded-2xl overflow-hidden shadow-2xl border-8"
                                style={{ borderColor: settings.customColors.primary }}
                            >
                                <div className="bg-white p-4 space-y-4 text-center">
                                    {/* Hero */}
                                    <div 
                                        className="h-32 rounded-lg flex items-center justify-center text-white text-sm font-semibold"
                                        style={{ backgroundColor: settings.customColors.primary }}
                                    >
                                        {settings.heroImageUrl ? (
                                            <img src={settings.heroImageUrl} alt="Hero" className="w-full h-full object-cover" />
                                        ) : (
                                            '📸 Immagine Hero'
                                        )}
                                    </div>

                                    {/* Headline */}
                                    <h1 className="text-lg font-bold text-stone-800">
                                        {settings.headline || 'Titolo Evento'}
                                    </h1>

                                    {/* Countdown Badge */}
                                    <div 
                                        className="py-2 px-3 rounded-lg text-white text-xs font-semibold"
                                        style={{ backgroundColor: settings.customColors.secondary }}
                                    >
                                        ⏱️ 15 Giorni
                                    </div>

                                    {/* Details */}
                                    <div className="space-y-2 text-xs text-stone-600">
                                        <p>🕐 {settings.eventDateTime || 'Data'}</p>
                                        <p>📍 {settings.location || 'Luogo'}</p>
                                    </div>

                                    {/* Upload Button */}
                                    <button 
                                        className="w-full py-2 rounded-lg text-white text-xs font-semibold transition-all"
                                        style={{ backgroundColor: settings.customColors.accent }}
                                    >
                                        📸 Carica Foto
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventPageBuilder;
