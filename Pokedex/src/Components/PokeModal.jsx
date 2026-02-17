import React, { useEffect, useState } from "react";
import { X, ArrowRight, ShieldAlert, Zap } from "lucide-react";

export default function PokeModal({ pokemon, onClose }) {
  const [evolutions, setEvolutions] = useState([]);
  const [damageRelations, setDamageRelations] = useState({
    weaknesses: [],
    resistances: [],
  });

  useEffect(() => {
    const fetchDetailedData = async () => {
      try {
        const typePromises = pokemon.types.map((t) =>
          fetch(t.type.url).then((r) => r.json()),
        );
        const typeData = await Promise.all(typePromises);

        let weak = new Set();
        let res = new Set();

        typeData.forEach((d) => {
          d.damage_relations.double_damage_from.forEach((t) =>
            weak.add(t.name),
          );
          d.damage_relations.half_damage_from.forEach((t) => res.add(t.name));
        });

        setDamageRelations({
          weaknesses: Array.from(weak),
          resistances: Array.from(res),
        });

        const specRes = await fetch(pokemon.species.url);
        const specData = await specRes.json();
        const evoRes = await fetch(specData.evolution_chain.url);
        const evoData = await evoRes.json();

        let currentEvo = evoData.chain;
        const evoDetails = [];

        while (currentEvo) {
          const pRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${currentEvo.species.name}`,
          );
          const pData = await pRes.json();

          evoDetails.push({
            name: currentEvo.species.name,
            img:
              pData.sprites.other["official-artwork"].front_default ||
              pData.sprites.front_default,
          });
          currentEvo = currentEvo.evolves_to[0];
        }
        setEvolutions(evoDetails);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetailedData();
  }, [pokemon]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-[#0f172a] border border-white/10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-[3rem] relative p-6 md:p-10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">
          <X size={32} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full"></div>
              <img
                src={pokemon.sprites.other["official-artwork"].front_default}
                className="relative z-10 w-64 h-64 mx-auto drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]"
                alt={pokemon.name}
              />
            </div>
            <h2 className="text-5xl font-black capitalize text-white mt-6 tracking-tighter">
              {pokemon.name}
            </h2>
            <p className="text-white/20 font-mono mt-2 text-xl italic">
              N° {pokemon.id.toString().padStart(4, "0")}
            </p>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-red-400 font-black uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
                <ShieldAlert size={16} /> Debilidades (x2)
              </h4>
              <div className="flex flex-wrap gap-2">
                {damageRelations.weaknesses.map((w) => (
                  <span
                    key={w}
                    className="bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1 rounded-xl text-[10px] font-bold uppercase">
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-blue-400 font-black uppercase text-xs tracking-[0.2em] mb-4 flex items-center gap-2">
                <Zap size={16} /> Cadena Evolutiva
              </h4>
              <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[2rem] overflow-x-auto border border-white/5">
                {evolutions.map((evo, i) => (
                  <React.Fragment key={evo.name}>
                    <div className="flex-shrink-0 text-center group/evo">
                      <img
                        src={evo.img}
                        className="w-16 h-16 mx-auto drop-shadow-md group-hover/evo:scale-110 transition-transform"
                        alt={evo.name}
                      />
                      <p className="text-[10px] capitalize text-white/40 mt-1 font-bold tracking-tight">
                        {evo.name}
                      </p>
                    </div>
                    {i < evolutions.length - 1 && (
                      <ArrowRight
                        size={16}
                        className="text-white/10 flex-shrink-0"
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
