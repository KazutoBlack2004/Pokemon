import { Instagram, Github, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-auto py-12 px-[5%] border-t border-white/5 bg-black/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-10">
        {/* Lado Izquierdo: Branding, Copyright y Links */}
        <div className="flex flex-col items-center md:items-start gap-6">
          <div>
            <h3 className="font-black uppercase tracking-tighter text-2xl text-white">
              Pokedex <span className="text-blue-500">||</span> Prueba
            </h3>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-50 text-center md:text-left">
              © {currentYear} — Oliver
            </p>
          </div>

          {/* Grupo de Redes Sociales / Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-3">
            {/* Link de Instagram */}
            <a
              href="https://www.instagram.com/_kazuto_black_/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white/5 hover:bg-gradient-to-tr hover:from-[#f9ce34] hover:via-[#ee2a7b] hover:to-[#6228d7] p-2 px-4 rounded-xl transition-all duration-300 border border-white/5">
              <Instagram
                size={14}
                className="text-white group-hover:scale-110 transition-transform"
              />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white">
                Instagram
              </span>
            </a>

            {/* Link del Repositorio de GitHub */}
            <a
              href="https://github.com/KazutoBlack2004/Pokemon"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 bg-white/5 hover:bg-white/20 p-2 px-4 rounded-xl transition-all duration-300 border border-white/5">
              <Github
                size={14}
                className="text-white group-hover:scale-110 transition-transform"
              />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white">
                Repositorio
              </span>
              <ExternalLink
                size={10}
                className="opacity-30 group-hover:opacity-100 transition-opacity"
              />
            </a>
          </div>
        </div>

        {/* Lado Derecho: Créditos y Legal */}
        <div className="flex flex-col items-center md:items-end gap-3 text-center md:text-right max-w-sm">
          <div className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-3 bg-blue-500/10 text-blue-400 py-1.5 px-4 rounded-full border border-blue-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
            <span>Data Source: PokeAPI.co</span>
          </div>

          <p className="text-[8px] leading-relaxed uppercase opacity-30 font-medium">
            Pokémon y los nombres de los personajes asociados son marcas
            registradas de Nintendo, Creatures Inc. y Game Freak. Esta
            aplicación es un proyecto personal sin fines de lucro creado con
            fines educativos y de portafolio.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
