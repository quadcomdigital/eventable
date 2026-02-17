import React, { useState } from 'react';
import type { Page } from '../types';
import { ArrowRightOnRectangleIcon, AdjustmentsHorizontalIcon, HomeIcon, SparklesIcon, QueueListIcon, UsersIcon, UserGroupIcon, CalendarDaysIcon, ChartBarIcon } from './Icons';

interface SidebarProps {
    currentPage: Page;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const NavItem: React.FC<{
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
    const activeClasses = 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 font-semibold shadow-sm';
    const inactiveClasses = 'text-stone-600 hover:bg-stone-100 hover:text-stone-800';
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left duration-200 ${isActive ? activeClasses : inactiveClasses} ${isActive ? '' : 'hover:shadow-sm'}`}
        >
            {icon}
            {label}
        </button>
    );
};

const SubMenuItem: React.FC<{
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ label, isActive, onClick }) => {
    const activeClasses = 'bg-amber-50 text-amber-700 font-semibold';
    const inactiveClasses = 'text-stone-600 hover:bg-stone-100 hover:text-stone-800';
    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-6 py-2 rounded-lg text-sm font-medium transition-all text-left duration-200 ${isActive ? activeClasses : inactiveClasses}`}
        >
            {label}
        </button>
    );
};

export const AdminNavLinks: React.FC<{ currentPage: Page; onNavigate: (page: Page) => void; onLinkClick?: () => void }> = ({ currentPage, onNavigate, onLinkClick }) => {
    const [isDisposizionesOpen, setIsDisposizionesOpen] = useState(false);

    const disposizionesPages = ['table-designer', 'layouts-list', 'submitted-layouts', 'guests'] as const;
    const isDisposizionesActive = disposizionesPages.includes(currentPage as any);

    const subLinks = [
        { page: 'table-designer' as Page, label: 'Crea/Modifica' },
        { page: 'layouts-list' as Page, label: 'Disposizioni Create' },
        { page: 'submitted-layouts' as Page, label: 'Invii Clienti' },
        { page: 'guests' as Page, label: 'Gestione Ospiti' },
    ];

    const mainLinks = [
        { page: 'dashboard' as Page, label: 'Dashboard', icon: <HomeIcon className="w-5 h-5" /> },
        { page: 'planner-calendar' as Page, label: 'Planner', icon: <CalendarDaysIcon className="w-5 h-5" /> },
        { page: 'planner' as Page, label: 'Eventi', icon: <SparklesIcon className="w-5 h-5" /> },
        { page: 'statistics' as Page, label: 'Statistiche', icon: <ChartBarIcon className="w-5 h-5" /> },
    ];

    return (
        <nav className="flex flex-col gap-2">
            {mainLinks.map(link => (
                <NavItem
                    key={link.page}
                    label={link.label}
                    icon={link.icon}
                    isActive={currentPage === link.page}
                    onClick={() => {
                        onNavigate(link.page);
                        if (onLinkClick) onLinkClick();
                    }}
                />
            ))}

            {/* Disposizioni Collapsible Menu */}
            <div>
                <button
                    onClick={() => setIsDisposizionesOpen(!isDisposizionesOpen)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left duration-200 ${
                        isDisposizionesActive
                            ? 'bg-gradient-to-r from-amber-100 to-amber-50 text-amber-700 font-semibold shadow-sm'
                            : 'text-stone-600 hover:bg-stone-100 hover:text-stone-800'
                    }`}
                >
                    <QueueListIcon className="w-5 h-5" />
                    <span className="flex-1">Disposizioni</span>
                    <span className={`text-xs transition-transform ${isDisposizionesOpen ? 'rotate-90' : ''}`}>▶</span>
                </button>

                {isDisposizionesOpen && (
                    <div className="mt-1 space-y-1">
                        {subLinks.map(link => (
                            <SubMenuItem
                                key={link.page}
                                label={link.label}
                                isActive={currentPage === link.page}
                                onClick={() => {
                                    onNavigate(link.page);
                                    if (onLinkClick) onLinkClick();
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Other Main Links */}
            <NavItem
                label="Clienti e Fornitori"
                icon={<UserGroupIcon className="w-5 h-5" />}
                isActive={currentPage === 'contacts'}
                onClick={() => {
                    onNavigate('contacts');
                    if (onLinkClick) onLinkClick();
                }}
            />
            <NavItem
                label="Impostazioni"
                icon={<AdjustmentsHorizontalIcon className="w-5 h-5" />}
                isActive={currentPage === 'admin'}
                onClick={() => {
                    onNavigate('admin');
                    if (onLinkClick) onLinkClick();
                }}
            />
        </nav>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, onLogout }) => {
    return (
        <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-gradient-to-b from-white via-stone-50/50 to-white border-r border-stone-200/80 p-4 shadow-sm">
            <div className="flex justify-center mb-8">
                 <img src="/loghi_vm.png" alt="EventMaster Logo" className="h-12 object-contain drop-shadow-md" />
            </div>
            
            <div className="flex-grow">
               <AdminNavLinks currentPage={currentPage} onNavigate={onNavigate} />
            </div>
            
            <div className="mt-auto">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all text-stone-600 hover:bg-red-50 hover:text-red-700 duration-200 active:scale-95"
                >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};export default Sidebar;