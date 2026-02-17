import { useEffect, useRef, useState } from "react";
import PokeCard from "../Components/PokeCard";
import PokeMenu from "../Components/PokeMenu";
import PokeModal from "../Components/PokeModal";

const LIMIT = 20;

function PokemonExplorer() {
  const [allPokemons, setAllPokemons] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("id");
  const [selectedType, setSelectedType] = useState("all");
  const [sortStat, setSortStat] = useState(null);
  const [isLegendary, setIsLegendary] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const pokemonCache = useRef({});

  // 1. Carga de la lista maestra
  useEffect(() => {
    const fetchMasterList = async () => {
      try {
        const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1300");
        const data = await res.json();
        const masterList = data.results.map((p) => {
          const id = p.url.split("/").filter(Boolean).pop();
          return { ...p, id: parseInt(id), name: p.name };
        });
        setAllPokemons(masterList);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMasterList();
  }, []);

  // 2. Lógica de filtrado y ordenamiento
  useEffect(() => {
    const applyFilters = async () => {
      setLoading(true);
      let result = [...allPokemons];

      if (selectedType !== "all") {
        try {
          const res = await fetch(
            `https://pokeapi.co/api/v2/type/${selectedType}`,
          );
          const data = await res.json();
          const typeNames = data.pokemon.map((p) => p.pokemon.name);
          result = result.filter((p) => typeNames.includes(p.name));
        } catch (err) {
          console.error(err);
        }
      }

      if (searchTerm) {
        result = result.filter((p) =>
          p.name.includes(searchTerm.toLowerCase()),
        );
      }

      if (sortStat || isLegendary) {
        const candidates = result.slice(0, 150);
        await Promise.all(
          candidates.map(async (p) => {
            if (!pokemonCache.current[p.name]) {
              try {
                const [resP, resS] = await Promise.all([
                  fetch(p.url),
                  fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}/`),
                ]);
                const data = await resP.json();
                const spec = resS.ok ? await resS.json() : {};
                pokemonCache.current[p.name] = {
                  ...data,
                  is_legendary: spec.is_legendary || spec.is_mythical || false,
                };
              } catch (e) {
                console.error(e);
              }
            }
          }),
        );

        if (isLegendary) {
          result = result.filter(
            (p) => pokemonCache.current[p.name]?.is_legendary,
          );
        }

        if (sortStat) {
          result.sort((a, b) => {
            const valA =
              pokemonCache.current[a.name]?.stats.find(
                (s) => s.stat.name === sortStat,
              )?.base_stat || 0;
            const valB =
              pokemonCache.current[b.name]?.stats.find(
                (s) => s.stat.name === sortStat,
              )?.base_stat || 0;
            return valB - valA;
          });
        }
      } else {
        result.sort((a, b) => {
          if (sortOrder === "az") return a.name.localeCompare(b.name);
          if (sortOrder === "za") return b.name.localeCompare(a.name);
          return a.id - b.id;
        });
      }

      setFilteredList(result);
      setTotalPages(Math.ceil(result.length / LIMIT));
      setCurrentPage(1);
      setLoading(false);
    };

    if (allPokemons.length > 0) applyFilters();
  }, [searchTerm, sortOrder, selectedType, sortStat, isLegendary, allPokemons]);

  // 3. Carga de detalles para la página actual
  useEffect(() => {
    const fetchCurrentPage = async () => {
      if (filteredList.length === 0) {
        setPokemons([]);
        return;
      }
      const start = (currentPage - 1) * LIMIT;
      const pageItems = filteredList.slice(start, start + LIMIT);
      const details = await Promise.all(
        pageItems.map(async (p) => {
          if (pokemonCache.current[p.name]) return pokemonCache.current[p.name];
          const [resP, resS] = await Promise.all([
            fetch(p.url),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${p.id}/`),
          ]);
          const data = await resP.json();
          const spec = resS.ok ? await resS.json() : {};
          const full = {
            ...data,
            is_legendary: spec.is_legendary || spec.is_mythical || false,
          };
          pokemonCache.current[p.name] = full;
          return full;
        }),
      );
      setPokemons(details);
    };
    fetchCurrentPage();
  }, [currentPage, filteredList]);

  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="relative z-10 pb-20">
      <header className="pt-12 pb-6 flex flex-col items-center">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          Poké<span className="text-blue-500">dex</span>
        </h1>
      </header>

      <PokeMenu
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        allPokemons={allPokemons}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortStat={sortStat}
        setSortStat={setSortStat}
        isLegendary={isLegendary}
        setIsLegendary={setIsLegendary}
      />

      <main className="px-[5%] md:px-[10%] mt-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-blue-500">
            <div className="w-12 h-12 border-4 border-current border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-bold animate-pulse text-sm tracking-widest uppercase text-center">
              Sincronizando base de datos...
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {pokemons.map((pokemon) => (
                <PokeCard
                  key={pokemon.id}
                  pokemonData={pokemon}
                  onClick={() => setSelectedPokemon(pokemon)}
                />
              ))}
            </div>

            {pokemons.length === 0 && (
              <div className="text-center py-20 opacity-50">
                <p className="text-xl font-bold uppercase tracking-tight">
                  Sin resultados
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-20">
                <button
                  disabled={currentPage === 1}
                  onClick={() => {
                    setCurrentPage((p) => p - 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-20 transition backdrop-blur-sm">
                  Anterior
                </button>
                <div className="flex gap-2">
                  {getPageNumbers().map((n) => (
                    <button
                      key={n}
                      onClick={() => {
                        setCurrentPage(n);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                      className={`w-10 h-10 rounded-lg font-bold transition ${n === currentPage ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)]" : "bg-white/5 hover:bg-white/10 backdrop-blur-sm"}`}>
                      {n}
                    </button>
                  ))}
                </div>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => {
                    setCurrentPage((p) => p + 1);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-20 transition backdrop-blur-sm">
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedPokemon && (
        <PokeModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}

export default PokemonExplorer;
