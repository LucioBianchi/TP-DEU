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
    <aside className="sidebar" role="navigation" aria-label="Barra lateral">
      <div className="sidebar-buttons" role="tablist" aria-orientation="vertical">
        {buttons.map((btn, idx) => (
          <button
            key={btn.id}
            role="tab"
            aria-selected={selected === btn.id}
            aria-controls={`panel-${btn.id}`}
            tabIndex={selected === btn.id ? 0 : -1}
            onClick={() => setSelected(btn.id)}
            aria-label={btn.label}
          >
            <span aria-hidden="true">{btn.icon}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-content">{children}</div>
    </aside>
  );
}