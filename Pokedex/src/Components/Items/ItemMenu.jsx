import React, { useState } from "react";
import ItemBusqueda from "./ItemBusqueda";
import ItemFiltro from "./ItemFiltro";

import {
  ChevronDown,
  Settings2,
  Sparkles,
  Zap,
  Star,
  ShoppingBag,
  Dumbbell,
  FileText,
  MousePointer2,
  Box, // <--- ASEGÚRATE DE AGREGAR ESTO
} from "lucide-react";
export default function ItemMenu({
  searchTerm,
  setSearchTerm,
  allItems,
  onSelect,
  sortOrder,
  setSortOrder,
  selectedAttribute, // Basado en item.attributes
  setSelectedAttribute,
  minFlingPower, // Basado en item.fling_power
  setMinFlingPower,
  showOnlyWithCost, // Basado en item.cost
  setShowOnlyWithCost,
  maxCost, // <--- AGREGA ESTO
  setMaxCost,
}) {
  const [isOpen, setIsOpen] = useState(false);

  // Atributos reales que vienen en el arreglo de la API
  const attributes = [
    { id: "consumable", label: "Consumible", icon: <Zap size={14} /> },
    {
      id: "usable-in-battle",
      label: "Uso en Batalla",
      icon: <MousePointer2 size={14} />,
    },
    { id: "holdable", label: "Equipable", icon: <Dumbbell size={14} /> },
    { id: "usable-overworld", label: "Uso Externo", icon: <Box size={14} /> },
  ];

  return (
    <div className="mb-10 relative">
      {/* BARRA PRINCIPAL */}
      <div className="relative z-50 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="w-full lg:flex-1 relative z-[60]">
          <ItemBusqueda
            value={searchTerm}
            onChange={setSearchTerm}
            allItems={allItems}
            onSelect={onSelect}
          />
        </div>

        <div className="flex items-center gap-4 w-full lg:w-auto relative z-50">
          <ItemFiltro sortOrder={sortOrder} setSortOrder={setSortOrder} />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-all ${
              isOpen
                ? "bg-yellow-400 text-black shadow-lg"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}>
            <Settings2 size={20} />
            <span className="hidden sm:inline">Opciones</span>
            <ChevronDown
              size={18}
              className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </div>

      {/* PANEL AVANZADO MULTI-DATA */}
      <div
        className={`relative z-40 transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px] opacity-100 mt-4" : "max-h-0 opacity-0 pointer-events-none"}`}>
        <div className="p-8 bg-gray-900/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
            {/* 1. FILTRO POR ATRIBUTOS (item.attributes) */}
            <div className="space-y-4">
              <h3 className="text-yellow-400 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} /> Propiedades del Objeto
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedAttribute("all")}
                  className={`px-3 py-2 rounded-lg text-[10px] font-black uppercase border transition-all ${
                    selectedAttribute === "all"
                      ? "bg-white text-black"
                      : "border-white/10 text-white hover:bg-white/10"
                  }`}>
                  Todos
                </button>
                {attributes.map((attr) => (
                  <button
                    key={attr.id}
                    onClick={() => setSelectedAttribute(attr.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-black uppercase border transition-all 
                    ${selectedAttribute === attr.id ? "bg-blue-600 border-blue-400 text-white" : "border-white/5 text-gray-400 hover:border-white/20"}`}>
                    {attr.icon} {attr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. FILTRO POR FLING POWER (item.fling_power) */}
            <div className="space-y-4 border-l border-white/5 pl-0 md:pl-8">
              <h3 className="text-yellow-400 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Dumbbell size={16} /> Poder de Lanzamiento
              </h3>
              <input
                type="range"
                min="0"
                max="130"
                step="10"
                value={minFlingPower}
                onChange={(e) => setMinFlingPower(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-yellow-400"
              />
              <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                <span>Min: 0</span>
                <span className="text-blue-400">
                  Actual: {minFlingPower} BP
                </span>
                <span>Max: 130</span>
              </div>
            </div>

            <div className="space-y-4 border-l border-white/5 pl-0 xl:pl-8">
              <h3 className="text-yellow-400 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <ShoppingBag size={16} /> Rango de Precio (P$)
              </h3>

              <input
                type="range"
                min="0"
                max="5000" // Ajusta este max según el ítem más caro de tu lista
                step="100"
                value={maxCost}
                onChange={(e) => setMaxCost(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />

              <div className="flex justify-between items-center">
                <div className="text-[10px] font-bold text-gray-500 uppercase">
                  0 P$
                </div>
                <div className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black border border-emerald-500/30">
                  Hasta: {maxCost} P$
                </div>
              </div>

              <p className="text-[9px] text-gray-600 italic">
                * Filtra objetos cuyo costo en tienda sea igual o menor al valor
                seleccionado.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
