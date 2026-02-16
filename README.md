# 🧢 Pokedex

Aplicación web desarrollada con **React + Vite** que consume datos en tiempo real desde la API pública de Pokémon.  
Permite explorar Pokémon, visualizar información detallada y practicar consumo de APIs modernas.

🔗 Demo en producción:  
https://pokemon-e66b.onrender.com

---

## 🚀 Tecnologías utilizadas

- React
- Vite
- JavaScript (ES6+)
- CSS
- Fetch API
- Render (deploy)

---

## 📦 Instalación local

Clona el repositorio:

```bash
git clone https://github.com/KazutoBlack2004/Pokemon.git
cd Pokemon/Pokedex
```

## Ejecutar en modo desarrollo
```bash
npm run dev
```

## Acceder a la aplicación
La aplicación estará disponible en: http://localhost:5173

## 🏗️ Build para Producción

Para generar una versión optimizada del sitio:

```bash
npm run build
```

Esto generará la carpeta:

```
dist/
```

(Contiene los archivos estáticos listos para desplegar).

---

## 🌍 Despliegue

El proyecto está desplegado como Static Site en Render.

### 🔄 Flujo de despliegue automático (CI/CD)

1. Push a la rama `main`.
2. Render detecta el cambio e inicia el build:

```bash
npm install && npm run build
```

3. Se publica automáticamente el contenido de la carpeta `dist/`.

---

## 📁 Estructura del Proyecto

```
Pokedex/
│
├── public/          # Archivos estáticos
├── src/
│   ├── components/  # Componentes reutilizables
│   ├── pages/       # Vistas de la aplicación
│   └── ...          # Estilos, hooks y servicios
├── index.html       # Punto de entrada principal
├── vite.config.js   # Configuración de Vite
└── package.json     # Scripts y dependencias
```

---

## 🎯 Objetivos del Proyecto

- **Consumo de APIs:** Práctica de peticiones asíncronas con la PokeAPI.
- **Manejo de estado:** Uso de React hooks para gestionar la lógica de la app.
- **Despliegue:** Configuración de entornos de producción.
- **Flujo Git:** Implementación de despliegue automático mediante Git hooks.

---

## 📌 Posibles Mejoras Futuras

- [ ] 🔍 Sistema de búsqueda avanzada.
- [ ] 🧪 Filtros por tipo de Pokémon.
- [ ] 📄 Paginación optimizada.
- [ ] 🌙 Modo oscuro (Dark mode).
- [ ] ⚡ Mejoras de rendimiento y SEO.
