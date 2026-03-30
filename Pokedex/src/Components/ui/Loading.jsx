import React from "react";

const Loading = ({ mensaje = "Cargando datos...", color = "#ff0000" }) => {
  // Estilos en JS para mayor dinamismo
  const containerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "15px",
    padding: "20px",
  };

  const pokeballStyle = {
    width: "60px",
    height: "60px",
    backgroundColor: "#fff",
    borderRadius: "50%",
    position: "relative",
    border: "3px solid #333",
    overflow: "hidden",
    animation: "spin 1.2s linear infinite",
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>

      <div style={pokeballStyle}>
        {/* Mitad superior dinámica */}
        <div
          style={{
            position: "absolute",
            backgroundColor: color,
            width: "100%",
            height: "50%",
            top: 0,
            borderBottom: "3px solid #333",
          }}
        />

        {/* Botón central */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "12px",
            height: "12px",
            backgroundColor: "#fff",
            border: "3px solid #333",
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 10,
            boxShadow: "0 0 0 2px #fff",
          }}
        />
      </div>

      <p
        style={{
          fontFamily: "monospace",
          fontWeight: "bold",
          color: "#444",
          animation: "blink 1.5s infinite",
        }}>
        {mensaje}
      </p>
    </div>
  );
};

export default Loading;
