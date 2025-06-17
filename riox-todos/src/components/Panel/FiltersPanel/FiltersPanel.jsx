import React, { useState } from "react";

export default function FiltrosPanel() {
  const [localidad, setLocalidad] = useState("");
  const [agua, setAgua] = useState("");
  const [arena, setArena] = useState("");

  const localidades = ["Todas", "Localidad 1", "Localidad 2", "Localidad 3"];

  return (
    <form aria-label="Filtrar balnearios">
      <h2 id="filtros-heading">Filtrar Balnearios</h2>
      <div aria-hidden="true" style={{ marginBottom: "1em" }} />

      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="localidad-select"><strong>Localidad</strong></label>
        <select
          id="localidad-select"
          value={localidad}
          onChange={e => setLocalidad(e.target.value)}
          style={{ width: "100%" }}
          aria-describedby="localidad-desc"
        >
          {localidades.map(loc => (
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
          {["Alta", "Media", "Baja"].map(nivel => (
            <label key={nivel}>
              <input
                type="radio"
                name="agua"
                value={nivel}
                checked={agua === nivel}
                onChange={() => setAgua(nivel)}
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
          {["Alta", "Media", "Baja"].map(nivel => (
            <label key={nivel}>
              <input
                type="radio"
                name="arena"
                value={nivel}
                checked={arena === nivel}
                onChange={() => setArena(nivel)}
              />{" "}
              {nivel}
            </label>
          ))}
        </div>
      </fieldset>

       <div style={{ display: "flex", flexDirection: "column", gap: "0.7em" }}>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "0.7em",
          fontSize: "1em",
          borderRadius: "1.5em",
          background: "#007bff",
          color: "#fff",
          border: "none",
          fontWeight: "bold"
        }}
      >
        Más cercano
      </button>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "0.7em",
          fontSize: "1em",
          borderRadius: "1.5em",
          background: "#17a2b8",
          color: "#fff",
          border: "none",
          fontWeight: "bold"
        }}
      >
        Menos contaminado
      </button>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "0.7em",
          fontSize: "1em",
          borderRadius: "1.5em",
          background: "#28a745",
          color: "#fff",
          border: "none",
          fontWeight: "bold"
        }}
      >
        Menos contaminación de Agua
      </button>
      <button
        type="button"
        style={{
          width: "100%",
          padding: "0.7em",
          fontSize: "1em",
          borderRadius: "1.5em",
          background: "#ffc107",
          color: "#222",
          border: "none",
          fontWeight: "bold"
        }}
      >
        Menos contaminación de Arena
      </button>
    </div>
    </form>
  );
}