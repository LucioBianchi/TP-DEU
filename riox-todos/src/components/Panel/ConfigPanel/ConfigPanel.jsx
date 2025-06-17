import React from "react";
import { useConfig } from "../../../context/ConfigContext.jsx";

export default function ConfigPanel() {
  const { fontSize, setFontSize, iconSize, setIconSize } = useConfig();

  return (
    <section aria-labelledby="config-header">
      <h2 id="config-header">Configuración</h2>
      <div aria-hidden="true" style={{ marginBottom: "1em" }} />

      <div style={{ marginBottom: "1em" }}>
        <label htmlFor="font-size-select"><strong>Tamaño de la letra</strong></label>
        <select
          id="font-size-select"
          value={fontSize}
          onChange={e => setFontSize(e.target.value)}
          style={{ width: "100%", marginTop: "0.5em" }}
        >
          <option value="small">Pequeño</option>
          <option value="medium">Mediano</option>
          <option value="large">Grande</option>
        </select>
      </div>

      <div>
        <label htmlFor="icon-size-select"><strong>Tamaño de los iconos</strong></label>
        <select
          id="icon-size-select"
          value={iconSize}
          onChange={e => setIconSize(e.target.value)}
          style={{ width: "100%", marginTop: "0.5em" }}
        >
          <option value="small">Pequeño</option>
          <option value="medium">Mediano</option>
          <option value="large">Grande</option>
        </select>
      </div>
    </section>
  );
}