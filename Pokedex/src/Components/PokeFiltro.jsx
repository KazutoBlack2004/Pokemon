export default function PokemonFilter({ sortOrder, setSortOrder }) {
  const options = [
    { id: "id", label: "N.º Pokedex" },
    { id: "az", label: "A → Z" },
    { id: "za", label: "Z → A" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-6">
      <h2 className="text-white text-lg font-extrabold tracking-wide">
        Ordenar por:
      </h2>

      <div className="flex gap-2 p-1 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-md">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortOrder(option.id)}
            className={`
              px-4 py-2 sm:px-6 
              text-sm sm:text-base font-semibold 
              rounded-xl transition-all duration-200
              ${
                sortOrder === option.id
                  ? "bg-white text-black shadow-lg"
                  : "text-white hover:bg-white/10"
              }
            `}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
