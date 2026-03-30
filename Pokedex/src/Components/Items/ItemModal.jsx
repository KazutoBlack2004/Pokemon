import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom"; // <--- Esta es la línea que te falta
import { X, BookOpen, Tag, Package, Star, Calendar } from "lucide-react";

export default function ItemModal({ item, onClose }) {
  // Guardia defensiva: Si 'item' no existe o le falta la propiedad, no renderizamos
  if (!item || !item.id) return null;
  // 1. Datos básicos
  const nombreEspañol =
    item.names?.find((n) => n.language.name === "es")?.name || item.name;

  // 2. Filtros de seguridad (Solo extraer si existe)
  const descripcion =
    item.flavor_text_entries?.find((f) => f.language.name === "es")?.text ||
    "Sin descripción.";
  const efectoLargo = item.effect_entries?.find(
    (e) => e.language.name === "en",
  )?.effect;

  useEffect(() => {}, [item]);
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 overflow-hidden isolate">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
        onClick={onClose}></div>

      <div className="relative z-[100000] bg-[#05080f] border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl no-scrollbar">
        {/* Header */}
        <nav className="sticky top-0 z-[110] bg-[#05080f]/80 backdrop-blur-md px-8 py-6 flex justify-between items-center border-b border-white/5">
          <div>
            <h2 className="text-2xl font-black capitalize text-white">
              {nombreEspañol}
            </h2>
            <p className="text-[10px] font-bold text-blue-500 tracking-[0.2em] uppercase">
              #{item.id.toString().padStart(3, "0")} •{" "}
              {item.category?.name?.replace("-", " ")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-red-500 text-white rounded-xl transition-all">
            <X size={24} />
          </button>
        </nav>

        <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Columna Izquierda */}
          <div className="md:col-span-4 flex flex-col items-center gap-6">
            <div className="w-full aspect-square bg-white/5 rounded-[2.5rem] border border-white/5 flex items-center justify-center">
              <img
                src={item.sprites.default}
                alt={nombreEspañol}
                className="w-3/4 object-contain"
              />
            </div>
            {item.cost > 0 && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full text-emerald-400 font-black text-xl">
                ₽ {item.cost.toLocaleString()}
              </div>
            )}
          </div>

          {/* Columna Derecha */}
          <div className="md:col-span-8 space-y-8">
            <p className="text-lg text-white/70 italic border-l-4 border-blue-500 pl-6">
              "{descripcion}"
            </p>

            {/* Grid dinámico */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <PropertyCard
                label="Consumible"
                value={
                  item.attributes?.some((a) => a.name === "consumable")
                    ? "Sí"
                    : "No"
                }
              />
              {item.fling_power && (
                <PropertyCard
                  label="Potencia Lanzar"
                  value={item.fling_power}
                />
              )}
              {item.baby_trigger_for && (
                <PropertyCard label="Evolutivo" value="Sí" />
              )}
            </div>

            {/* Efectos y Datos técnicos */}
            {efectoLargo && (
              <section className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <h4 className="text-[10px] font-black uppercase text-blue-400 mb-2">
                  Efecto en combate
                </h4>
                <p className="text-sm text-white/60">{efectoLargo}</p>
              </section>
            )}

            {/* Generaciones */}
            <section>
              <h4 className="text-xs font-black uppercase tracking-widest text-white/20 mb-4 flex items-center gap-2">
                <Calendar size={14} /> Generaciones de aparición
              </h4>
              <div className="flex flex-wrap gap-2">
                {item.game_indices?.map((g, i) => (
                  <span
                    key={i}
                    className="bg-white/5 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white/50 border border-white/5">
                    {g.generation?.name.replace("-", " ")}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
// Asegúrate de que esté justo al final del archivo, fuera de la función principal
function PropertyCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 p-4 rounded-3xl border border-white/5">
      <div className="flex items-center gap-2 text-white/30 mb-2">
        {icon} <span className="text-[9px] uppercase font-bold">{label}</span>
      </div>
      <p className="text-lg font-black capitalize">{value}</p>
    </div>
  );
}
