import React, { useState, useEffect } from 'react';
import FloorPlan from './FloorPlan';
import TableTools from './TableTools';
import AddTableModal from './AddTableModal';
import ClientTableEditModal from './ClientTableEditModal';
import { TableCellsIcon } from './Icons';
import type { SavedLayout, Table, SubmittedLayout } from '../types';
// FIX: Correctly import UserRole from types.ts instead of App.tsx
import type { UserRole } from '../types';

interface TableDesignerProps {
    userRole: UserRole;
    initialLayout?: SavedLayout;
}

const TableDesigner: React.FC<TableDesignerProps> = ({ userRole, initialLayout }) => {
    const [tables, setTables] = useState<Table[]>(() =>
        (userRole === 'client' && initialLayout) ? initialLayout.tables : []
    );
    const [floorPlanData, setFloorPlanData] = useState<{ image: string | null; aspectRatio: number | null }>(() =>
        (userRole === 'client' && initialLayout) ? initialLayout.floorPlanData : { image: null, aspectRatio: null }
    );
    
    const [selectedTableForEdit, setSelectedTableForEdit] = useState<Table | null>(null);
    
    const [isAddTableModalOpen, setAddTableModalOpen] = useState(false);
    const [renderImage, setRenderImage] = useState<string | undefined>(initialLayout?.renderImage);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitModalState, setSubmitModalState] = useState<{ isOpen: boolean; success: boolean; message: string }>({
        isOpen: false,
        success: false,
        message: '',
    });

    const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>(() => {
        // Leggi layout salvati da localStorage (key = "saved_layouts_admin")
        if (userRole === 'admin') {
            const stored = localStorage.getItem('saved_layouts_admin');
            console.log('[TableDesigner] Layouts caricati da localStorage:', stored ? JSON.parse(stored) : []);
            return stored ? JSON.parse(stored) : [];
        }
        return [];
    });
    const [currentLayoutId, setCurrentLayoutId] = useState<number | null>(null);

    // Sincronizza savedLayouts con localStorage in real-time
    useEffect(() => {
        if (userRole === 'admin') {
            console.log('[TableDesigner] Sincronizzazione layouts con localStorage:', savedLayouts);
            localStorage.setItem('saved_layouts_admin', JSON.stringify(savedLayouts));
        }
    }, [savedLayouts, userRole]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target?.result as string;
                if (imageUrl) {
                    const img = new Image();
                    img.onload = () => {
                        setFloorPlanData({
                            image: imageUrl,
                            aspectRatio: img.width / img.height,
                        });
                    };
                    img.src = imageUrl;
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRenderImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                setRenderImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTableMove = (id: number, x: number, y: number) => {
        setTables(prevTables => prevTables.map(table => table.id === id ? { ...table, x, y } : table));
    };

    const handleTableSelect = (table: Table) => {
        setSelectedTableForEdit(table);
    };

    const addTable = (type: string, capacity: number) => {
        const newTable: Table = {
            id: Date.now(),
            name: `Tavolo ${tables.length + 1}`,
            type,
            capacity,
            x: 0.1, // Start at 10% from left
            y: 0.1, // Start at 10% from top
            guests: [],
        };
        setTables([...tables, newTable]);
        setAddTableModalOpen(false);
    };

    const updateTable = (updatedTable: Table) => {
        setTables(tables.map(t => t.id === updatedTable.id ? updatedTable : t));
        setSelectedTableForEdit(null);
    };
    
    const deleteTable = (tableId: number) => {
      setTables(tables.filter(t => t.id !== tableId));
      setSelectedTableForEdit(null);
    }

    const handleSaveLayout = (name: string) => {
        if (!name.trim()) {
            alert("Per favore, inserisci un nome per il layout.");
            return;
        }

        let updatedLayouts;
        let layoutIdToSet;

        const layoutData: any = {
            tables,
            floorPlanData,
        };

        // Aggiungi renderImage solo se è stato caricato
        if (renderImage) {
            layoutData.renderImage = renderImage;
        }

        if (currentLayoutId) { // Update existing layout
            updatedLayouts = savedLayouts.map(l => 
                l.id === currentLayoutId ? { ...l, name, ...layoutData } : l
            );
            layoutIdToSet = currentLayoutId;
            console.log('[TableDesigner] Layout aggiornato:', { id: currentLayoutId, name, tables: tables.length });
            alert(`Layout "${name}" aggiornato con successo!`);
        } else { // Create new layout
            const newLayout: SavedLayout = {
                id: Date.now(),
                name,
                ...layoutData,
            };
            updatedLayouts = [...savedLayouts, newLayout];
            layoutIdToSet = newLayout.id;
            console.log('[TableDesigner] Nuovo layout salvato:', { id: newLayout.id, name, tables: tables.length });
            alert(`Layout "${name}" salvato con successo!`);
        }
        
        console.log('[TableDesigner] Tutti i layouts dopo save:', updatedLayouts);
        setSavedLayouts(updatedLayouts);
        // Salva su localStorage (solo per admin)
        if (userRole === 'admin') {
            localStorage.setItem('saved_layouts_admin', JSON.stringify(updatedLayouts));
            console.log('[TableDesigner] Salvato in localStorage:', JSON.stringify(updatedLayouts));
        }
        setCurrentLayoutId(layoutIdToSet);
    };

    const handleLoadLayout = (layoutId: number) => {
        const layoutToLoad = savedLayouts.find(l => l.id === layoutId);
        if (layoutToLoad) {
            setTables(layoutToLoad.tables);
            if (layoutToLoad.floorPlanData) {
                setFloorPlanData(layoutToLoad.floorPlanData);
            } else {
                setFloorPlanData({ image: null, aspectRatio: null });
            }
            if (layoutToLoad.renderImage) {
                setRenderImage(layoutToLoad.renderImage);
            }
            setCurrentLayoutId(layoutToLoad.id);
        }
    };

    const handleDeleteLayout = (layoutId: number) => {
        if (window.confirm("Sei sicuro di voler eliminare questo layout?")) {
            const updatedLayouts = savedLayouts.filter(l => l.id !== layoutId);
            setSavedLayouts(updatedLayouts);
            // Aggiorna localStorage
            if (userRole === 'admin') {
                localStorage.setItem('saved_layouts_admin', JSON.stringify(updatedLayouts));
            }
            if (currentLayoutId === layoutId) {
                setCurrentLayoutId(null);
                setTables([]);
                setFloorPlanData({ image: null, aspectRatio: null });
            }
        }
    };
    
    const currentLayout = savedLayouts.find(l => l.id === currentLayoutId);

    const handleSubmitLayout = async () => {
        if (!initialLayout) {
            setSubmitModalState({
                isOpen: true,
                success: false,
                message: 'Errore: nessun layout selezionato',
            });
            return;
        }

        const totalGuests = tables.reduce((sum, t) => sum + t.guests.length, 0);

        const submittedLayout: SubmittedLayout = {
            id: Date.now(),
            clientName: 'Cliente Matrimonio', // In futuro verrà dal profilo cliente
            layoutName: initialLayout.name,
            tables,
            floorPlanData,
            renderImage,
            submittedAt: new Date().toISOString(),
            totalGuests,
        };

        try {
            // Leggi le disposizioni già inviate
            const stored = localStorage.getItem('submitted_layouts_clients');
            const submitted = stored ? JSON.parse(stored) : [];
            
            // Aggiungi la nuova
            submitted.push(submittedLayout);
            
            // Salva su localStorage
            localStorage.setItem('submitted_layouts_clients', JSON.stringify(submitted));
            
            setIsSubmitting(false);
            setSubmitModalState({
                isOpen: true,
                success: true,
                message: `Disposizione "${initialLayout.name}" inviata con successo! L'admin la rivederà a breve.`,
            });
        } catch (error) {
            console.error('Errore invio disposizione:', error);
            setSubmitModalState({
                isOpen: true,
                success: false,
                message: 'Errore nell\'invio della disposizione. Riprova.',
            });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-10rem)]">
             <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3">
                    <TableCellsIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-stone-900">
                        {userRole === 'admin' ? 'Disposizioni' : initialLayout?.name || 'Disposizione Ospiti'}
                    </h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    {userRole === 'admin' 
                        ? 'Organizza la disposizione dei tavoli e degli ospiti con un semplice drag-and-drop.'
                        : 'Clicca su un tavolo per assegnare i tuoi ospiti.'
                    }
                </p>

                {/* Progress Bar for Clients */}
                {userRole === 'client' && initialLayout && (
                    <div className="mt-6 max-w-md mx-auto space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-stone-700">
                                Ospiti assegnati: <span className="text-amber-600">{tables.reduce((sum, t) => sum + t.guests.length, 0)}</span> / <span className="text-stone-600">{tables.reduce((sum, t) => sum + t.capacity, 0)}</span>
                            </span>
                            <span className="text-xs font-medium text-stone-500">
                                {Math.round((tables.reduce((sum, t) => sum + t.guests.length, 0) / tables.reduce((sum, t) => sum + t.capacity, 0)) * 100)}%
                            </span>
                        </div>
                        <div className="w-full bg-stone-200 rounded-full h-3 overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500"
                                style={{ 
                                    width: `${Math.min((tables.reduce((sum, t) => sum + t.guests.length, 0) / tables.reduce((sum, t) => sum + t.capacity, 0)) * 100, 100)}%` 
                                }}
                            ></div>
                        </div>
                        <button
                            onClick={handleSubmitLayout}
                            disabled={tables.reduce((sum, t) => sum + t.guests.length, 0) === 0 || isSubmitting}
                            className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-green-400 to-green-500 text-white font-bold rounded-lg hover:from-green-500 hover:to-green-600 disabled:from-stone-300 disabled:to-stone-400 disabled:cursor-not-allowed transition-all shadow-lg text-sm"
                        >
                            {isSubmitting ? '⏳ Invio in corso...' : tables.reduce((sum, t) => sum + t.guests.length, 0) > 0 ? '✅ Invia Disposizione' : '➕ Aggiungi ospiti per inviare'}
                        </button>
                    </div>
                )}
            </div>

            <div className="flex-grow flex flex-col min-h-0">
                {userRole === 'admin' && (
                    <TableTools 
                        onAddTable={() => setAddTableModalOpen(true)}
                        onFileChange={handleFileChange}
                        onRenderImageChange={handleRenderImageChange}
                        onSaveLayout={handleSaveLayout}
                        savedLayouts={savedLayouts.map(({id, name}) => ({id, name}))}
                        onLoadLayout={handleLoadLayout}
                        onDeleteLayout={handleDeleteLayout}
                        currentLayoutId={currentLayoutId}
                        currentLayoutName={currentLayout?.name}
                    />
                )}
                <FloorPlan 
                    tables={tables} 
                    onTableMove={handleTableMove} 
                    onTableSelect={handleTableSelect}
                    floorPlanData={floorPlanData}
                    isDraggable={userRole === 'admin'}
                />
            </div>
            
            {userRole === 'admin' && (
                <AddTableModal
                    isOpen={isAddTableModalOpen}
                    onClose={() => setAddTableModalOpen(false)}
                    onAdd={addTable}
                />
            )}
            
            <ClientTableEditModal
                isOpen={!!selectedTableForEdit}
                onClose={() => setSelectedTableForEdit(null)}
                table={selectedTableForEdit}
                onSave={updateTable}
                onDelete={deleteTable}
                userRole={userRole}
            />

            {/* Submit Modal */}
            {submitModalState.isOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            {/* Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl ${
                                submitModalState.success 
                                    ? 'bg-green-100 text-green-600' 
                                    : 'bg-red-100 text-red-600'
                            }`}>
                                {submitModalState.success ? '✅' : '❌'}
                            </div>
                            
                            {/* Title */}
                            <h2 className={`text-xl font-bold ${
                                submitModalState.success ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {submitModalState.success ? 'Inviato con successo!' : 'Errore'}
                            </h2>
                            
                            {/* Message */}
                            <p className="text-stone-600 text-sm leading-relaxed">
                                {submitModalState.message}
                            </p>
                            
                            {/* Close Button */}
                            <button
                                onClick={() => setSubmitModalState({ ...submitModalState, isOpen: false })}
                                className={`w-full mt-6 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                                    submitModalState.success
                                        ? 'bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600'
                                        : 'bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600'
                                }`}
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableDesigner;