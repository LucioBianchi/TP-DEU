import React from "react";
import { useBalnearios } from "../../../hooks/useBalnearios";

export default function FiltersPanel({ filters, onFiltersChange, onResetFilters }) {
  const { uniqueValues, stats } = useBalnearios(filters);

  const handleFilterChange = (key, value) => {
    // Convertir de femenino a masculino para el filtro interno
    const internalValue = value === "Baja" ? "Bajo" : 
                         value === "Media" ? "Medio" : 
                         value === "Alta" ? "Alto" : value;
    onFiltersChange({ [key]: internalValue });
  };

  const handleResetFilters = () => {
    onResetFilters();
  };

  // Convertir de masculino a femenino para mostrar en la UI
  const getDisplayValue = (value) => {
    return value === "Bajo" ? "Baja" : 
           value === "Medio" ? "Media" : 
           value === "Alto" ? "Alta" : value;
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = filters.localidad || filters.agua || filters.arena;

  return (
    <form aria-label="Filtrar balnearios">
      <h3 className="sr-only">Filtros de búsqueda</h3>
      
      {/* Estadísticas */}
      <section 
        aria-live="polite"
        aria-label="Estadísticas de resultados"
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
      </section>

      {/* Botón para quitar filtros */}
      {hasActiveFilters && (
        <section style={{ marginBottom: "1.5em" }}>
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
        </section>
      )}

      {/* Filtro de Localidad con estilo mejorado */}
      <section style={{ marginBottom: "2em" }}>
        <label htmlFor="localidad-select" style={{ display: "block", marginBottom: "0.5em" }}>
          <strong style={{ fontSize: "1.1em", color: "#495057" }}>Localidad</strong>
        </label>
        <div style={{ position: "relative" }}>
          <select
            id="localidad-select"
            name="localidad"
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
      </section>

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
              value="Baja"
              checked={getDisplayValue(filters.agua) === "Baja"}
              onChange={() => handleFilterChange('agua', 'Baja')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#28a745" }}>Baja</span>
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
              value="Media"
              checked={getDisplayValue(filters.agua) === "Media"}
              onChange={() => handleFilterChange('agua', 'Media')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#ffc107" }}>Media</span>
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
              value="Alta"
              checked={getDisplayValue(filters.agua) === "Alta"}
              onChange={() => handleFilterChange('agua', 'Alta')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#dc3545" }}>Alta</span>
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
              value="Baja"
              checked={getDisplayValue(filters.arena) === "Baja"}
              onChange={() => handleFilterChange('arena', 'Baja')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#28a745" }}>Baja</span>
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
              value="Media"
              checked={getDisplayValue(filters.arena) === "Media"}
              onChange={() => handleFilterChange('arena', 'Media')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#ffc107" }}>Media</span>
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
              value="Alta"
              checked={getDisplayValue(filters.arena) === "Alta"}
              onChange={() => handleFilterChange('arena', 'Alta')}
              style={{ transform: "scale(1.2)" }}
            />
            <span style={{ fontWeight: "500", color: "#dc3545" }}>Alta</span>
          </label>
        </div>
      </fieldset>
    </form>
  );
}