import React, { useState, useMemo, useRef } from 'react';
import { MOCK_CALENDAR_EVENTS } from '../constants';
import type { CalendarEvent } from '../types';
import { ChevronLeftIcon, ChevronRightIcon, CalendarDaysIcon, PlusIcon, TrashIcon, XMarkIcon } from './Icons';

// FullCalendar imports
import FullCalendar, { DateSelectArg, EventApi, EventInput, EventChangeArg } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
// FullCalendar styles are loaded from CDN in `index.html` to avoid bundler CSS resolution issues.

// Helper functions for date manipulation
const getMonthGrid = (year: number, month: number) => {
    const grid: (Date | null)[] = [];
    const date = new Date(year, month, 1);
    
    // Adjust for week starting on Monday (0=Sun, 1=Mon, ..., 6=Sat)
    const firstDayOfWeek = date.getDay();
    const startOffset = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    // Days from previous month
    const prevMonthLastDate = new Date(year, month, 0);
    const prevMonthDays = prevMonthLastDate.getDate();
    for (let i = startOffset; i > 0; i--) {
        grid.push(new Date(year, month - 1, prevMonthDays - i + 1));
    }

    // Days from current month
    while (date.getMonth() === month) {
        grid.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    
    // Days from next month
    const nextMonthDate = new Date(year, month + 1, 1);
    while (grid.length < 42) { // Ensure 6 rows
        grid.push(new Date(nextMonthDate));
        nextMonthDate.setDate(nextMonthDate.getDate() + 1);
    }

    return grid;
};

const isSameDay = (d1: Date, d2: Date) => 
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

const eventColors: { [key in CalendarEvent['type']]: string } = {
    event: 'bg-amber-500 border-amber-600',
    appointment: 'bg-blue-500 border-blue-600',
    deadline: 'bg-red-500 border-red-600',
    task: 'bg-purple-500 border-purple-600',
};

const AddTaskModal: React.FC<{
    onClose: () => void;
    onSave: (title: string, date: string) => void;
}> = ({ onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // default to today

    React.useEffect(() => {
        // If a date was selected from FullCalendar, it will be stored on window.__fcSelectedDate
        const prefill = (window as any).__fcSelectedDate as string | undefined;
        if (prefill) {
            setDate(prefill);
            // clear it after reading
            delete (window as any).__fcSelectedDate;
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && date) {
            onSave(title, date);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b border-stone-200/80">
                    <h2 className="text-lg font-semibold text-stone-800">Aggiungi Nuova Attività</h2>
                    <button onClick={onClose} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="taskTitle" className="block text-sm font-medium text-stone-700 mb-1">Titolo Attività</label>
                            <input
                                id="taskTitle"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="Es. Comprare fiori"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="taskDate" className="block text-sm font-medium text-stone-700 mb-1">Data</label>
                            <input
                                id="taskDate"
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                                required
                            />
                        </div>
                    </div>
                    <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-200/80 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="bg-white text-stone-700 font-semibold px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors">Annulla</button>
                        <button type="submit" className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">Salva Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const PlannerPage: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date(2024, 7, 1)); // Default to August 2024 to show mock data
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(MOCK_CALENDAR_EVENTS);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'calendar' | 'timeline' | 'room'>('calendar');
    const [selectedLocation, setSelectedLocation] = useState<string>('all');
    const [selectedRoom, setSelectedRoom] = useState<string>('all');
    const calendarRef = useRef<FullCalendar | null>(null);

    // Helper to convert internal CalendarEvent[] to FullCalendar EventInput[]
    const toFcEvents = (events: CalendarEvent[]): EventInput[] =>
        events.map(e => ({ id: String(e.id), title: e.title, start: e.start.toISOString(), end: e.end ? e.end.toISOString() : undefined, extendedProps: { type: e.type, completed: e.completed } }));

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthGrid = getMonthGrid(year, month);
    const weekDays = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

    const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const eventsForMonth = useMemo(() => calendarEvents.filter(e => 
        (e.start.getMonth() === month && e.start.getFullYear() === year) ||
        (e.end.getMonth() === month && e.end.getFullYear() === year)
    ).sort((a,b) => a.start.getTime() - b.start.getTime()), [month, year, calendarEvents]);

    const groupedEvents: Record<string, CalendarEvent[]> = useMemo(() => {
        // Explicitly type the accumulator for correct inference
        return eventsForMonth.reduce<Record<string, CalendarEvent[]>>((acc, event) => {
            const dateKey = event.start.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' });
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }
            acc[dateKey].push(event);
            return acc;
        }, {});
    }, [eventsForMonth]);

    const handleAddTask = (title: string, dateStr: string) => {
        const date = new Date(dateStr);
        // Adjust for timezone offset
        const userTimezoneOffset = date.getTimezoneOffset() * 60000;
        const adjustedDate = new Date(date.getTime() + userTimezoneOffset);

        const newTask: CalendarEvent = {
            id: Date.now(),
            title,
            start: adjustedDate,
            end: adjustedDate,
            type: 'task',
            completed: false,
        };
        setCalendarEvents(prev => [...prev, newTask].sort((a,b) => a.start.getTime() - b.start.getTime()));
        setIsTaskModalOpen(false);
    };

    // FullCalendar handlers
    const handleDateSelect = (selectInfo: DateSelectArg) => {
        // When a user selects a range/day in the calendar, open the modal with that date
        const startStr = selectInfo.startStr.split('T')[0];
        setIsTaskModalOpen(true);
        // store selected date so modal can read it (modal will check window.__fcSelectedDate)
        (window as any).__fcSelectedDate = startStr;
    };

    const handleEventAddFromCalendar = (ev: EventApi) => {
        // Not used directly (we update via selection modal). Kept for completeness.
    };

    const handleEventChange = (changeInfo: EventChangeArg) => {
        // Fired for drag/drop or resize actions — update internal state
        const ev = changeInfo.event;
        const id = Number(ev.id);
        const newStart = new Date(ev.start!);
        const newEnd = ev.end ? new Date(ev.end) : newStart;
        setCalendarEvents(prev => prev.map(e => e.id === id ? { ...e, start: newStart, end: newEnd } : e));
    };

    const handleEventClick = (clickInfo: any) => {
        // Simple confirmation delete for now
        if (confirm(`Eliminare l'evento "${clickInfo.event.title}"?`)) {
            const id = Number(clickInfo.event.id);
            setCalendarEvents(prev => prev.filter(e => e.id !== id));
            clickInfo.event.remove();
        }
    };

    const handleToggleComplete = (taskId: number) => {
        setCalendarEvents(prev =>
            prev.map(event =>
                event.id === taskId ? { ...event, completed: !event.completed } : event
            )
        );
    };

    const handleDeleteTask = (taskId: number) => {
        if (window.confirm('Sei sicuro di voler eliminare questa attività?')) {
            setCalendarEvents(prev => prev.filter(event => event.id !== taskId));
        }
    };

    // Multi-location and room data
    const locations = [
        { id: 'all', name: '📍 Tutte le Sedi' },
        { id: 'milano', name: '🏢 Milano - Via Montenapoleone' },
        { id: 'roma', name: '🏛️ Roma - Centro Storico' },
        { id: 'venezia', name: '🌊 Venezia - San Marco' },
    ];

    const rooms: Record<string, { id: string; name: string }[]> = {
        all: [
            { id: 'all', name: '🎪 Tutte le Sale' },
        ],
        milano: [
            { id: 'sala1', name: '💎 Sala Principale' },
            { id: 'sala2', name: '✨ Sala del Giardino' },
            { id: 'sala3', name: '🎭 Sala Lounge' },
        ],
        roma: [
            { id: 'sala1', name: '👑 Sala Imperiale' },
            { id: 'sala2', name: '🎨 Sala Rinascimento' },
        ],
        venezia: [
            { id: 'sala1', name: '🚤 Sala con Terrazza' },
            { id: 'sala2', name: '🎪 Sala Balconata' },
        ],
    };

    const currentRooms = selectedLocation === 'all' ? rooms.all : rooms[selectedLocation] || rooms.all;

    return (
        <div>
            {/* Header with View Controls */}
            <div className="mb-8">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <h1 className="text-3xl font-bold text-stone-800">📅 Planner Centrale</h1>
                    <button onClick={() => setIsTaskModalOpen(true)} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-lg flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" />
                        Aggiungi Evento
                    </button>
                </div>

                {/* View Mode Selector */}
                <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-stone-200/80 shadow-sm mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* View Mode */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Modalità Vista</label>
                            <div className="flex gap-2">
                                <button onClick={() => setViewMode('calendar')} className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${viewMode === 'calendar' ? 'bg-amber-500 text-white shadow-md' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
                                    📆 Calendario
                                </button>
                                <button onClick={() => setViewMode('timeline')} className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${viewMode === 'timeline' ? 'bg-amber-500 text-white shadow-md' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
                                    📊 Timeline
                                </button>
                                <button onClick={() => setViewMode('room')} className={`px-3 py-1 rounded-lg font-medium text-sm transition-all ${viewMode === 'room' ? 'bg-amber-500 text-white shadow-md' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}>
                                    🎪 Sale
                                </button>
                            </div>
                        </div>

                        {/* Location Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Sede</label>
                            <select value={selectedLocation} onChange={(e) => { setSelectedLocation(e.target.value); setSelectedRoom('all'); }} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm">
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Room Selector */}
                        <div>
                            <label className="block text-sm font-semibold text-stone-700 mb-2">Sala</label>
                            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-sm">
                                {currentRooms.map(room => (
                                    <option key={room.id} value={room.id}>{room.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar View */}
            {viewMode === 'calendar' && (
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => { const cal = calendarRef.current; if (cal) { (cal as any).getApi().prev(); } }} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                            <ChevronLeftIcon className="w-6 h-6 text-stone-600" />
                        </button>
                        <button onClick={() => { const cal = calendarRef.current; if (cal) { (cal as any).getApi().next(); } }} className="p-2 rounded-full hover:bg-stone-100 transition-colors">
                            <ChevronRightIcon className="w-6 h-6 text-stone-600" />
                        </button>
                        <h2 className="text-xl font-semibold text-stone-800 capitalize">
                            {currentDate.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' })}
                        </h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={() => { const cal = calendarRef.current; if (cal) { (cal as any).getApi().today(); } }} className="p-2 rounded-lg bg-stone-100">Oggi</button>
                        <button onClick={() => setIsTaskModalOpen(true)} className="bg-amber-400 text-white font-semibold px-3 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2 text-sm">
                            <PlusIcon className="w-4 h-4" />Aggiungi
                        </button>
                    </div>
                </div>

                <FullCalendar
                    ref={calendarRef}
                    plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                    initialView="dayGridMonth"
                    headerToolbar={false}
                    selectable={true}
                    editable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    events={toFcEvents(calendarEvents)}
                    select={handleDateSelect}
                    eventChange={handleEventChange}
                    eventClick={handleEventClick}
                    height={600}
                />
            </div>
            )}

            {/* Room View */}
            {viewMode === 'room' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {currentRooms.filter(r => r.id !== 'all').map(room => (
                    <div key={room.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        <h2 className="text-xl font-semibold text-stone-800 mb-4">{room.name}</h2>
                        <div className="space-y-3">
                            {calendarEvents.slice(0, 3).map(event => (
                                <div key={event.id} className={`p-3 rounded-lg text-white text-sm font-medium ${eventColors[event.type]}`}>
                                    {event.title} - {event.start.toLocaleDateString('it-IT')}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            )}

            {/* Timeline View */}
            {viewMode === 'timeline' && (
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                     <h2 className="text-2xl font-semibold text-stone-800">Impegni del Mese</h2>
                     <button onClick={() => setIsTaskModalOpen(true)} className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors shadow-sm flex items-center gap-2 text-sm">
                        <PlusIcon className="w-5 h-5" />
                        Aggiungi Task
                    </button>
                </div>
                 <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                     {Object.keys(groupedEvents).length > 0 ? (
                         <div className="space-y-6">
                             {Object.entries(groupedEvents).map(([date, events]) => (
                                 <div key={date}>
                                     <h3 className="font-semibold text-stone-600 border-b border-stone-200 pb-2 mb-3 capitalize">{date}</h3>
                                     <ul className="space-y-3">
                                         {events.map(event => (
                                            <li key={event.id} className="flex items-center gap-4 p-3 bg-stone-50/70 rounded-lg">
                                                {event.type === 'task' ? (
                                                    <input
                                                        type="checkbox"
                                                        checked={event.completed}
                                                        onChange={() => handleToggleComplete(event.id)}
                                                        className="h-5 w-5 rounded border-stone-300 text-amber-500 focus:ring-amber-500 cursor-pointer flex-shrink-0"
                                                    />
                                                ) : (
                                                    <span className={`w-3 h-3 rounded-full flex-shrink-0 ${eventColors[event.type].split(' ')[0]}`}></span>
                                                )}
                                                <div className="flex-grow">
                                                    <p className={`font-medium text-stone-800 ${event.completed ? 'line-through text-stone-400' : ''}`}>{event.title}</p>
                                                </div>
                                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${eventColors[event.type].split(' ')[0].replace('bg','text').replace('-500', '-800')} ${eventColors[event.type].split(' ')[0].replace('bg', 'bg').replace('-500', '-100')}`}>
                                                   {event.type === 'event' ? 'Evento' : event.type === 'appointment' ? 'Appuntamento' : event.type === 'deadline' ? 'Scadenza' : 'Task'}
                                                </span>
                                                {event.type === 'task' && (
                                                    <button onClick={() => handleDeleteTask(event.id)} className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-100 rounded-md">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </li>
                                         ))}
                                     </ul>
                                 </div>
                             ))}
                         </div>
                     ) : (
                         <p className="text-center text-stone-500 py-8">Nessun impegno pianificato per questo mese.</p>
                     )}
                 </div>
            </div>
            )}

            {isTaskModalOpen && <AddTaskModal onClose={() => setIsTaskModalOpen(false)} onSave={handleAddTask} />}
        </div>
    );
};

export default PlannerPage;
