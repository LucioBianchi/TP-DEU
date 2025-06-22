import React from "react";
import { getAllPages, getPageConfig } from "../../config/pages";
import "./Sidebar.css";

export default function Sidebar({ currentPage, onNavigate }) {
  const pages = getAllPages();

  return (
    <aside 
      className="sidebar" 
      aria-label="Barra lateral de navegación"
    >
      <div className="sidebar-buttons" role="toolbar" aria-label="Navegación principal">
        {pages.map((page, index) => (
          <button
            key={page.id}
            className={currentPage === page.id ? "selected" : ""}
            onClick={() => onNavigate(page.id)}
            aria-label={`${page.description}. ${currentPage === page.id ? 'Activo' : 'Inactivo'}`}
            aria-current={currentPage === page.id ? "page" : undefined}
            aria-pressed={currentPage === page.id}
            title={`${page.description} (${index + 1} de ${pages.length})`}
            tabIndex={0}
          >
            <span className="icon" aria-hidden="true">{page.icon}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}