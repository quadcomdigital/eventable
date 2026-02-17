import React, { useState } from 'react';
import { UsersIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from './Icons';
import { jsPDF } from 'jspdf';
import { MOCK_EVENTS } from '../constants';

const GuestManagement: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredEvents = MOCK_EVENTS.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadPDF = (event: typeof MOCK_EVENTS[0]) => {
        // Calcola ospiti confermati
        const confirmedGuests = event.guests.filter(g => g.status === 'Confermato').length;
        
        const doc = new jsPDF();
        
        // Titolo
        doc.setFontSize(16);
        doc.text('Lista Invitati', 20, 20);
        
        // Info evento
        doc.setFontSize(11);
        doc.text(`Evento: ${event.name}`, 20, 30);
        doc.text(`Data: ${event.date}`, 20, 37);
        doc.text(`Tipo: ${event.type}`, 20, 44);
        doc.text(`Totale Ospiti: ${event.guestCount} (Confermati: ${confirmedGuests})`, 20, 51);
        
        // Tabella ospiti
        doc.setFontSize(10);
        let yPosition = 62;
        
        // Header tabella
        doc.setTextColor(200, 100, 0); // Amber
        doc.text('Nome', 20, yPosition);
        doc.text('Status', 90, yPosition);
        doc.text('Note', 140, yPosition);
        
        doc.setDrawColor(200, 100, 0);
        doc.line(20, yPosition + 2, 190, yPosition + 2);
        
        doc.setTextColor(0, 0, 0);
        yPosition += 10;
        
        // Contenuto tabella
        event.guests.forEach((guest) => {
            if (yPosition > 270) {
                doc.addPage();
                yPosition = 20;
            }
            
            const statusColor: [number, number, number] = 
                guest.status === 'Confermato' ? [34, 197, 94] : 
                guest.status === 'In attesa' ? [251, 146, 60] : 
                [239, 68, 68]; // green, orange, red
            
            doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
            doc.text(guest.name, 20, yPosition);
            doc.text(guest.status, 90, yPosition);
            
            // Note (se presenti)
            doc.setTextColor(120, 113, 108); // stone
            const noteText = guest.notes || '-';
            doc.text(noteText.substring(0, 30), 140, yPosition);
            
            doc.setTextColor(0, 0, 0);
            yPosition += 8;
        });
        
        // Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Generato il: ${new Date().toLocaleDateString('it-IT')} ${new Date().toLocaleTimeString('it-IT')}`, 20, doc.internal.pages.length > 1 ? 285 : yPosition + 10);
        
        doc.save(`Lista-Invitati-${event.name.replace(/\s+/g, '_')}.pdf`);
    };

    return (
        <div>
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <UsersIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Gestione Ospiti</h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    Visualizza e scarica le liste degli invitati per ogni evento.
                </p>
            </div>

            <div className="mb-8 max-w-lg mx-auto">
                <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-400" />
                    <input
                        type="text"
                        placeholder="Cerca un evento o un cliente..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white border border-stone-300 rounded-full pl-12 pr-4 py-3 text-md focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm flex flex-col transition hover:shadow-lg hover:-translate-y-1">
                        <div className="flex-grow">
                             <p className="text-sm text-stone-500">{event.date}</p>
                            <h3 className="text-xl font-semibold text-stone-800 mt-1">{event.name}</h3>
                                <div className="flex justify-around">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Totale</p>
                                        <p className="text-3xl font-bold text-amber-600">{event.guestCount}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600">Confermati</p>
                                        <p className="text-3xl font-bold text-green-600">{event.guests.filter(g => g.status === 'Confermato').length}</p>
                                    </div>
                                </div>
                        </div>
                        <button 
                            onClick={() => downloadPDF(event)}
                            className="w-full mt-6 bg-amber-400 text-amber-900 font-semibold px-4 py-2.5 rounded-lg hover:bg-amber-500 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 flex items-center justify-center gap-2">
                            <ArrowDownTrayIcon className="w-5 h-5" />
                            Scarica Lista Invitati
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GuestManagement;