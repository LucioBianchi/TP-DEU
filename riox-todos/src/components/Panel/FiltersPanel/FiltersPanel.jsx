import React from "react";
import { useBalnearios } from "../../../hooks/useBalnearios";

export default function FiltersPanel({ filters, onFiltersChange }) {
  const { uniqueValues, stats } = useBalnearios(filters);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  return (
    <form aria-label="Filtrar balnearios">
      {/* Estadísticas */}
      <div 
        role="status" 
        aria-live="polite"
        style={{ 
          background: "rgba(0,0,0,0.05)", 
          padding: "0.5em", 
          borderRadius: "4px", 
          marginBottom: "1em",
          fontSize: "0.9em"
        }}
      >
        <strong>Resultados:</strong> {stats.filtered} de {stats.total} balnearios
      </div>

      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="localidad-select"><strong>Localidad</strong></label>
        <select
          id="localidad-select"
          value={filters.localidad}
          onChange={e => handleFilterChange('localidad', e.target.value)}
          style={{ width: "100%", marginTop: "0.5em" }}
          aria-describedby="localidad-desc"
        >
          <option value="">Todas las localidades</option>
          {uniqueValues.localidades.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
        <span id="localidad-desc" className="sr-only">
          Selecciona una localidad para filtrar los balnearios.
        </span>
      </div>

      <fieldset
        style={{
          background: "rgba(0, 123, 255, 0.08)",
          borderRadius: "8px",
          padding: "1em",
          marginBottom: "2em",
          border: "1px solid #007bff"
        }}
      >
        <legend><strong>Contaminación de Agua</strong></legend>
        <div style={{ display: "flex", gap: "1em", marginTop: "0.5em" }}>
          <label>
            <input
              type="radio"
              name="agua"
              value=""
              checked={filters.agua === ""}
              onChange={() => handleFilterChange('agua', '')}
            />{" "}
            Todas
          </label>
          {uniqueValues.aguas.map(nivel => (
            <label key={nivel}>
              <input
                type="radio"
                name="agua"
                value={nivel}
                checked={filters.agua === nivel}
                onChange={() => handleFilterChange('agua', nivel)}
              />{" "}
              {nivel}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset
        style={{
          background: "rgba(40, 167, 69, 0.08)",
          borderRadius: "8px",
          padding: "1em",
          marginBottom: "2em",
          border: "1px solid #28a745"
        }}
      >
        <legend><strong>Contaminación de Arena</strong></legend>
        <div style={{ display: "flex", gap: "1em", marginTop: "0.5em" }}>
          <label>
            <input
              type="radio"
              name="arena"
              value=""
              checked={filters.arena === ""}
              onChange={() => handleFilterChange('arena', '')}
            />{" "}
            Todas
          </label>
          {uniqueValues.arenas.map(nivel => (
            <label key={nivel}>
              <input
                type="radio"
                name="arena"
                value={nivel}
                checked={filters.arena === nivel}
                onChange={() => handleFilterChange('arena', nivel)}
              />{" "}
              {nivel}
            </label>
          ))}
        </div>
      </fieldset>
    </form>
  );
}