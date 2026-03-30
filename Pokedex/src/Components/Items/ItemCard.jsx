import React from "react";

const ItemCard = ({ item, onOpenModal }) => {
  // Blindaje preventivo: si no llega el ítem, no renderizamos
  if (!item) return null;

  // Acceso seguro a propiedades usando encadenamiento opcional (?.)
  const nombreEspañol =
    item.names?.find((n) => n.language?.name === "es")?.name ||
    item.name ||
    "Desconocido";

  const descripcion =
    item.effect_entries?.find((e) => e.language?.name === "es")?.short_effect ||
    item.flavor_text_entries?.find((f) => f.language?.name === "es")?.text ||
    "Sin descripción disponible.";

  const flavor =
    item.flavor_text_entries?.find((e) => e.language?.name === "es")?.text ||
    "";

  return (
    <div
      onClick={() => onOpenModal(item)}
      className="group relative p-5 rounded-[2rem] border border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl cursor-pointer flex flex-col items-center">
      {/* ID estilizado con seguridad */}
      <div className="absolute top-4 left-4 text-white/20 font-mono text-sm">
        #{item.id?.toString().padStart(3, "0") || "000"}
      </div>

      {/* Categoría con seguridad */}
      <div className="absolute top-4 right-4">
        <span className="text-[10px] uppercase tracking-widest text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/5">
          {item.category?.name?.replace("-", " ") || "item"}
        </span>
      </div>

      {/* Imagen con resplandor */}
      <div className="relative h-32 w-32 flex items-center justify-center mt-6 mb-4">
        <div className="absolute inset-0 blur-2xl opacity-20 bg-blue-500 rounded-full"></div>
        <img
          src={item.sprites?.default || "fallback-image-url.png"}
          alt={nombreEspañol}
          className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
        />
      </div>

      {/* Nombre y Precio con seguridad */}
      <h3 className="text-lg font-bold text-white capitalize tracking-tight group-hover:text-blue-400 transition-colors">
        {nombreEspañol}
      </h3>

      <p className="text-emerald-400 font-black text-xl mt-1">
        ₽ {item.cost?.toLocaleString() || "0"}
      </p>

      {/* Información oculta */}
      <div className="mt-4 flex gap-4 border-t border-white/5 pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="text-center">
          <p className="text-[10px] text-white/40 uppercase font-bold">
            Efecto
          </p>
          <p className="text-[10px] text-white/80 line-clamp-2 italic">
            {descripcion}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
