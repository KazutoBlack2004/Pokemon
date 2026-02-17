import React, { useState } from "react";
import PokeFiltro from "./PokeFiltro";
import PokeBusqueda from "./PokeBusqueda";
import {
  ChevronDown,
  Settings2,
  Sparkles,
  Star,
  BarChart3,
} from "lucide-react";

export default function PokeMenu({
  searchTerm,
  setSearchTerm,
  allPokemons,
  fetchPokemonByName,
  sortOrder,
  setSortOrder,
  selectedType,
  setSelectedType,
  sortStat,
  setSortStat,
  isLegendary,
  setIsLegendary,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const types = [
    "normal",
    "fire",
    "water",
    "grass",
    "electric",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  const stats = [
    { id: "hp", label: "Vida" },
    { id: "attack", label: "Ataque" },
    { id: "defense", label: "Defensa" },
    { id: "speed", label: "Velocidad" },
  ];

  return (
    <div className="mx-[5%] md:mx-[10%] mb-10 relative">
      {/* BARRA PRINCIPAL
       */}
      <div className="relative z-50 p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* CONTENEDOR DE BÚSQUEDA */}
        <div className="w-full lg:flex-1 relative z-[60]">
          <PokeBusqueda
            value={searchTerm}
            onChange={setSearchTerm}
            allPokemons={allPokemons}
            onSelect={fetchPokemonByName}
          />
        </div>
        <div className="flex items-center gap-4 w-full lg:w-auto relative z-50">
          <PokeFiltro sortOrder={sortOrder} setSortOrder={setSortOrder} />
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
      {/* PANEL AVANZADO */}
      <div
        className={`relative z-40 overflow-visible transition-all duration-500 ease-in-out ${
          isOpen
            ? "max-h-[800px] opacity-100 mt-4"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}>
        <div className="p-8 bg-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
            {/* 1. Filtro por Tipo */}
            <div className="space-y-4">
              <h3 className="text-yellow-400 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={16} /> Tipos Elementales
              </h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedType("all")}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all ${
                    selectedType === "all"
                      ? "bg-white text-black"
                      : "border-white/10 text-white hover:bg-white/10"
                  }`}>
                  Todos
                </button>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all 
                    ${selectedType === type ? "bg-blue-600 border-blue-400 text-white" : "border-white/5 text-gray-400 hover:border-white/20"}`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
            {/* 2. Filtro por Estadísticas */}
            <div className="space-y-4 border-l border-white/5 pl-0 xl:pl-8">
              <h3 className="text-yellow-400 text-sm font-black uppercase tracking-widest flex items-center gap-2">
                <BarChart3 size={16} /> Ordenar por Stat
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {stats.map((stat) => (
                  <button
                    key={stat.id}
                    onClick={() =>
                      setSortStat(sortStat === stat.id ? null : stat.id)
                    }
                    className={`px-4 py-3 rounded-xl text-xs font-bold transition-all border ${
                      sortStat === stat.id
                        ? "bg-white text-black border-white"
                        : "bg-white/5 border-white/10 text-white hover:bg-white/10"
                    }`}>
                    {stat.label}
                  </button>
                ))}
              </div>
              {sortStat && (
                <p className="text-[10px] text-blue-400 font-bold animate-pulse uppercase">
                  Mostrando los más fuertes en {sortStat}
                </p>
              )}
            </div>

            {/* 3. Filtro por Rareza */}
            <div className="space-y-4 border-l border-white/5 pl-0 xl:pl-8 flex flex-col justify-between">
              <div>
                <h3 className="text-yellow-400 text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-4">
                  <Star size={16} /> Rareza Especial
                </h3>
                <button
                  onClick={() => setIsLegendary(!isLegendary)}
                  className={`w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-3 border-2 ${
                    isLegendary
                      ? "bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 border-none text-black shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                      : "border-dashed border-white/20 text-gray-400 hover:border-white/40 hover:text-white"
                  }`}>
                  {isLegendary
                    ? "MODO LEGENDARIO ACTIVO"
                    : "Mostrar Legendarios"}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 leading-relaxed italic">
                * Filtro global basado en especies míticas y legendarias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
