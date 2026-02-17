import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PokemonExplorer from "./Pages/PokemonExplorer";
import Navbar from "./Components/Layout/NavBar";
import Footer from "./Components/Layout/Footer";
import "./index.css";

function App() {
  return (
    <Router>
      <div className="pokemon-bg text-white min-h-screen font-sans relative flex flex-col overflow-x-hidden">
        <div className="bg-glow"></div>
        <Navbar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<PokemonExplorer />} />
            {/* Aquí irán tus futuras rutas: Items, Berries, etc. */}
            <Route
              path="/items"
              element={
                <div className="text-center py-40 opacity-20 uppercase font-black tracking-widest">
                  Sección Ítems en desarrollo
                </div>
              }
            />
            <Route
              path="/berries"
              element={
                <div className="text-center py-40 opacity-20 uppercase font-black tracking-widest">
                  Sección Bayas en desarrollo
                </div>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
