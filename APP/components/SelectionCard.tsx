
import React from 'react';
import type { EventItem } from '../types';

interface SelectionCardProps {
  item: EventItem;
  isSelected: boolean;
  onSelect: (item: EventItem) => void;
}

const SelectionCard: React.FC<SelectionCardProps> = ({ item, isSelected, onSelect }) => {
  const selectedClasses = 'ring-2 ring-amber-500 ring-offset-2';
  
  return (
    <div
      onClick={() => onSelect(item)}
      className={`group cursor-pointer bg-stone-50 rounded-xl overflow-hidden border border-stone-200/80 transition-all hover:shadow-lg hover:border-amber-400/50 hover:-translate-y-1 ${isSelected ? selectedClasses : 'shadow-sm'}`}
    >
      <img className="h-48 w-full object-cover" src={item.imageUrl} alt={item.name} />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-stone-800">{item.name}</h3>
        <p className="text-sm text-stone-600 mt-1 h-10">{item.description}</p>
        <div className="mt-4">
          <span className="inline-block bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            €{item.price} per tavolo
          </span>
        </div>
      </div>
    </div>
  );
};

export default SelectionCard;
