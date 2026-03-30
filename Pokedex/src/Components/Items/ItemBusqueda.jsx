import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

export default function ItemBusqueda({
  value = "",
  onChange,
  allItems = [],
  onSelect,
  delay = 400,
}) {
  const [localValue, setLocalValue] = useState(value);
  const [suggestions, setSuggestions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef(null);

  // EFECTO: Filtrar sugerencias con seguridad defensiva
  useEffect(() => {
    const query = (localValue || "").toLowerCase().trim();

    // Si no hay query o no hay lista, limpiamos
    if (!query || !Array.isArray(allItems) || allItems.length === 0) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = allItems
      .filter((item) => item?.name?.toLowerCase().includes(query))
      .sort((a, b) => {
        const nameA = a?.name?.toLowerCase() || "";
        const nameB = b?.name?.toLowerCase() || "";
        const aStarts = nameA.startsWith(query) ? -1 : 1;
        const bStarts = nameB.startsWith(query) ? -1 : 1;
        return aStarts - bStarts;
      })
      .slice(0, 8);

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
  }, [localValue, allItems]);

  // EFECTO: Debounce para actualizar el estado superior
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) onChange(localValue);
    }, delay);
    return () => clearTimeout(timer);
  }, [localValue, delay, onChange]);

  // Manejo de clicks fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    setLocalValue(name);
    if (onSelect) onSelect(name);
    setShowSuggestions(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const selected =
        activeIndex >= 0 ? suggestions[activeIndex] : suggestions[0];
      if (selected?.name) handleSelect(selected.name);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  const highlight = (name) => {
    if (!localValue) return name;
    const parts = name.split(new RegExp(`(${localValue})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === localValue.toLowerCase() ? (
        <span key={i} className="highlight">
          {part}
        </span>
      ) : (
        part
      ),
    );
  };

  return (
    <div className="w-full relative" ref={wrapperRef}>
      <StyledWrapper>
        <div className="searchBox">
          <input
            className="searchInput"
            type="text"
            placeholder="Buscar objetos..."
            value={localValue}
            onFocus={() => localValue && setShowSuggestions(true)}
            onChange={(e) => setLocalValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="searchButton"
            type="button"
            onClick={() =>
              suggestions.length > 0 && handleSelect(suggestions[0].name)
            }>
            <img
              src="https://cdn.pixabay.com/photo/2019/11/27/14/06/pokemon-4657023_640.png"
              alt="Buscar"
            />
          </button>
        </div>

        {showSuggestions && (
          <ul className="suggestions" role="listbox">
            {suggestions.map((item, index) => (
              <li
                key={item?.name || index}
                role="option"
                aria-selected={index === activeIndex}
                className={index === activeIndex ? "active" : ""}
                onClick={() => handleSelect(item.name)}>
                {highlight(item?.name || "")}
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: transparent;
    transition: all 300ms cubic-bezier(0.23, 1, 0.32, 1);
  }

  .searchButton img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  button:hover {
    color: #fff;
    background-color: #1a1a1a;
    box-shadow: rgba(0, 0, 0, 0.5) 0 10px 20px;
    transform: translateY(-3px);
  }

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
    padding: 24px 60px 24px 26px;
  }

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
