
import React from 'react';
import type { Selections } from '../types';
import { Category } from '../types';

interface SummarySectionProps {
  selections: Selections;
}

const SummaryItem: React.FC<{label: string; value: string | null}> = ({label, value}) => (
    <div>
        <h4 className="text-sm font-medium text-stone-500">{label}</h4>
        <p className="text-stone-800 font-semibold mt-1">{value || 'Nessuna selezione'}</p>
    </div>
);

const SummarySection: React.FC<SummarySectionProps> = ({ selections }) => {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-stone-200/80 p-6 sm:p-8">
      <h3 className="text-xl font-semibold text-stone-800 mb-2">Riepilogo Selezioni</h3>
      <p className="text-stone-500 mb-6">Rivedi le tue scelte prima di procedere</p>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
        <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <SummaryItem label="Tovagliato" value={selections[Category.Tablecloth]?.name ?? null} />
            <SummaryItem label="Centrotavola" value={selections[Category.Centerpiece]?.name ?? null} />
            <SummaryItem label="Torta" value={selections[Category.Cake]?.name ?? null} />
        </div>
        
        <button className="w-full bg-amber-400 text-amber-900 font-semibold px-6 py-3 rounded-lg hover:bg-amber-500 transition-colors shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
          Salva Configurazione
        </button>
      </div>
    </div>
  );
};

export default SummarySection;
