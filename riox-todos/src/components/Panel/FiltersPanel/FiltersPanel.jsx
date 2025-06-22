import React from "react";
import { useBalnearios } from "../../../hooks/useBalnearios";

export default function FiltersPanel({ filters, onFiltersChange, onResetFilters }) {
  const { uniqueValues, stats } = useBalnearios(filters);

  const handleFilterChange = (key, value) => {
    onFiltersChange({ [key]: value });
  };

  const handleResetFilters = () => {
    onResetFilters();
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.localidad || filters.agua || filters.arena;

  return (
    <form aria-label="Filtrar balnearios">
      {/* Estadísticas */}
      <div 
        role="status" 
        aria-live="polite"
        style={{ 
          background: "rgba(0,0,0,0.05)", 
          padding: "0.8em", 
          borderRadius: "8px", 
          marginBottom: "1.5em",
          fontSize: "0.9em",
          border: "1px solid #dee2e6"
        }}
      >
        <strong>Resultados:</strong> {stats.filtered} de {stats.total} balnearios
      </div>

      {/* Botón para quitar filtros */}
      {hasActiveFilters && (
        <div style={{ marginBottom: "1.5em" }}>
          <button
            type="button"
            onClick={handleResetFilters}
            style={{
              width: "100%",
              padding: "0.8em",
              fontSize: "1em",
              borderRadius: "8px",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background-color 0.2s"
            }}
            onFocus={(e) => {
              e.target.style.outline = "2px solid #495057";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#5a6268";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#6c757d";
            }}
            aria-label="Quitar todos los filtros aplicados"
          >
            ✕ Quitar filtros
          </button>
        </div>
      )}

      {/* Filtro de Localidad con estilo mejorado */}
      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="localidad-select" style={{ display: "block", marginBottom: "0.5em" }}>
          <strong style={{ fontSize: "1.1em", color: "#495057" }}>Localidad</strong>
        </label>
        <div style={{ position: "relative" }}>
          <select
            id="localidad-select"
            value={filters.localidad}
            onChange={e => handleFilterChange('localidad', e.target.value)}
            style={{ 
              width: "100%", 
              padding: "0.8em 1em",
              borderRadius: "8px",
              border: "2px solid #dee2e6",
              fontSize: "1em",
              background: "#fff",
              cursor: "pointer",
              appearance: "none",
              backgroundImage: "url('data:image/svg+xml;charset=US-ASCII,<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"12\" height=\"8\"><path d=\"M1 1l5 5 5-5\" stroke=\"%23666\" stroke-width=\"2\" fill=\"none\"/></svg>')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1em center",
              paddingRight: "2.5em"
            }}
            aria-describedby="localidad-desc"
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dee2e6";
            }}
          >
            <option value="">Todas las localidades</option>
            {uniqueValues.localidades.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>
        <span id="localidad-desc" className="sr-only">
          Selecciona una localidad para filtrar los balnearios.
        </span>
      </div>

      {/* Filtro de Contaminación de Agua */}
      <fieldset
        style={{
          background: "rgba(0, 123, 255, 0.05)",
          borderRadius: "12px",
          padding: "1.5em",
          marginBottom: "2em",
          border: "2px solid #007bff"
        }}
      >
        <legend style={{ 
          padding: "0 0.5em", 
          fontSize: "1.1em", 
          fontWeight: "bold",
          color: "#007bff"
        }}>
          Contaminación de Agua
        </legend>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", 
          gap: "1em", 
          marginTop: "1em" 
        }}>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="agua"
              value=""
              checked={filters.agua === ""}
              onChange={() => handleFilterChange('agua', '')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500" }}>Todas</span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="agua"
              value="Bajo"
              checked={filters.agua === "Bajo"}
              onChange={() => handleFilterChange('agua', 'Bajo')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#28a745" }}>Bajo</span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="agua"
              value="Medio"
              checked={filters.agua === "Medio"}
              onChange={() => handleFilterChange('agua', 'Medio')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#ffc107" }}>Medio</span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="agua"
              value="Alto"
              checked={filters.agua === "Alto"}
              onChange={() => handleFilterChange('agua', 'Alto')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#dc3545" }}>Alto</span>
          </label>
        </div>
      </fieldset>

      {/* Filtro de Contaminación de Arena */}
      <fieldset
        style={{
          background: "rgba(40, 167, 69, 0.05)",
          borderRadius: "12px",
          padding: "1.5em",
          marginBottom: "2em",
          border: "2px solid #28a745"
        }}
      >
        <legend style={{ 
          padding: "0 0.5em", 
          fontSize: "1.1em", 
          fontWeight: "bold",
          color: "#28a745"
        }}>
          Contaminación de Arena
        </legend>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))", 
          gap: "1em", 
          marginTop: "1em" 
        }}>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="arena"
              value=""
              checked={filters.arena === ""}
              onChange={() => handleFilterChange('arena', '')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500" }}>Todas</span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="arena"
              value="Bajo"
              checked={filters.arena === "Bajo"}
              onChange={() => handleFilterChange('arena', 'Bajo')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#28a745" }}>Bajo</span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="arena"
              value="Medio"
              checked={filters.arena === "Medio"}
              onChange={() => handleFilterChange('arena', 'Medio')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#ffc107" }}>Medio</span>
          </label>
          <label style={{ 
            display: "flex", 
            alignItems: "center", 
            gap: "0.5em",
            cursor: "pointer",
            padding: "0.5em",
            borderRadius: "6px",
            transition: "background-color 0.2s"
          }}>
            <input
              type="radio"
              name="arena"
              value="Alto"
              checked={filters.arena === "Alto"}
              onChange={() => handleFilterChange('arena', 'Alto')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#dc3545" }}>Alto</span>
          </label>
        </div>
      </fieldset>
    </form>
  );
}