import react from "react";
import "../index.css";

export default function PokeCard({ pokemonData }) {
  const paddedId = pokemonData.id.toString().padStart(4, "0"); // Formatea el ID del Pokémon con ceros a la izquierda para que tenga 4 dígitos

  const typeColors = {
    fire: "bg-red-500",
    water: "bg-blue-500",
    grass: "bg-green-500",
    electric: "bg-yellow-400",
    poison: "bg-purple-500",
    flying: "bg-sky-400",
    bug: "bg-lime-500",
    normal: "bg-gray-400",
    psychic: "bg-pink-500",
    ground: "bg-yellow-600",
    rock: "bg-gray-600",
    ghost: "bg-purple-900",
    steel: "bg-gray-500",
    ice: "bg-cyan-400",
    fighting: "bg-amber-700",
    fairy: "bg-pink-300",
    dark: "bg-gray-900",
    dragon: "bg-indigo-500",
  };

  if (!pokemonData) {
    return <h1>Cargando...</h1>; // Si pokemonData es null o undefined, muestra un mensaje de carga
  }
  return (
    // Renderiza la tarjeta del Pokémon con su imagen, nombre e ID
    <div className="bg-white/10 font-bold p-4 rounded-lg border border-white/20 hover:scale-105 transition-transform cursor-pointer">
      <img
        src={pokemonData.sprites.front_default}
        alt="pokemon image"
        className="image   w-50 h-50 mx-auto mb-2  drop-shadow-xl/50 "
      />
      <div className="grid grid-cols-2 gap-2 mb-2">
        <p className="text-left text-size">N° {paddedId}</p>
        <p className="text-right text-size">
          {pokemonData.types.map((type) => {
            const typeName = type.type.name;
            const colorClass = typeColors[typeName];

            return (
              <span
                key={typeName}
                className={`${colorClass} text-white px-3 py-1 rounded-md text-sm`}>
                {typeName}
              </span>
            );
          })}
        </p>
      </div>
      <h1 className="text-2xl text-center ">{pokemonData.name}</h1>
    </div>
  );
}
