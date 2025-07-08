import React from "react";
import { useConfig } from "../../../context/ConfigContext.jsx";

export default function ConfigPanel() {
  const { config, updateConfig, resetConfig } = useConfig();

  const handleConfigChange = (key, value) => {
    updateConfig(key, value);
  };

  return (
    <section aria-label="Configuración de accesibilidad">
      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="font-size-select" style={{ display: "block", marginBottom: "0.5em" }}>
          <strong style={{ fontSize: "1.1em", color: "#495057" }}>Tamaño de la letra</strong>
        </label>
        <div style={{ position: "relative" }}>
          <select
            id="font-size-select"
            value={config.fontSize}
            onChange={e => handleConfigChange('fontSize', e.target.value)}
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
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dee2e6";
            }}
          >
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="icon-size-select" style={{ display: "block", marginBottom: "0.5em" }}>
          <strong style={{ fontSize: "1.1em", color: "#495057" }}>Tamaño de los iconos</strong>
        </label>
        <div style={{ position: "relative" }}>
          <select
            id="icon-size-select"
            value={config.iconSize}
            onChange={e => handleConfigChange('iconSize', e.target.value)}
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
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dee2e6";
            }}
          >
            <option value="small">Pequeño</option>
            <option value="medium">Mediano</option>
            <option value="large">Grande</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: "2em" }}>
        <label htmlFor="font-family-select" style={{ display: "block", marginBottom: "0.5em" }}>
          <strong style={{ fontSize: "1.1em", color: "#495057" }}>Familia de fuente</strong>
        </label>
        <div style={{ position: "relative" }}>
          <select
            id="font-family-select"
            value={config.fontFamily}
            onChange={e => handleConfigChange('fontFamily', e.target.value)}
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
            onFocus={(e) => {
              e.target.style.borderColor = "#007bff";
              e.target.style.outline = "none";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#dee2e6";
            }}
          >
            <option value="default">Predeterminada</option>
            <option value="dyslexic">Dyslexic-friendly</option>
            <option value="serif">Serif</option>
            <option value="monospace">Monospace</option>
          </select>
        </div>
      </div>

      <button
        type="button"
        onClick={resetConfig}
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
        aria-label="Restablecer configuración a valores predeterminados"
      >
        Restablecer configuración
      </button>
    </section>
  );
}