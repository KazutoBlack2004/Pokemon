import { useState } from "react";

export default function PokemonFilter({ onChange }) {
  const [order, setOrder] = useState("asc");

  const handleOrderChange = (e) => {
    const value = e.target.value;
    setOrder(value);
    onChange?.({ type, order: value });
  };

  return (
    <div className="  flex items-center gap-4 p-4 mx-[10%] justify-between">
      {/* Header */}
      <div className="flex items-center gap-3 ml-4 ">
        <h2 className="text-white text-xl font-extrabold tracking-wide">
          Ordenar por:
        </h2>
      </div>

      {/* Orden */}
      <div>
        <select
          value={order}
          onChange={handleOrderChange}
          className="w-[50%]  rounded-xl px-4 py-2 font-bold bg-white/10 text-black text-center">
          <option value="asc">A → Z</option>
          <option value="desc">Z → A</option>
        </select>
      </div>
    </div>
  );
}
