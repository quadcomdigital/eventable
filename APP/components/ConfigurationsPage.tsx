import React, { useState } from 'react';
import { QueueListIcon, PlusIcon, PencilIcon, TrashIcon, MusicalNoteIcon, BookOpenIcon, PlusCircleIcon, XMarkIcon } from './Icons';

// Data Structures
interface ServiceItem {
  id: number;
  name: string;
}

interface ServiceCategory {
  id: number;
  name: string; // "Musica"
  singularItemName: string; // "Artista"
  pluralItemName: string; // "Artisti"
  icon: React.ReactNode;
  items: ServiceItem[];
}

// Mock Data
const MOCK_SERVICES: ServiceCategory[] = [
  {
    id: 1,
    name: 'Musica',
    singularItemName: 'Artista',
    pluralItemName: 'Artisti',
    icon: <MusicalNoteIcon className="w-6 h-6" />,
    items: [
      { id: 101, name: 'DJ Groove Masters' },
      { id: 102, name: 'Acoustic Duo Serenades' },
      { id: 103, name: 'Jazz Quartet Elegance' },
    ],
  },
  {
    id: 2,
    name: 'Menù',
    singularItemName: 'Tipo di Menù',
    pluralItemName: 'Tipi di Menù',
    icon: <BookOpenIcon className="w-6 h-6" />,
    items: [
      { id: 201, name: 'Menù di Terra Tradizionale' },
      { id: 202, name: 'Menù di Mare Gourmet' },
      { id: 203, name: 'Menù Vegetariano' },
    ],
  },
];

const ConfigurationsPage: React.FC = () => {
    const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>(MOCK_SERVICES);
    const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

    const handleAddCategory = (name: string, singular: string, plural: string) => {
        const newCategory: ServiceCategory = {
            id: Date.now(),
            name,
            singularItemName: singular,
            pluralItemName: plural,
            icon: <MusicalNoteIcon className="w-6 h-6" />, // Default icon for now
            items: []
        };
        setServiceCategories([...serviceCategories, newCategory]);
        setCategoryModalOpen(false);
    };

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <QueueListIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Configurazione Servizi</h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    Aggiungi, modifica ed elimina le categorie di servizi e le opzioni disponibili per i clienti.
                </p>
            </div>

            {/* Main content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {serviceCategories.map(category => (
                    <div key={category.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                        {/* Card Header */}
                        <div className="flex justify-between items-start">
                             <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-stone-100 rounded-lg text-stone-600">
                                    {category.icon}
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-stone-800">{category.name}</h3>
                                    <p className="text-sm text-stone-500">{category.items.length} {category.pluralItemName}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-100 rounded-md"><PencilIcon className="w-4 h-4" /></button>
                                <button className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-100 rounded-md"><TrashIcon className="w-4 h-4" /></button>
                            </div>
                        </div>
                        
                        {/* Items List */}
                        <div className="mt-4 space-y-2">
                            {category.items.length > 0 ? category.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-3 bg-stone-50/70 rounded-lg">
                                    <p className="font-medium text-stone-700 text-sm">{item.name}</p>
                                    <div className="flex gap-2">
                                        <button className="p-1.5 text-stone-500 hover:text-blue-600 hover:bg-blue-100 rounded-md"><PencilIcon className="w-4 h-4" /></button>
                                        <button className="p-1.5 text-stone-500 hover:text-red-600 hover:bg-red-100 rounded-md"><TrashIcon className="w-4 h-4" /></button>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-stone-500 italic text-center py-4">Nessuna opzione aggiunta.</p>
                            )}
                        </div>
                        
                        {/* Add Item Button */}
                        <button className="w-full mt-4 bg-amber-100 text-amber-800 font-semibold px-4 py-2 rounded-lg hover:bg-amber-200 transition-colors text-sm flex items-center justify-center gap-2">
                            <PlusIcon className="w-4 h-4" />
                            Aggiungi {category.singularItemName}
                        </button>
                    </div>
                ))}

                {/* Add New Category Card */}
                 <button onClick={() => setCategoryModalOpen(true)} className="flex flex-col items-center justify-center text-center p-6 rounded-xl border-2 border-dashed border-stone-300 text-stone-500 hover:border-amber-400 hover:text-amber-600 hover:bg-amber-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 min-h-[200px]">
                  <PlusCircleIcon className="w-16 h-16 text-stone-400" />
                  <p className="font-semibold mt-3">Aggiungi Nuova Categoria</p>
                  <p className="text-sm mt-1">Crea un nuovo tipo di servizio (es. Fiori, Intrattenimento).</p>
              </button>
            </div>
            {isCategoryModalOpen && <CategoryModal onClose={() => setCategoryModalOpen(false)} onSave={handleAddCategory} />}
        </div>
    );
};

const CategoryModal: React.FC<{
    onClose: () => void;
    onSave: (name: string, singular: string, plural: string) => void;
}> = ({ onClose, onSave }) => {
    const [name, setName] = useState('');
    const [singular, setSingular] = useState('');
    const [plural, setPlural] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(name && singular && plural) {
            onSave(name, singular, plural);
        }
    }

    return (
         <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b border-stone-200/80">
                    <h2 className="text-lg font-semibold text-stone-800">Crea Nuova Categoria</h2>
                    <button onClick={onClose} className="p-1.5 text-stone-500 hover:bg-stone-100 rounded-full">
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-1">Nome Categoria</label>
                            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Es. Musica" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required/>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label htmlFor="singular" className="block text-sm font-medium text-stone-700 mb-1">Nome Oggetto (Singolare)</label>
                                <input id="singular" type="text" value={singular} onChange={e => setSingular(e.target.value)} placeholder="Es. Artista" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required/>
                            </div>
                            <div>
                                <label htmlFor="plural" className="block text-sm font-medium text-stone-700 mb-1">Nome Oggetto (Plurale)</label>
                                <input id="plural" type="text" value={plural} onChange={e => setPlural(e.target.value)} placeholder="Es. Artisti" className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500" required/>
                            </div>
                        </div>
                    </div>
                     <div className="px-6 py-4 bg-stone-50/70 border-t border-stone-200/80 flex justify-end gap-3 rounded-b-xl">
                        <button type="button" onClick={onClose} className="bg-white text-stone-700 font-semibold px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-100 transition-colors">Annulla</button>
                        <button type="submit" className="bg-amber-400 text-white font-semibold px-4 py-2 rounded-lg hover:bg-amber-500 transition-colors">Salva Categoria</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ConfigurationsPage;