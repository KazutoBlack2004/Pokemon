import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: "Pokémon", path: "/" },
    { name: "Ítems", path: "/items" },
    { name: "Berries", path: "/berries" },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full px-[5%] py-4">
      <div className="nav-glass flex items-center justify-between px-6 py-3 rounded-2xl border border-white/5 shadow-xl">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="font-black uppercase tracking-widest text-lg">
            Pokedex <span className="text-blue-500/50">||</span>{" "}
            <span className="text-blue-500">Prueba</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`text-[9px] uppercase font-black tracking-widest transition-all ${
                location.pathname === link.path
                  ? "text-blue-400 border-b border-blue-400"
                  : "text-white/40 hover:text-white"
              }`}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
