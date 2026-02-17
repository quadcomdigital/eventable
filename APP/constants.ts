// constants.ts
import type { Event, SavedLayout, Client, Supplier, CalendarEvent } from './types';

export const MOCK_EVENTS: Event[] = [
  {
    id: 'sm2024',
    name: 'Matrimonio Sarah & Marco',
    date: '15 Ago 2024',
    status: 'Completato',
    type: 'Matrimonio',
    guestCount: 120,
    budget: 25000,
    guests: [
        { id: 1, name: 'Mario Rossi', status: 'Confermato', notes: 'Celiaco' },
        { id: 2, name: 'Anna Verdi', status: 'Confermato', notes: '' },
        { id: 3, name: 'Luca Bianchi', status: 'In attesa', notes: '' },
        { id: 4, name: 'Giulia Neri', status: 'Rifiutato', notes: '' },
    ],
    payments: [
        { id: 1, amount: 5000, description: 'Acconto', date: '01/03/2024' },
        { id: 2, amount: 20000, description: 'Saldo', date: '10/08/2024' },
    ],
    generalNotes: 'Gli sposi desiderano un allestimento floreale con rose bianche e peonie.',
  },
  {
    id: 'fr2024',
    name: 'Anniversario Famiglia Rossi',
    date: '22 Ago 2024',
    status: 'In Corso',
    type: 'Anniversario',
    guestCount: 80,
    budget: 12000,
    guests: Array.from({ length: 80 }, (_, i) => ({ id: i + 1, name: `Ospite ${i + 1}`, status: 'Confermato', notes: '' })),
    payments: [
        { id: 1, amount: 3000, description: 'Acconto', date: '15/05/2024' },
    ],
    generalNotes: '',
  },
  {
    id: 'el2024',
    name: 'Matrimonio Elena & Luca',
    date: '30 Ago 2024',
    status: 'Pianificazione',
    type: 'Matrimonio',
    guestCount: 150,
    budget: 30000,
    guests: Array.from({ length: 145 }, (_, i) => ({ id: i + 1, name: `Ospite ${i + 1}`, status: 'Confermato', notes: '' })),
    payments: [
        { id: 1, amount: 6000, description: 'Acconto', date: '01/06/2024' },
    ],
    generalNotes: 'Focus sulla musica jazz dal vivo.',
  },
];

export const MOCK_CLIENT_LAYOUTS: SavedLayout[] = [
    {
        id: 1,
        name: 'Proposta "Intima"',
        tables: Array.from({ length: 12 }, (_, i) => ({
            id: i,
            name: `Tavolo ${i + 1}`,
            type: 'Ospiti Misti',
            capacity: 10,
            x: Math.random() * 0.8 + 0.1,
            y: Math.random() * 0.8 + 0.1,
            guests: [],
        })),
        floorPlanData: {
            image: 'https://i.postimg.cc/k4z0fQJv/floorplan-1.jpg',
            aspectRatio: 16 / 9,
        },
    },
    {
        id: 2,
        name: 'Proposta "Grande Festa"',
        tables: Array.from({ length: 15 }, (_, i) => ({
            id: i,
            name: `Tavolo ${i + 1}`,
            type: 'Ospiti Misti',
            capacity: 10,
            x: Math.random() * 0.8 + 0.1,
            y: Math.random() * 0.8 + 0.1,
            guests: [],
        })),
        floorPlanData: {
            image: 'https://i.postimg.cc/NMMqQc6Y/floorplan-2.jpg',
            aspectRatio: 16 / 9,
        },
    },
    {
        id: 3,
        name: 'Proposta "Elegante"',
        tables: Array.from({ length: 14 }, (_, i) => ({
            id: i,
            name: `Tavolo ${i + 1}`,
            type: 'Ospiti Misti',
            capacity: 8,
            x: Math.random() * 0.8 + 0.1,
            y: Math.random() * 0.8 + 0.1,
            guests: [],
        })),
        floorPlanData: {
            image: 'https://i.postimg.cc/T3gG1PzB/floorplan-3.jpg',
            aspectRatio: 4 / 3,
        },
    },
];

export const MOCK_CLIENTS: Client[] = [
    {
        id: 1,
        name: 'Sarah & Marco',
        email: 'sarah.marco@email.com',
        phone: '333 1234567',
        events: [{ id: 'sm2024', name: 'Matrimonio Sarah & Marco', date: '15 Ago 2024', status: 'Completato' }],
        quotes: [{ id: 1, name: 'Preventivo Matrimonio 2024', amount: 25000, status: 'Accettato' }]
    },
    {
        id: 2,
        name: 'Famiglia Rossi',
        email: 'info@famigliarossi.it',
        phone: '347 7654321',
        events: [{ id: 'fr2024', name: 'Anniversario Famiglia Rossi', date: '22 Ago 2024', status: 'In Corso' }],
        quotes: [{ id: 2, name: 'Preventivo Anniversario', amount: 12000, status: 'Accettato' }]
    },
];

export const MOCK_SUPPLIERS: Supplier[] = [
    {
        id: 1,
        name: 'Fiorista "Il Girasole"',
        category: 'Fiori',
        serviceDescription: 'Allestimenti floreali per matrimoni ed eventi.',
        email: 'info@ilgirasolefiori.it',
        phone: '06 123456'
    },
    {
        id: 2,
        name: 'DJ Groove Masters',
        category: 'Musica',
        serviceDescription: 'DJ set e intrattenimento musicale per feste.',
        email: 'info@djgroove.com',
        phone: '338 9876543'
    },
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
    { id: 1, title: 'Matrimonio Sarah & Marco', start: new Date(2024, 7, 15), end: new Date(2024, 7, 15), type: 'event' },
    { id: 2, title: 'Anniversario Famiglia Rossi', start: new Date(2024, 7, 22), end: new Date(2024, 7, 22), type: 'event' },
    { id: 3, title: 'Matrimonio Elena & Luca', start: new Date(2024, 7, 30), end: new Date(2024, 7, 30), type: 'event' },
    { id: 4, title: 'Appuntamento Fiori - Elena & Luca', start: new Date(2024, 7, 10), end: new Date(2024, 7, 10), type: 'appointment' },
    { id: 5, title: 'Scadenza conferma menù - Fam. Rossi', start: new Date(2024, 7, 5), end: new Date(2024, 7, 5), type: 'deadline' },
    { id: 6, title: 'Comprare fiori per evento Rossi', start: new Date(2024, 7, 18), end: new Date(2024, 7, 18), type: 'task', completed: false },
    { id: 7, title: 'Contattare DJ per S&M', start: new Date(2024, 7, 4), end: new Date(2024, 7, 4), type: 'task', completed: true },
];