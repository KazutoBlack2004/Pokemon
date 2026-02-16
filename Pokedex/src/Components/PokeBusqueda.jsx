import { useEffect, useState } from "react";
import styled from "styled-components";

/*
  value        → valor actual de búsqueda (viene del padre)
  onChange     → setter del padre (App)
  allPokemons  → lista completa de Pokémon (solo nombre + url)
  onSelect     → qué hacer cuando se elige un Pokémon
  delay        → debounce
*/
export default function PokeBusqueda({
  value,
  onChange,
  allPokemons = [],
  onSelect,
  delay = 500,
}) {
  const [localValue, setLocalValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [localValue, delay, onChange]);

  useEffect(() => {
    if (localValue.trim() === "") {
      setSuggestions([]);
      setActiveIndex(-1);
      return;
    }

    const filtered = allPokemons.filter((pokemon) =>
      pokemon.name.includes(localValue.toLowerCase()),
    );

    setSuggestions(filtered.slice(0, 8));
    setActiveIndex(-1);
  }, [localValue, allPokemons]);
  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      setActiveIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
    }

    if (e.key === "ArrowUp") {
      setActiveIndex((prev) => Math.max(prev - 1, 0));
    }

    if (e.key === "Enter" && activeIndex >= 0) {
      onSelect(suggestions[activeIndex].name);
      setSuggestions([]);
    }
  };

  const highlight = (name) => {
    const index = name.indexOf(localValue.toLowerCase());
    if (index === -1) return name;

    return (
      <>
        {name.slice(0, index)}
        <span className="highlight">
          {name.slice(index, index + localValue.length)}
        </span>
        {name.slice(index + localValue.length)}
      </>
    );
  };

  return (
    <div className="w-full relative">
      <StyledWrapper>
        <div className="searchBox">
          <input
            className="searchInput"
            type="text"
            placeholder="Busca tu Pokémon..."
            value={localValue}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <button className="searchButton" type="button">
            <img
              src="https://cdn.pixabay.com/photo/2019/11/27/14/06/pokemon-4657023_640.png"
              alt="Buscar"
              onClick={() => {
                if (suggestions.length > 0) {
                  onSelect(suggestions[0].name);
                  setSuggestions([]);
                }
              }}
            />
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((pokemon, index) => (
              <li
                key={pokemon.name}
                className={index === activeIndex ? "active" : ""}
                onClick={() => {
                  onSelect(pokemon.name);
                  setSuggestions([]);
                }}>
                {highlight(pokemon.name)}
              </li>
            ))}
          </ul>
        )}
      </StyledWrapper>
    </div>
  );
}

const StyledWrapper = styled.div`
  .searchBox {
    z-index: 30;
    display: flex;
    max-width: 100%;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    background: #2f3640;
    border-radius: 50px;
    position: relative;
  }

  .searchButton {
    position: absolute;
    right: 8px;
    width: 50px;
    height: 50px;
    border-radius: 50%;

    border: 0;
    display: inline-block;
    transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  /*hover effect*/
  button:hover {
    color: #fff;
    background-color: #1a1a1a;
    box-shadow: rgba(0, 0, 0, 0.5) 0 10px 20px;
    transform: translateY(-3px);
  }
  /*button pressing effect*/
  button:active {
    box-shadow: none;
    transform: translateY(0);
  }

  .searchInput {
    width: 100%;
    border: none;
    background: none;
    outline: none;
    color: white;
    font-size: 15px;
    padding: 24px 46px 24px 26px;
  }

  /* ===============================
     SUGERENCIAS
     =============================== */
  .suggestions {
    position: absolute;
    top: 110%;
    width: 100%;
    background: #1f2933;
    border-radius: 12px;
    list-style: none;
    padding: 6px 0;
    margin: 0;
    z-index: 20;
  }

  .suggestions li {
    padding: 10px 16px;
    cursor: pointer;
    color: white;
  }

  .suggestions li:hover,
  .suggestions li.active {
    background: #374151;
  }

  .highlight {
    color: #facc15;
    font-weight: bold;
  }
`;
