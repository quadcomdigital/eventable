// types.ts

export type UserRole = 'admin' | 'client';

export type Page =
  'login' |
  'dashboard' |
  'admin' |
  'guests' |
  'contacts' |
  'configurations' |
  'planner-calendar' |
  'planner' |
  'event-detail' |
  'planner-create' |
  'chat' |
  'statistics' |
  'table-designer' |
  'layouts-list' |
  'submitted-layouts' |
  'client-dashboard' |
  'layout-selection' |
  'layouts-view';

export interface Guest {
    id: number;
    name: string;
    status: 'Confermato' | 'In attesa' | 'Rifiutato';
    notes: string; // For allergies, etc.
    allergies?: string; // Allergie
    intolerances?: string; // Intolleranze
    menuType?: 'Normale' | 'Vegetariano' | 'Vegano' | 'Senza Glutine' | 'Senza Lattosio' | 'Altro';
}

export interface Payment {
    id: number;
    amount: number;
    description: string;
    date: string;
}

export interface Event {
    id: string;
    name: string;
    date: string;
    status: 'Completato' | 'In Corso' | 'Pianificazione';
    type: string;
    guestCount: number;
    budget: number;
    guests: Guest[];
    payments: Payment[];
    generalNotes: string;
}

export interface Table {
    id: number;
    name: string;
    type: string;
    capacity: number;
    x: number; // percentage
    y: number; // percentage
    guests: Guest[];
}

export interface SavedLayout {
    id: number;
    name: string;
    tables: Table[];
    floorPlanData: {
        image: string | null;
        aspectRatio: number | null;
    };
    renderImage?: string; // Foto render del layout
}

export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'client';
    timestamp: string;
    read: boolean;
}

export interface ChatConversation {
    id: number;
    clientName: string;
    unreadCount: number;
    messages: Message[];
}

export enum Category {
    Tablecloth = 'tablecloth',
    Centerpiece = 'centerpiece',
    Cake = 'cake',
    Inspiration = 'inspiration',
}

export interface EventItem {
    id: number;
    category: Category;
    name: string;
    description: string;
    imageUrl: string;
    price: number;
}

export type Selections = {
    [key in Category]?: EventItem | null;
};

export interface ClientEvent {
    id: string;
    name: string;
    date: string;
    status: 'Completato' | 'In Corso' | 'Pianificazione';
}

export interface Quote {
    id: number;
    name: string;
    amount: number;
    status: 'Accettato' | 'Inviato' | 'Rifiutato';
}

export interface Client {
    id: number;
    name: string;
    email: string;
    phone: string;
    events: ClientEvent[];
    quotes: Quote[];
}

export interface Supplier {
    id: number;
    name: string;
    category: string;
    serviceDescription: string;
    email: string;
    phone: string;
}

export interface SubmittedLayout {
    id: number;
    clientName: string;
    layoutName: string;
    tables: Table[];
    floorPlanData: {
        image: string | null;
        aspectRatio: number | null;
    };
    renderImage?: string;
    submittedAt: string; // ISO timestamp
    totalGuests: number;
}

export interface CalendarEvent {
    id: number;
    title: string;
    start: Date;
    end: Date;
    type: 'event' | 'appointment' | 'deadline' | 'task';
    completed?: boolean;
}