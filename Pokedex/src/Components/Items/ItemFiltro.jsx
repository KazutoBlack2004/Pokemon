export default function ItemFilter({ sortOrder, setSortOrder }) {
  const options = [
    { id: "id", label: "N.º Registro" }, // Genérico para cualquier ítem
    { id: "az", label: "A → Z" },
    { id: "za", label: "Z → A" },
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 my-6">
      <h2 className="text-white text-lg font-extrabold tracking-wide">
        Ordenar por:
      </h2>

      <div className="flex gap-2 p-1 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => setSortOrder(option.id)}
            className={`
              px-4 py-2 sm:px-6 
              text-sm sm:text-base font-semibold 
              rounded-xl transition-all duration-300
              ${
                sortOrder === option.id
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }
            `}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
