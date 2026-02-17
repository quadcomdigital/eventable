
import React, { useState, useRef, useEffect } from 'react';
import type { Table } from '../types';

interface FloorPlanProps {
    tables: Table[];
    onTableMove: (id: number, x: number, y: number) => void;
    onTableSelect: (table: Table) => void;
    floorPlanData: { image: string | null; aspectRatio: number | null };
    isDraggable: boolean;
}

const tableColorMap: { [key: string]: string } = {
    'Tavolo Sposi': 'bg-yellow-400 border-yellow-600',
    'Ospiti Sposa': 'bg-pink-300 border-pink-500',
    'Ospiti Sposo': 'bg-blue-300 border-blue-500',
    'Ospiti Misti': 'bg-amber-300 border-amber-500',
    'Tavolo Band/Staff': 'bg-stone-400 border-stone-600',
};


const FloorPlan: React.FC<FloorPlanProps> = ({ tables, onTableMove, onTableSelect, floorPlanData, isDraggable }) => {
    const { image, aspectRatio } = floorPlanData;
    const [draggingTable, setDraggingTable] = useState<{ id: number; offsetX: number; offsetY: number } | null>(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [panStart, setPanStart] = useState({ x: 0, y: 0 });
    const floorPlanRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Calculate min zoom to fit content on screen
    const minZoom = 0.5;
    const maxZoom = 3;

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, table: Table) => {
        if (!isDraggable || !floorPlanRef.current) return;
        
        e.stopPropagation();
        
        const tableRect = e.currentTarget.getBoundingClientRect();
        
        // Calculate offset in pixels from the top-left of the table element
        const offsetX = e.clientX - tableRect.left;
        const offsetY = e.clientY - tableRect.top;

        setDraggingTable({
            id: table.id,
            offsetX: offsetX,
            offsetY: offsetY,
        });
        e.preventDefault();
    };

    const handleContainerMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isDraggable || draggingTable) return;
        
        e.stopPropagation();
        setIsPanning(true);
        setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    };

    const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isPanning && !isDraggable) {
            setPan({
                x: e.clientX - panStart.x,
                y: e.clientY - panStart.y,
            });
        } else if (draggingTable && floorPlanRef.current && isDraggable) {
            handleMouseMove(e);
        }
    };

    const handleContainerMouseUp = () => {
        setIsPanning(false);
        setDraggingTable(null);
    };
    
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingTable || !floorPlanRef.current || !isDraggable) return;

        const floorPlanRect = floorPlanRef.current.getBoundingClientRect();
        
        // Calculate the new top-left position of the table in pixels
        let newX_px = e.clientX - floorPlanRect.left - draggingTable.offsetX;
        let newY_px = e.clientY - floorPlanRect.top - draggingTable.offsetY;

        // Get table dimensions in pixels for boundary checks
        const tableElement = e.currentTarget.querySelector(`[data-table-id='${draggingTable.id}']`) as HTMLDivElement;
        if (!tableElement) return;

        const tableWidth_px = tableElement.offsetWidth;
        const tableHeight_px = tableElement.offsetHeight;

        // Clamp pixel values within the floor plan boundaries
        newX_px = Math.max(0, Math.min(newX_px, floorPlanRect.width - tableWidth_px));
        newY_px = Math.max(0, Math.min(newY_px, floorPlanRect.height - tableHeight_px));

        // Convert clamped pixel position back to percentage
        const newX_pct = newX_px / floorPlanRect.width;
        const newY_pct = newY_px / floorPlanRect.height;
        
        onTableMove(draggingTable.id, newX_pct, newY_pct);
    };
    
    const handleMouseUp = () => {
        setDraggingTable(null);
    };

    const handleZoom = (direction: 'in' | 'out') => {
        setZoom(prev => {
            let newZoom = direction === 'in' ? prev * 1.2 : prev / 1.2;
            newZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
            return newZoom;
        });
    };

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if (!e.ctrlKey && !e.metaKey) return;
        
        e.preventDefault();
        const direction = e.deltaY < 0 ? 'in' : 'out';
        handleZoom(direction);
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>, table: Table) => {
        // Prevent select on drag end
        if (e.detail > 0) { // A crude way to distinguish click from drag-release
             onTableSelect(table);
        }
    }

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Zoom Controls */}
            <div className="flex gap-2 items-center bg-white p-2 rounded-lg border border-stone-200 w-fit">
                <button
                    onClick={() => handleZoom('out')}
                    className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-md transition-colors font-bold text-lg"
                    title="Rimpicciolisci (Ctrl+Rotellina)"
                >
                    −
                </button>
                <span className="text-sm font-semibold text-stone-700 min-w-12 text-center">
                    {Math.round(zoom * 100)}%
                </span>
                <button
                    onClick={() => handleZoom('in')}
                    className="p-1.5 text-stone-600 hover:bg-stone-100 rounded-md transition-colors font-bold text-lg"
                    title="Ingrandisci (Ctrl+Rotellina)"
                >
                    +
                </button>
                <button
                    onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
                    className="ml-2 px-2 py-1.5 text-xs bg-amber-400 text-white hover:bg-amber-500 rounded-md transition-colors font-semibold"
                    title="Ripristina vista"
                >
                    Ripristina
                </button>
                <p className="ml-4 text-xs text-stone-500">
                    {isDraggable ? '✋ Trascina tavoli' : '🖱️ Trascina per muoverti'}
                </p>
            </div>

            {/* Floor Plan Container with Zoom & Pan */}
            <div
                ref={containerRef}
                className="w-full bg-stone-50 rounded-lg border-2 border-stone-300 overflow-hidden relative"
                style={{
                    aspectRatio: aspectRatio ? `${aspectRatio}` : '16 / 9',
                    maxHeight: '70vh',
                    cursor: isDraggable ? (draggingTable ? 'grabbing' : 'grab') : (isPanning ? 'grabbing' : 'grab'),
                }}
                onMouseDown={handleContainerMouseDown}
                onMouseMove={handleContainerMouseMove}
                onMouseUp={handleContainerMouseUp}
                onMouseLeave={handleContainerMouseUp}
                onWheel={handleWheel}
            >
                <div
                    ref={floorPlanRef}
                    className="w-full h-full bg-stone-100 rounded-lg border-2 border-dashed border-stone-300 relative origin-top-left transition-transform"
                    style={{
                        backgroundImage: image ? `url(${image})` : 'none',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                        transformOrigin: 'top left',
                    }}
                >
            {tables.map(table => {
                const isDragging = draggingTable?.id === table.id;
                const colorClasses = tableColorMap[table.type] || 'bg-gray-300 border-gray-500';
                const colorClassBg = colorClasses.split(' ')[0];
                
                return (
                    <div
                        key={table.id}
                        data-table-id={table.id}
                        className={`absolute group select-none ${isDraggable ? 'cursor-grab' : 'cursor-pointer'} ${isDragging ? 'z-10 scale-105' : ''}`}
                        style={{ 
                            left: `${table.x * 100}%`, 
                            top: `${table.y * 100}%`,
                            width: '3.8%',
                            aspectRatio: '1 / 1',
                            touchAction: 'none' 
                        }}
                        onMouseDown={isDraggable ? (e) => handleMouseDown(e, table) : undefined}
                        onClick={(e) => handleClick(e, table)}
                    >
                        {/* Ping animation element */}
                        {!isDragging && <span className={`absolute inline-flex h-full w-full rounded-full ${colorClassBg} opacity-75 animate-ping`}></span>}
                        
                        {/* Visible dot element */}
                        <div
                            className={`relative flex items-center justify-center w-full h-full rounded-full border-2 shadow-md group-hover:shadow-lg transition-all ${colorClasses}`}
                        >
                            <span className="text-stone-900 font-bold text-[10px]">
                                {table.capacity}
                            </span>
                        </div>
                    </div>
                );
            })}
             {tables.length === 0 && !image && (
                <div className="absolute inset-0 flex items-center justify-center text-stone-400 -z-10 pointer-events-none">
                    <p className="bg-white/70 px-4 py-2 rounded-lg">Carica una piantina e aggiungi un tavolo per iniziare</p>
                </div>
             )}
                </div>
            </div>
        </div>
    );
};

export default FloorPlan;
