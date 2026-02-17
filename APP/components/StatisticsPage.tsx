import React from 'react';
import { ChartBarIcon, CalendarDaysIcon, TagIcon, CreditCardIcon } from './Icons';

// A simple component for stat cards
const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode; subtext?: string; }> = ({ title, value, icon, subtext }) => (
    <div className="bg-white/80 backdrop-blur-sm p-5 rounded-xl border border-stone-200/80 shadow-sm flex items-center gap-4">
        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-stone-100">
            {icon}
        </div>
        <div>
            <p className="text-sm text-stone-500 font-medium">{title}</p>
            <p className="text-2xl font-bold text-stone-800 mt-1">{value}</p>
            {subtext && <p className="text-xs text-green-600 mt-1">{subtext}</p>}
        </div>
    </div>
);

// A reusable BarChart component
const BarChart: React.FC<{ data: { label: string; value: number; }[], color: string }> = ({ data, color }) => {
    const maxValue = Math.max(...data.map(d => d.value));
    return (
        <div className="flex justify-around items-end h-64 bg-stone-50/70 p-4 rounded-lg border border-stone-200/80">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center h-full justify-end" style={{ width: '100%' }}>
                    <div className="text-sm font-bold text-stone-700">{item.value}</div>
                    <div
                        className={`w-3/4 rounded-t-md transition-all duration-500 ${color}`}
                        style={{ height: `${(item.value / maxValue) * 85}%` }}
                        title={`${item.label}: ${item.value}`}
                    ></div>
                    <div className="text-xs font-medium text-stone-500 mt-2 text-center">{item.label}</div>
                </div>
            ))}
        </div>
    );
};

const StatisticsPage: React.FC = () => {
    // Mock data for charts and tables
    const eventsPerMonthData = [
        { label: 'Gen', value: 2 }, { label: 'Feb', value: 1 }, { label: 'Mar', value: 3 },
        { label: 'Apr', value: 4 }, { label: 'Mag', value: 8 }, { label: 'Giu', value: 10 },
        { label: 'Lug', value: 7 }, { label: 'Ago', value: 5 }, { label: 'Set', value: 9 },
        { label: 'Ott', value: 6 }, { label: 'Nov', value: 2 }, { label: 'Dic', value: 3 },
    ];

    const eventTypesData = [
        { label: 'Matrimoni', value: 25 },
        { label: 'Aziendali', value: 18 },
        { label: 'Privati', value: 10 },
        { label: 'Comunioni', value: 7 },
    ];
    
    const costAnalysisData = [
        { menu: 'Menù di Terra', cost: 45, price: 90, margin: '50%' },
        { menu: 'Menù di Mare', cost: 60, price: 125, margin: '52%' },
        { menu: 'Menù Vegetariano', cost: 40, price: 85, margin: '53%' },
    ];
    
    const salesChannelData = [
        { channel: 'Matrimoni', events: 25, revenue: '€225.000' },
        { channel: 'Eventi Aziendali', events: 18, revenue: '€144.000' },
        { channel: 'Feste Private', events: 10, revenue: '€50.000' },
        { channel: 'Altro', events: 7, revenue: '€35.000' },
    ];

    return (
        <div>
            {/* Header */}
            <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-3">
                    <ChartBarIcon className="w-8 h-8 text-amber-500" />
                    <h1 className="text-3xl md:text-4xl font-bold text-stone-900">Statistiche & Report</h1>
                </div>
                <p className="mt-2 text-lg text-stone-600">
                    Monitora le performance del tuo business con i KPI principali.
                </p>
            </div>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Fatturato Medio / Evento" value="€6.465" icon={<CreditCardIcon className="w-6 h-6 text-green-500" />} subtext="+5% vs anno prec." />
                <StatCard title="Margine Lordo Complessivo" value="42%" icon={<ChartBarIcon className="w-6 h-6 text-blue-500" />} subtext="+2% vs anno prec." />
                <StatCard title="Eventi Totali (2024)" value="60" icon={<CalendarDaysIcon className="w-6 h-6 text-amber-500" />} />
                <StatCard title="Tipologia Top" value="Matrimoni" icon={<TagIcon className="w-6 h-6 text-purple-500" />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Events per Month */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-800 mb-4">Numero Eventi per Mese</h2>
                    <BarChart data={eventsPerMonthData} color="bg-amber-400" />
                </div>
                {/* Event Types */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-800 mb-4">Tipologia Eventi più Richiesti</h2>
                    <BarChart data={eventTypesData} color="bg-blue-400" />
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Cost Analysis */}
                 <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-800 mb-4">Analisi dei Costi per Menu</h2>
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-stone-500 uppercase bg-stone-50/70">
                            <tr>
                                <th scope="col" className="p-3 rounded-l-lg">Menu</th>
                                <th scope="col" className="p-3">Costo Piatto</th>
                                <th scope="col" className="p-3">Prezzo Vendita</th>
                                <th scope="col" className="p-3 rounded-r-lg">Margine</th>
                            </tr>
                        </thead>
                        <tbody>
                           {costAnalysisData.map((item, index) => (
                             <tr key={index} className="border-b border-stone-200/80 last:border-b-0">
                                <td className="p-3 font-semibold text-stone-800">{item.menu}</td>
                                <td className="p-3 text-stone-600">€{item.cost}</td>
                                <td className="p-3 text-stone-600">€{item.price}</td>
                                <td className="p-3 font-bold text-green-600">{item.margin}</td>
                             </tr>
                           ))}
                        </tbody>
                    </table>
                </div>

                {/* Sales by Channel */}
                <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                    <h2 className="text-lg font-semibold text-stone-800 mb-4">Report Vendite per Canale</h2>
                     <table className="w-full text-sm text-left">
                        <thead className="text-xs text-stone-500 uppercase bg-stone-50/70">
                            <tr>
                                <th scope="col" className="p-3 rounded-l-lg">Canale</th>
                                <th scope="col" className="p-3">N° Eventi</th>
                                <th scope="col" className="p-3 rounded-r-lg">Fatturato Totale</th>
                            </tr>
                        </thead>
                        <tbody>
                           {salesChannelData.map((item, index) => (
                             <tr key={index} className="border-b border-stone-200/80 last:border-b-0">
                                <td className="p-3 font-semibold text-stone-800">{item.channel}</td>
                                <td className="p-3 text-stone-600">{item.events}</td>
                                <td className="p-3 font-bold text-stone-800">{item.revenue}</td>
                             </tr>
                           ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Seasonal Forecasts */}
             <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-stone-200/80 shadow-sm">
                <h2 className="text-lg font-semibold text-stone-800 mb-2">Previsioni Stagionali</h2>
                <p className="text-sm text-stone-500">
                    Basato sullo storico degli anni precedenti, si prevede un picco di richieste per matrimoni nel periodo Maggio-Settembre, con una leggera flessione ad Agosto. Gli eventi aziendali mostrano una maggiore concentrazione nei mesi di Giugno e Dicembre. Si consiglia di preparare campagne marketing mirate per i periodi di bassa stagione (Gen-Mar).
                </p>
            </div>
        </div>
    );
};

export default StatisticsPage;