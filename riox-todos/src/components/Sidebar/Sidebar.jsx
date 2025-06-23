import React from "react";
import { getAllPages, getPageConfig } from "../../config/pages";
import "./Sidebar.css";

export default function Sidebar({ currentPage, onNavigate }) {
  const pages = getAllPages();

  return (
    <nav 
      className="sidebar" 
      aria-label="Navegación principal de la aplicación"
    >
      <h2 className="sr-only">Menú de navegación</h2>
      <ul className="sidebar-buttons" aria-label="Opciones de navegación">
        {pages.map((page, index) => (
          <li key={page.id}>
            <button
              className={currentPage === page.id ? "selected" : ""}
              onClick={() => onNavigate(page.id)}
              aria-label={`${page.description}. ${currentPage === page.id ? 'Página actual' : 'Ir a página'}`}
              aria-current={currentPage === page.id ? "page" : undefined}
              title={`${page.description} (${index + 1} de ${pages.length})`}
              tabIndex={0}
            >
              <span className="icon" aria-hidden="true">{page.icon}</span>
              <span className="sr-only">{page.description}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}