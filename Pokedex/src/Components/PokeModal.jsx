import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  ArrowRight,
  ShieldAlert,
  Zap,
  Ruler,
  Weight,
  Target,
  Heart,
  Sparkles,
  MapPin,
  BookOpen,
  Volume2,
  ShieldCheck,
  Swords,
  Brain,
  Star,
} from "lucide-react";

export default function PokeModal({ pokemon: initialPokemon, onClose }) {
  const [pokemon, setPokemon] = useState(initialPokemon);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(true);
  const [extraData, setExtraData] = useState({
    description: "",
    category: "",
    evolutionChain: [],
    typeEffort: { weak4x: [], weak2x: [], resists: [], immune: [] },
    moves: [],
    abilities: [],
    training: { happiness: 0, growth: "", exp: 0 },
  });

  // Bloqueo de scroll y limpieza
  useEffect(() => {
    fetchPokemonDetails(initialPokemon);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [initialPokemon]);

  const fetchPokemonDetails = async (targetPokemon) => {
    setLoading(true);
    try {
      const pRes = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${targetPokemon.name || targetPokemon}`,
      );
      const pData = await pRes.json();
      setPokemon(pData);
      const specRes = await fetch(pData.species.url);
      const specData = await specRes.json();

      const abilityPromises = pData.abilities.map(async (a) => {
        const res = await fetch(a.ability.url);
        const data = await res.json();
        const effect =
          data.flavor_text_entries.find((e) => e.language.name === "es")
            ?.flavor_text ||
          data.effect_entries.find((e) => e.language.name === "en")?.effect;
        return { name: a.ability.name, effect, isHidden: a.is_hidden };
      });

      const typePromises = pData.types.map((t) =>
        fetch(t.type.url).then((r) => r.json()),
      );
      const typeResults = await Promise.all(typePromises);
      let damageMap = {};
      typeResults.forEach((typeObj) => {
        typeObj.damage_relations.double_damage_from.forEach(
          (t) => (damageMap[t.name] = (damageMap[t.name] || 1) * 2),
        );
        typeObj.damage_relations.half_damage_from.forEach(
          (t) => (damageMap[t.name] = (damageMap[t.name] || 1) * 0.5),
        );
        typeObj.damage_relations.no_damage_from.forEach(
          (t) => (damageMap[t.name] = 0),
        );
      });

      const evoRes = await fetch(specData.evolution_chain.url);
      const evoData = await evoRes.json();
      let currentEvo = evoData.chain;
      const evoDetails = [];
      while (currentEvo) {
        const evoPRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${currentEvo.species.name}`,
        );
        const evoPData = await evoPRes.json();
        evoDetails.push({
          name: currentEvo.species.name,
          img: evoPData.sprites.other["official-artwork"].front_default,
          shinyImg: evoPData.sprites.other["official-artwork"].front_shiny,
        });
        currentEvo = currentEvo.evolves_to[0];
      }

      setExtraData({
        description:
          specData.flavor_text_entries
            .find((e) => e.language.name === "es")
            ?.flavor_text.replace(/\f/g, " ") || "",
        category:
          specData.genera.find((g) => g.language.name === "es")?.genus || "",
        evolutionChain: evoDetails,
        typeEffort: {
          weak4x: Object.keys(damageMap).filter((k) => damageMap[k] === 4),
          weak2x: Object.keys(damageMap).filter((k) => damageMap[k] === 2),
          resists: Object.keys(damageMap).filter(
            (k) => damageMap[k] === 0.5 || damageMap[k] === 0.25,
          ),
          immune: Object.keys(damageMap).filter((k) => damageMap[k] === 0),
        },
        moves: pData.moves
          .filter(
            (m) =>
              m.version_group_details[0].move_learn_method.name === "level-up",
          )
          .slice(0, 8),
        abilities: await Promise.all(abilityPromises),
        training: {
          happiness: specData.base_happiness,
          growth: specData.growth_rate.name,
          exp: pData.base_experience,
        },
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statNames = ["HP", "ATK", "DEF", "SPD", "SDEF", "SATK"];
  const stats = pokemon.stats.map((s) => s.base_stat);
  const dynamicMax = Math.max(160, ...stats);
  const angleStep = (Math.PI * 2) / 6;
  const centerX = 100;
  const centerY = 110;
  const radius = 60;
  const points = stats
    .map((val, i) => {
      const r = (val / dynamicMax) * radius;
      const x = centerX + r * Math.cos(i * angleStep - Math.PI / 2);
      const y = centerY + r * Math.sin(i * angleStep - Math.PI / 2);
      return `${x},${y}`;
    })
    .join(" ");

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

  // --- RENDERIZADO CON PORTAL ---
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 overflow-hidden isolate">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-3xl"
        onClick={onClose}></div>

      {/* Contenedor Modal */}
      <div className="relative z-[100000] bg-[#05080f] border border-white/10 w-full max-w-6xl max-h-[95vh] overflow-y-auto rounded-[3rem] shadow-2xl no-scrollbar">
        {/* Navbar Interna del Modal */}
        <nav className="sticky top-4 z-[110] mx-auto w-[95%] sm:w-[90%] nav-glass px-6 py-4 flex justify-between items-center shadow-2xl">
          <div className="flex items-center gap-2 sm:gap-6">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsShiny(!isShiny)}
                className={`p-2 sm:p-3 rounded-xl transition-all ${isShiny ? "bg-yellow-400 text-black shadow-[0_0_15px_#facc15]" : "bg-white/5 hover:bg-white/10 text-white"}`}>
                <Sparkles size={18} />
              </button>
              <button
                onClick={() => new Audio(pokemon.cries?.latest).play()}
                className="p-2 sm:p-3 rounded-xl bg-white/5 hover:bg-blue-500 text-blue-400 hover:text-white transition-all">
                <Volume2 size={18} />
              </button>
            </div>
            <div className="h-8 w-[1px] bg-white/10 hidden sm:block"></div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black capitalize text-white">
                {pokemon.name}
              </h2>
              <p className="text-[9px] font-bold text-blue-500 tracking-[0.2em] uppercase">
                {extraData.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all">
            <X size={24} />
          </button>
        </nav>

        {loading ? (
          <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-white">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs font-bold tracking-widest opacity-20 uppercase">
              Sincronizando datos...
            </p>
          </div>
        ) : (
          <div className="p-4 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 text-white">
            <div className="lg:col-span-4 space-y-6">
              <div className="relative group aspect-square flex items-center justify-center bg-white/5 rounded-[2.5rem] border border-white/5 overflow-hidden">
                <div
                  className={`absolute inset-0 blur-[100px] opacity-10 transition-all ${isShiny ? "bg-yellow-400" : "bg-blue-600"}`}></div>
                <img
                  src={
                    isShiny
                      ? pokemon.sprites.other["official-artwork"].front_shiny
                      : pokemon.sprites.other["official-artwork"].front_default
                  }
                  className="relative z-10 w-4/5 h-4/5 object-contain drop-shadow-2xl"
                  alt={pokemon.name}
                />
              </div>
              {/* Radar Chart SVG */}
              <div className="bg-white/5 p-4 rounded-[2.5rem] border border-white/5">
                <svg viewBox="0 0 200 230" className="w-full h-64">
                  <polygon
                    points={points}
                    fill={
                      isShiny ? "rgba(250,204,21,0.2)" : "rgba(59,130,246,0.2)"
                    }
                    stroke={isShiny ? "#facc15" : "#3b82f6"}
                    strokeWidth="3"
                  />
                  {statNames.map((name, i) => {
                    const x =
                      centerX +
                      (radius + 28) * Math.cos(i * angleStep - Math.PI / 2);
                    const y =
                      centerY +
                      (radius + 28) * Math.sin(i * angleStep - Math.PI / 2);
                    return (
                      <g key={name} className="font-black">
                        <text
                          x={x}
                          y={y}
                          fontSize="9"
                          fill="white"
                          textAnchor="middle"
                          className="opacity-30 uppercase">
                          {name}
                        </text>
                        <text
                          x={x}
                          y={y + 11}
                          fontSize="11"
                          fill={isShiny ? "#facc15" : "#3b82f6"}
                          textAnchor="middle">
                          {stats[i]}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-8">
              <p className="text-xl sm:text-2xl font-medium text-white/90 leading-relaxed italic border-l-4 border-blue-500 pl-6">
                "{extraData.description}"
              </p>

              {/* Entrenamiento Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                  <Brain size={16} className="mx-auto mb-2 text-pink-400" />
                  <p className="text-[9px] uppercase font-bold text-white/30">
                    Felicidad
                  </p>
                  <p className="text-lg font-black">
                    {extraData.training.happiness}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                  <Star size={16} className="mx-auto mb-2 text-yellow-400" />
                  <p className="text-[9px] uppercase font-bold text-white/30">
                    Exp. Base
                  </p>
                  <p className="text-lg font-black">{extraData.training.exp}</p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                  <Zap size={16} className="mx-auto mb-2 text-cyan-400" />
                  <p className="text-[9px] uppercase font-bold text-white/30">
                    Crecimiento
                  </p>
                  <p className="text-[11px] font-black uppercase">
                    {extraData.training.growth}
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-3xl border border-white/5 text-center">
                  <MapPin size={16} className="mx-auto mb-2 text-green-400" />
                  <p className="text-[9px] uppercase font-bold text-white/30">
                    Hábitat
                  </p>
                  <p className="text-[11px] font-black uppercase">
                    {extraData.habitat || "Desconocido"}
                  </p>
                </div>
              </div>

              {/* Habilidades */}
              <section className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/20">
                  Habilidades Especiales
                </h4>
                <div className="grid gap-3">
                  {extraData.abilities.map((a) => (
                    <div
                      key={a.name}
                      className="bg-white/5 p-5 rounded-3xl border border-white/5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="capitalize font-black text-blue-400 text-lg">
                          {a.name.replace("-", " ")}
                        </span>
                        {a.isHidden && (
                          <span className="text-[8px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold uppercase">
                            Oculta
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-white/50">{a.effect}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Evoluciones */}
              <section className="pt-8 border-t border-white/5">
                <div className="flex items-center justify-around bg-black/40 p-8 rounded-[3.5rem] border border-white/5">
                  {extraData.evolutionChain.map((evo, i) => (
                    <React.Fragment key={evo.name}>
                      <button
                        onClick={() => fetchPokemonDetails(evo.name)}
                        className={`group/evo transition-all ${evo.name === pokemon.name ? "scale-110" : "opacity-30 hover:opacity-100"}`}>
                        <div
                          className={`p-3 rounded-full mb-2 transition-all ${evo.name === pokemon.name ? "bg-blue-500" : "bg-white/5"}`}>
                          <img
                            src={isShiny ? evo.shinyImg : evo.img}
                            className="w-16 h-16 sm:w-24 sm:h-24 object-contain"
                            alt={evo.name}
                          />
                        </div>
                        <p className="text-[10px] capitalize font-black">
                          {evo.name}
                        </p>
                      </button>
                      {i < extraData.evolutionChain.length - 1 && (
                        <ArrowRight size={20} className="opacity-10" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
