import React, { useState } from 'react';
import type { Page, UserRole, SavedLayout, ChatConversation, Event } from './types';
import { MOCK_EVENTS } from './constants';
import LoginPage from './components/LoginPage';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import AdminPanel from './components/AdminPanel';
import ClientDashboard from './components/ClientDashboard';
import TableDesigner from './components/TableDesigner';
import ClientLayoutSelectionPage from './components/ClientLayoutSelectionPage';
import LayoutsListPage from './components/LayoutsListPage';
import ClientLayoutsViewPage from './components/ClientLayoutsViewPage';
import SubmittedLayoutsPage from './components/SubmittedLayoutsPage';
import GuestManagement from './components/GuestManagement';
import ContactsPage from './components/ContactsPage';
import ConfigurationsPage from './components/ConfigurationsPage';
import ChatPage from './components/ChatPage';
import PlannerPage from './components/PlannerPage';
import CreateEventWizard from './components/CreateEventWizard';
import EventPlanner from './components/EventPlanner';
import EventDetailPage from './components/EventDetailPage';
import StatisticsPage from './components/StatisticsPage';

// Mock initial data for chat
const initialConversations: ChatConversation[] = [
    {
        id: 1,
        clientName: 'Sarah & Marco',
        unreadCount: 2,
        messages: [
            { id: 1, text: 'Ciao! Avremmo una domanda sulla disposizione dei tavoli.', sender: 'client', timestamp: '10:30', read: true },
            { id: 2, text: 'Certo, ditemi pure. Come posso aiutarvi?', sender: 'user', timestamp: '10:31', read: true },
            { id: 3, text: 'Vorremmo aggiungere un tavolo per i bambini, è possibile?', sender: 'client', timestamp: '10:32', read: false },
             { id: 4, text: 'Assolutamente, sistemo subito. Quanti bambini sono?', sender: 'user', timestamp: '10:35', read: false },
        ],
    },
    {
        id: 2,
        clientName: 'Famiglia Rossi',
        unreadCount: 0,
        messages: [
            { id: 5, text: 'Tutto confermato per il 22, grazie di tutto!', sender: 'client', timestamp: 'Ieri', read: true },
            { id: 6, text: 'Perfetto! Sarà un evento magnifico. A presto!', sender: 'user', timestamp: 'Ieri', read: true },
        ],
    },
];

export default function App() {
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    const [currentPage, setCurrentPage] = useState<Page>('login');
    const [selectedLayout, setSelectedLayout] = useState<SavedLayout | null>(null);
    const [conversations, setConversations] = useState<ChatConversation[]>(initialConversations);
    
    // State for event management
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);


    const handleLogin = (role: UserRole, eventId?: string) => {
        setUserRole(role);
        if (role === 'admin') {
            setCurrentPage('dashboard');
        } else if (role === 'client') {
            setCurrentPage('client-dashboard');
        }
    };

    const handleLogout = () => {
        setUserRole(null);
        setCurrentPage('login');
    };

    const handleNavigate = (page: Page, payload?: any) => {
        if (page === 'event-detail' && payload?.eventId) {
            const event = events.find(e => e.id === payload.eventId);
            setSelectedEvent(event || null);
        } else {
            setSelectedEvent(null);
        }
        setCurrentPage(page);
    };

    const handleSelectLayout = (layout: SavedLayout) => {
        setSelectedLayout(layout);
        setCurrentPage('table-designer');
    };

    const handleUpdateEvent = (updatedEvent: Event) => {
        const updatedEvents = events.map(e => e.id === updatedEvent.id ? updatedEvent : e);
        setEvents(updatedEvents);
        setSelectedEvent(updatedEvent);
    };

    const renderPage = () => {
        if (!userRole) {
            return <LoginPage onLogin={handleLogin} />;
        }
        
        switch (currentPage) {
            case 'dashboard':
                return <Dashboard onNavigate={handleNavigate} />;
            case 'admin':
                return <AdminPanel onNavigate={handleNavigate} />;
            case 'guests':
                return <GuestManagement />;
            case 'contacts':
                return <ContactsPage />;
            case 'configurations':
                return <ConfigurationsPage />;
            case 'planner-calendar':
                return <PlannerPage />;
            case 'planner':
                return <EventPlanner events={events} onNavigate={handleNavigate} />;
            case 'event-detail':
                 return selectedEvent ? <EventDetailPage event={selectedEvent} onBack={() => handleNavigate('planner')} onUpdateEvent={handleUpdateEvent} /> : <EventPlanner events={events} onNavigate={handleNavigate} />;
            case 'planner-create':
                return <CreateEventWizard onCancel={() => setCurrentPage('dashboard')} onSave={(details) => { console.log(details); setCurrentPage('dashboard'); }} />;
            case 'chat':
                return <ChatPage conversations={conversations} setConversations={setConversations} />;
            case 'statistics':
                return <StatisticsPage />;
            // Shared pages
            case 'table-designer':
                return <TableDesigner userRole={userRole} initialLayout={selectedLayout || undefined} />;
            case 'layouts-list':
                return <LayoutsListPage onEditLayout={(layout) => { setSelectedLayout(layout); setCurrentPage('table-designer'); }} />;
            case 'submitted-layouts':
                return <SubmittedLayoutsPage />;
            // Client pages
            case 'client-dashboard':
                return <ClientDashboard onNavigate={handleNavigate} />;
            case 'layout-selection':
                return <ClientLayoutSelectionPage onSelectLayout={handleSelectLayout} />;
            case 'layouts-view':
                return <ClientLayoutsViewPage onSelectLayout={handleSelectLayout} />;
            default:
                return <Dashboard onNavigate={handleNavigate} />;
        }
    };
    
    if (!userRole) {
        return <LoginPage onLogin={handleLogin} />;
    }

    if (userRole === 'client') {
        return (
            <div className="min-h-screen bg-stone-50">
                <Header 
                    userRole={userRole}
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {renderPage()}
                </main>
            </div>
        );
    }
    
    // Admin layout
    return (
        <div className="flex h-screen bg-stone-100">
            <Sidebar 
                currentPage={currentPage} 
                onNavigate={handleNavigate}
                onLogout={handleLogout}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                 <Header 
                    userRole={userRole}
                    currentPage={currentPage}
                    onNavigate={handleNavigate}
                    onLogout={handleLogout}
                />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-stone-100/50 p-6">
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}
