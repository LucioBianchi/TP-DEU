import React from "react";
import { getAllPages, getPageConfig } from "../../config/pages";
import "./Sidebar.css";

export default function Sidebar({ currentPage, onNavigate, children }) {
  const pages = getAllPages();

  return (
    <aside className="sidebar" aria-label="Barra lateral">
      <div className="sidebar-buttons">
        {pages.map((page) => (
          <button
            key={page.id}
            className={currentPage === page.id ? "selected" : ""}
            onClick={() => onNavigate(page.id)}
            aria-label={page.description}
            aria-current={currentPage === page.id ? "page" : undefined}
            title={page.description}
          >
            <span className="icon" aria-hidden="true">{page.icon}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">{children}</div>
    </aside>
  );
}