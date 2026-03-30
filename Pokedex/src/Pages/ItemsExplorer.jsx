import { useState, useEffect, useRef } from "react";
import Loading from "../Components/ui/Loading";
import ItemCard from "../Components/Items/ItemCard";
import ItemModal from "../Components/Items/ItemModal";
import ItemMenu from "../Components/Items/ItemMenu";

const LIMIT = 20;

export default function ItemExplorer() {
  const [allItems, setAllItems] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("id");
  const [selectedAttribute, setSelectedAttribute] = useState("all");
  const [minFlingPower, setMinFlingPower] = useState(0);
  const [maxCost, setMaxCost] = useState(10000);
  const [detailedItems, setDetailedItems] = useState([]);

  const itemCache = useRef({});

  const [viewedItems, setViewedItems] = useState(() =>
    JSON.parse(localStorage.getItem("viewed-items") || "[]"),
  );

  // Lógica de filtrado global (usando useMemo para mejorar el rendimiento)
  const filteredItems = (() => {
    let result = [...detailedItems];

    // 1. Búsqueda por nombre
    if (searchTerm) {
      result = result.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // 2. Filtro por atributo
    if (selectedAttribute !== "all") {
      result = result.filter((item) =>
        item.attributes?.some((attr) => attr.name === selectedAttribute),
      );
    }

    // 3. Filtro por poder de lanzamiento (fling_power)
    if (minFlingPower > 0) {
      result = result.filter(
        (item) => (item.fling_power || 0) >= minFlingPower,
      );
    }

    // 4. Filtro por costo máximo
    result = result.filter((item) => (item.cost || 0) <= maxCost);

    // 5. Ordenación
    result.sort((a, b) => {
      if (sortOrder === "az") return a.name.localeCompare(b.name);
      if (sortOrder === "za") return b.name.localeCompare(a.name);
      return a.id - b.id; // Por defecto ID
    });

    return result;
  })();

  // Lista para mostrar basada en la página actual (cuando no hay búsqueda/filtros, o sobre el resultado de estos)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * LIMIT,
    currentPage * LIMIT,
  );

  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    for (
      let i = Math.max(1, currentPage - delta);
      i <= Math.min(totalPages, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    return range;
  };
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true); // Asegúrate de abrir el modal
    if (!viewedItems.includes(item.id)) {
      const newViewed = [...viewedItems, item.id];
      setViewedItems(newViewed);
      localStorage.setItem("viewed-items", JSON.stringify(newViewed));
    }
  };

  // 1. Carga de lista maestra y almacenamiento en caché persistente
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Primero verificamos caché local
        const cached = localStorage.getItem("pokemon-items-detailed-cache");
        if (cached) {
          const data = JSON.parse(cached);
          setDetailedItems(data);
          setTotalPages(Math.ceil(data.length / LIMIT));
          setLoading(false);
          return;
        }

        // Si no hay caché, obtenemos lista y luego detalles
        const resList = await fetch(
          "https://pokeapi.co/api/v2/item?limit=1000",
        );
        const dataList = await resList.json();

        // Obtener detalles en bloques para no saturar
        const BATCH_SIZE = 50;
        const allDetails = [];

        for (let i = 0; i < dataList.results.length; i += BATCH_SIZE) {
          const batch = dataList.results.slice(i, i + BATCH_SIZE);
          const batchDetails = await Promise.all(
            batch.map(async (item) => {
              const res = await fetch(item.url);
              return res.json();
            }),
          );
          allDetails.push(...batchDetails);
          setDetailedItems([...allDetails]); // Actualización parcial para feedback visual
        }

        setDetailedItems(allDetails);
        setTotalPages(Math.ceil(allDetails.length / LIMIT));
        localStorage.setItem(
          "pokemon-items-detailed-cache",
          JSON.stringify(allDetails),
        );
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // Actualizar total de páginas cuando cambian los filtros
  useEffect(() => {
    setTotalPages(Math.ceil(filteredItems.length / LIMIT));
    setCurrentPage(1); // Reset a la primera página ante cambios de filtros
  }, [searchTerm, selectedAttribute, minFlingPower, maxCost, detailedItems.length]);


  return (
    <div className="mx-[5%] md:mx-[10%] mb-10 relative">
      <header className="pt-12 pb-6 flex flex-col items-center">
        <h1 className="text-6xl font-black italic tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
          Poké<span className="text-blue-500">dex</span>
        </h1>
      </header>

      <ItemMenu
        onSelect={handleOpenModal}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        allItems={detailedItems} 
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        selectedAttribute={selectedAttribute}
        setSelectedAttribute={setSelectedAttribute}
        minFlingPower={minFlingPower}
        setMinFlingPower={setMinFlingPower}
        maxCost={maxCost}
        setMaxCost={setMaxCost}
      />

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 transition-opacity ${loading ? "opacity-50" : "opacity-100"}`}>
        {paginatedItems.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            onOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {isModalOpen && selectedItem && (
        <ItemModal item={selectedItem} onClose={handleCloseModal} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-20">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-20 transition backdrop-blur-sm text-white">
            Anterior
          </button>

          <div className="flex gap-2">
            {getPageNumbers().map((n) => (
              <button
                key={n}
                onClick={() => handlePageChange(n)}
                className={`w-10 h-10 rounded-lg font-bold transition ${
                  n === currentPage
                    ? "bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.5)] text-white"
                    : "bg-white/5 hover:bg-white/10 backdrop-blur-sm text-white"
                }`}>
                {n}
              </button>
            ))}
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="px-6 py-2 bg-white/10 rounded-xl hover:bg-white/20 disabled:opacity-20 transition backdrop-blur-sm text-white">
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
