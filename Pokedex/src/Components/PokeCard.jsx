import React, { useState } from "react";
import { Sparkles, Volume2 } from "lucide-react";
import "../index.css";

export default function PokeCard({ pokemonData, onClick }) {
  const [isShiny, setIsShiny] = useState(false);

  if (!pokemonData) return null;

  const playCry = (e) => {
    e.stopPropagation();
    const audioUrl = pokemonData.cries?.latest || pokemonData.cries?.legacy;
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.volume = 0.3;
      audio.play();
    }
  };

  const paddedId = pokemonData.id.toString().padStart(4, "0");
  const artwork = pokemonData.sprites.other["official-artwork"];
  const imageUrl = isShiny
    ? artwork.front_shiny || pokemonData.sprites.front_shiny
    : artwork.front_default || pokemonData.sprites.front_default;

  const typeColors = {
    fire: "bg-orange-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-400",
    poison: "bg-purple-500",
    flying: "bg-sky-400",
    bug: "bg-lime-500",
    normal: "bg-gray-400",
    psychic: "bg-pink-500",
    ground: "bg-yellow-700",
    rock: "bg-stone-600",
    ghost: "bg-indigo-900",
    steel: "bg-slate-500",
    ice: "bg-cyan-300",
    fighting: "bg-red-800",
    fairy: "bg-pink-300",
    dark: "bg-zinc-800",
    dragon: "bg-violet-600",
  };

  const isLegendary = pokemonData.is_legendary;
  const cardStyles = isLegendary
    ? "border-yellow-400/50 shadow-[0_0_20px_rgba(250,204,21,0.2)] bg-gradient-to-b from-white/10 to-yellow-500/10"
    : "border-white/10 bg-white/5";

  return (
    <div
      onClick={onClick}
      className={`group relative p-5 rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer ${cardStyles}`}>
      <div className="absolute top-12 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsShiny(!isShiny);
          }}
          className={`p-2 rounded-full border transition-all ${
            isShiny
              ? "bg-yellow-400 border-yellow-200 text-black shadow-[0_0_10px_#facc15]"
              : "bg-white/10 border-white/20 text-white/50 hover:text-white"
          }`}
          title="Modo Shiny">
          <Sparkles size={14} fill={isShiny ? "currentColor" : "none"} />
        </button>

        <button
          onClick={playCry}
          className="p-2 rounded-full bg-white/10 border border-white/20 text-white/50 hover:text-white hover:bg-blue-500 transition-all"
          title="Escuchar grito">
          <Volume2 size={14} />
        </button>
      </div>

      {isLegendary && (
        <div className="absolute -top-3 -right-3 bg-yellow-400 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg z-10 animate-pulse">
          LEGENDARY
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <span className="text-white/40 font-mono text-sm">#{paddedId}</span>
        <div className="flex flex-wrap gap-1 justify-end">
          {pokemonData.types.map((t) => (
            <span
              key={t.type.name}
              className={`${typeColors[t.type.name]} text-[10px] uppercase tracking-tighter text-white px-2 py-0.5 rounded-md shadow-sm`}>
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
      <div className="relative h-40 flex items-center justify-center mb-4">
        <div
          className={`absolute inset-0 blur-3xl opacity-20 rounded-full ${typeColors[pokemonData.types[0].type.name]}`}></div>
        <img
          src={imageUrl}
          alt={pokemonData.name}
          className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
          style={{
            filter: isShiny
              ? "drop-shadow(0 0 10px rgba(255,255,255,0.5))"
              : "drop-shadow(0 12px 12px rgba(0,0,0,0.5))",
            willChange: "filter",
          }}
        />
      </div>

      <h3 className="text-xl text-center font-black capitalize tracking-tight group-hover:text-blue-400 transition-colors">
        {pokemonData.name}
      </h3>

      <div className="mt-4 flex justify-around border-t border-white/5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center">
          <p className="text-[10px] text-white/40 uppercase font-bold">HP</p>
          <p className="text-xs text-white/80">
            {pokemonData.stats[0].base_stat}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-white/40 uppercase font-bold">Atk</p>
          <p className="text-xs text-white/80">
            {pokemonData.stats[1].base_stat}
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] text-white/40 uppercase font-bold">Def</p>
          <p className="text-xs text-white/80">
            {pokemonData.stats[2].base_stat}
          </p>
        </div>
      </div>
    </div>
  );
}
