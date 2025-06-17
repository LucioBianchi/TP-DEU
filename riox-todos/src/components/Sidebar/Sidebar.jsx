import React, { useState } from "react";
import "./Sidebar.css";

const buttons = [
  { id: "mapa", label: "Mapa", icon: "🗺️" },
  { id: "filtros", label: "Filtros", icon: "🔍" },
  { id: "info", label: "Info", icon: "ℹ️" },
  { id: "usuario", label: "Usuario", icon: "👤" },
  { id: "config", label: "Configuración", icon: "⚙️" }
];

export default function Sidebar({ selected, setSelected, children }) {
  return (
  <aside className="sidebar" aria-label="Barra lateral">
      <div className="sidebar-buttons">
      {buttons.map((btn) => (
        <button
          key={btn.id}
          className={selected === btn.id ? "selected" : ""}
          onClick={() => setSelected(btn.id)}
          aria-label={btn.label}
          aria-current={selected === btn.id ? "page" : undefined}
        >
          <span className="icon" aria-hidden="true">{btn.icon}</span>
        </button>
      ))}
    </div>
    <div className="sidebar-content">{children}</div>
  </aside>
  );
}