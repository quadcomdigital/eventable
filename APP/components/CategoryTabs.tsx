
import React from 'react';
import { Category } from '../types';
import { CakeIcon, HeartIcon, SparklesIcon, TableCellsIcon } from './Icons';

interface CategoryTabsProps {
  activeCategory: Category;
  onSelectCategory: (category: Category) => void;
}

const CategoryTab: React.FC<{
  category: Category;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => {
  const activeClasses = 'bg-white text-stone-800 border-t-2 border-amber-500 shadow-sm';
  const inactiveClasses = 'bg-stone-100/70 text-stone-500 hover:bg-stone-200/70 hover:text-stone-700';
  
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:z-10 ${isActive ? activeClasses : inactiveClasses}`}
      style={{borderTopLeftRadius: '0.75rem', borderTopRightRadius: '0.75rem'}}
    >
      {icon}
      {label}
    </button>
  );
};

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onSelectCategory }) => {
  const tabs = [
    { id: Category.Tablecloth, label: 'Tovagliato', icon: <TableCellsIcon className="w-5 h-5" /> },
    { id: Category.Centerpiece, label: 'Centrotavola', icon: <SparklesIcon className="w-5 h-5" /> },
    { id: Category.Cake, label: 'Torta', icon: <CakeIcon className="w-5 h-5" /> },
    { id: Category.Inspiration, label: 'Ispirazione', icon: <HeartIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex space-x-1 rounded-t-xl overflow-hidden p-1 bg-stone-200/50">
      {tabs.map(tab => (
        <CategoryTab
          key={tab.id}
          category={tab.id}
          label={tab.label}
          icon={tab.icon}
          isActive={activeCategory === tab.id}
          onClick={() => onSelectCategory(tab.id)}
        />
      ))}
    </div>
  );
};

export default CategoryTabs;
