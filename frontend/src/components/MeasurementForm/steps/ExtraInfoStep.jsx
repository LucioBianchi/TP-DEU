import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";

const ExtraInfoStep = ({ onNext, onBack, onClose, dateData, locationData, contaminationData, waterData, sandData }) => {
  const { config } = useConfig();
  const [observations, setObservations] = useState("");
  
  const getFontSize = (baseSize) => {
    const sizeMap = {
      small: { title: '1.2rem', body: '0.9rem', button: '0.95rem' },
      medium: { title: '1.4rem', body: '1rem', button: '1rem' },
      large: { title: '1.6rem', body: '1.1rem', button: '1.1rem' }
    };
    return sizeMap[config.fontSize] || sizeMap.medium;
  };
  
  const getFontFamily = () => {
    const fontMap = {
      default: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      dyslexic: "'OpenDyslexic', Arial, sans-serif",
      serif: "Georgia, serif",
      monospace: "'Courier New', monospace"
    };
    return fontMap[config.fontFamily] || fontMap.default;
  };
  
  const fontSize = getFontSize();
  const fontFamily = getFontFamily();
  
  const handleObservationsChange = (e) => {
    setObservations(e.target.value);
  };
  
  const handleContinue = () => {
    onNext({
      extraInfo: {
        observations: observations.trim()
      }
    });
  };
  
  return (
    <div 
      className="form-step"
      role="region"
      aria-labelledby="extra-info-step-title"
    >
      <h2 
        id="extra-info-step-title"
        style={{ fontSize: fontSize.title, fontFamily }}
        className="step-title"
      >
        Información extra
      </h2>
      
      <div className="coordinates-input">
        <div className="coordinates-inputs">
          {/* Observaciones */}
          <div>
            <label 
              htmlFor="observations" 
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600"
              }}
            >
              Observaciones:
            </label>
            <textarea
              id="observations"
              value={observations}
              onChange={handleObservationsChange}
              placeholder="Ingresar observaciones ..."
              rows={6}
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #dee2e6",
                borderRadius: "6px",
                transition: "border-color 0.2s",
                resize: "vertical",
                minHeight: "120px",
                boxSizing: "border-box"
              }}
              aria-describedby="observations-hint"
              tabIndex={0}
            />
            <div 
              id="observations-hint" 
              className="input-hint"
              style={{ 
                fontSize: "0.85rem", 
                color: "#6c757d", 
                marginTop: "0.25rem" 
              }}
            >
              Agregue cualquier información adicional relevante para la medición (opcional)
            </div>
          </div>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="step-actions">
        <button
          type="button"
          onClick={onBack}
          className="btn-secondary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Volver al paso anterior"
          tabIndex={0}
        >
          ← Volver
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Continuar al siguiente paso"
          tabIndex={0}
        >
          <span className="arrow-right" aria-hidden="true">▶</span>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default ExtraInfoStep;