// Importar React y el renderizador de ReactDOM
import React from "react";
import ReactDOM from "react-dom/client";

// Importar los estilos principales
import "../styles/index.css";

// Importar el componente Home
import Home from "./component/home.jsx";

// Renderizar el componente en el elemento con id "app"
ReactDOM.createRoot(document.getElementById("app")).render(<Home />);