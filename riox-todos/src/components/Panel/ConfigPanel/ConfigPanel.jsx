import React from "react";
import { useConfig } from "../../../context/ConfigContext.jsx";

export default function ConfigPanel() {
  const { config, updateConfig, resetConfig } = useConfig();

  const handleConfigChange = (key, value) => {
    updateConfig(key, value);
  };

  return (
    <section>
      <div style={{ marginBottom: "1.5em" }}>
        <label htmlFor="font-size-select"><strong>Tamaño de la letra</strong></label>
        <select
          id="font-size-select"
          value={config.fontSize}
          onChange={e => handleConfigChange('fontSize', e.target.value)}
          style={{ width: "100%", marginTop: "0.5em" }}
        >
          <option value="small">Pequeño</option>
          <option value="medium">Mediano</option>
          <option value="large">Grande</option>
        </select>
      </div>

      <div style={{ marginBottom: "1.5em" }}>
        <label htmlFor="icon-size-select"><strong>Tamaño de los iconos</strong></label>
        <select
          id="icon-size-select"
          value={config.iconSize}
          onChange={e => handleConfigChange('iconSize', e.target.value)}
          style={{ width: "100%", marginTop: "0.5em" }}
        >
          <option value="small">Pequeño</option>
          <option value="medium">Mediano</option>
          <option value="large">Grande</option>
        </select>
      </div>

      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="font-family-select"><strong>Familia de fuente</strong></label>
        <select
          id="font-family-select"
          value={config.fontFamily}
          onChange={e => handleConfigChange('fontFamily', e.target.value)}
          style={{ width: "100%", marginTop: "0.5em" }}
        >
          <option value="default">Predeterminada</option>
          <option value="dyslexic">Dyslexic-friendly</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>

      <button
        type="button"
        onClick={resetConfig}
        style={{
          width: "100%",
          padding: "0.7em",
          fontSize: "1em",
          borderRadius: "1.5em",
          background: "#6c757d",
          color: "#fff",
          border: "none",
          fontWeight: "bold"
        }}
      >
        Restablecer configuración
      </button>
    </section>
  );
}