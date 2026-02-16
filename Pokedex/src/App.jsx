import { useEffect, useRef, useState } from "react";
import PokeCard from "./Components/PokeCard";
import PokeBusqueda from "./Components/PokeBusqueda";
import PokeFiltro from "./Components/PokeFiltro";
import "./index.css";

const LIMIT = 20;

function App() {
  // Pokémon visibles (cards)
  const [pokemons, setPokemons] = useState([]);

  // Lista base SOLO nombres (para búsqueda)
  const [allPokemons, setAllPokemons] = useState([]);

  // Paginación API
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // UI
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Cache simple (name → pokemon)
  const pokemonCache = useRef({});

  // ===============================
  // Cargar lista completa (1 sola vez)
  // ===============================
  useEffect(() => {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=1300")
      .then((res) => res.json())
      .then((data) => setAllPokemons(data.results))
      .catch(console.error);
  }, []);

  // ===============================
  // Paginación clásica
  // ===============================
  const fetchPokemonsPage = async (url) => {
    try {
      setLoading(true);

      const response = await fetch(url);
      const data = await response.json();

      setTotalPages(Math.ceil(data.count / LIMIT));
      setNextPage(data.next);
      setPrevPage(data.previous);

      const offset = new URL(url).searchParams.get("offset") || 0;
      setCurrentPage(Number(offset) / LIMIT + 1);

      const details = await Promise.all(
        data.results.map((p) => fetch(p.url).then((r) => r.json())),
      );

      setPokemons(details);
    } catch (error) {
      console.error("Error cargando Pokémon:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Buscar Pokémon por nombre (con cache)
  // ===============================
  const fetchPokemonByName = async (name) => {
    const key = name.toLowerCase();

    if (pokemonCache.current[key]) {
      setPokemons([pokemonCache.current[key]]);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${key}`);

      if (!res.ok) return;

      const data = await res.json();
      pokemonCache.current[key] = data;
      setPokemons([data]);

      setNextPage(null);
      setPrevPage(null);
      setTotalPages(1);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error en búsqueda:", error);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Primera carga
  // ===============================
  useEffect(() => {
    fetchPokemonsPage(
      `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=0`,
    );
  }, []);

  // ===============================
  // Volver a paginación si se borra búsqueda
  // ===============================
  useEffect(() => {
    if (searchTerm === "") {
      fetchPokemonsPage(
        `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=0`,
      );
    }
  }, [searchTerm]);

  // ===============================
  // Números de página
  // ===============================
  const getPageNumbers = () => {
    const pages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, currentPage + 2);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-bold text-center my-8">Pokédex</h1>
      <div className="bg-white/10 grid grid-cols-2 p-4 mx-[10%] rounded-full p-3 shadow-2xl grid-cols-2 gap-5  flex items-center justify-between">
        <PokeBusqueda
          value={searchTerm}
          onChange={setSearchTerm}
          allPokemons={allPokemons}
          onSelect={fetchPokemonByName}
        />
        <PokeFiltro onFilterChange={fetchPokemonsPage}></PokeFiltro>
      </div>

      {loading ? (
        <p className="text-center">Cargando Pokémon...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 mx-[10%]">
          {pokemons.map((pokemon) => (
            <PokeCard key={pokemon.id} pokemonData={pokemon} />
          ))}
        </div>
      )}

      {searchTerm === "" && (
        <div className="flex justify-center gap-2 my-8 flex-wrap">
          <button
            onClick={() => fetchPokemonsPage(prevPage)}
            disabled={!prevPage}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40">
            Anterior
          </button>

          {getPageNumbers().map((page) => (
            <button
              key={page}
              onClick={() =>
                fetchPokemonsPage(
                  `https://pokeapi.co/api/v2/pokemon?limit=${LIMIT}&offset=${
                    (page - 1) * LIMIT
                  }`,
                )
              }
              className={`px-3 py-1 rounded ${
                page === currentPage
                  ? "bg-blue-600"
                  : "bg-gray-700 hover:bg-gray-600"
              }`}>
              {page}
            </button>
          ))}

          <button
            onClick={() => fetchPokemonsPage(nextPage)}
            disabled={!nextPage}
            className="px-3 py-1 bg-gray-700 rounded disabled:opacity-40">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
