import React, { useState } from 'react';
// FIX: Correctly import UserRole from types.ts instead of App.tsx
import type { Page, UserRole } from '../types';
import { SparklesIcon, HomeIcon, TableCellsIcon, UsersIcon, AdjustmentsHorizontalIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon } from './Icons';
import { AdminNavLinks } from './Sidebar';

interface HeaderProps {
    userRole: UserRole;
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
    const activeClasses = 'bg-amber-100 text-amber-700';
    const inactiveClasses = 'text-stone-600 hover:bg-stone-100 hover:text-stone-800';
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive ? activeClasses : inactiveClasses}`}
        >
            {icon}
            {label}
        </button>
    );
};

const Header: React.FC<HeaderProps> = ({ userRole, currentPage, onNavigate, onLogout }) => {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

    if (userRole === 'admin') {
        return (
            <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-stone-200/80 shadow-sm lg:hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <img src="/loghi_vm.png" alt="EventMaster Logo" className="h-10 object-contain" />
                        </div>

                        <div className="lg:hidden">
                            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
                                {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6"/> : <Bars3Icon className="w-6 h-6"/>}
                            </button>
                        </div>
                    </div>
                </div>

                {isMobileMenuOpen && (
                    <div className="lg:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <AdminNavLinks currentPage={currentPage} onNavigate={onNavigate} onLinkClick={() => setMobileMenuOpen(false)} />
                        </div>
                         <div className="pt-4 pb-3 border-t border-stone-200">
                            <div className="px-2">
                                 <button
                                    onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-stone-600 hover:bg-stone-100 hover:text-stone-800 text-left"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>
        );
    }

    const clientNavLinks = [
        { page: 'client-dashboard' as Page, label: 'Il Mio Evento', icon: <HomeIcon className="w-5 h-5" /> },
        { page: 'table-designer' as Page, label: 'Disposizioni', icon: <TableCellsIcon className="w-5 h-5" /> },
    ];

    const renderClientNav = () => (
        <>
            {clientNavLinks.map(link => (
                <NavItem
                    key={link.page}
                    label={link.label}
                    icon={link.icon}
                    isActive={currentPage === link.page}
                    onClick={() => {
                        onNavigate(link.page);
                        setMobileMenuOpen(false);
                    }}
                />
            ))}
        </>
    );

    return (
        <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-40 border-b border-stone-200/80 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <img src="/loghi_vm.png" alt="Logo" className="h-10 object-contain" />
                            {userRole === 'admin' && <span className="font-bold text-xl text-stone-800">EventMaster</span>}
                        </div>
                        <nav className="hidden md:flex items-center gap-2">
                           {renderClientNav()}
                        </nav>
                    </div>

                    <div className="hidden md:flex items-center">
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 text-stone-600 hover:bg-stone-100 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Logout
                        </button>
                    </div>

                    <div className="md:hidden">
                        <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <XMarkIcon className="w-6 h-6"/> : <Bars3Icon className="w-6 h-6"/>}
                        </button>
                    </div>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {renderClientNav()}
                    </div>
                     <div className="pt-4 pb-3 border-t border-stone-200">
                        <div className="px-2">
                             <button
                                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors text-stone-600 hover:bg-stone-100 hover:text-stone-800"
                            >
                                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;