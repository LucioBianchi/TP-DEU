import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";

const ContaminationTypeStep = ({ onNext, onBack, onClose, dateData, locationData }) => {
  const { config } = useConfig();
  const [contaminationType, setContaminationType] = useState("water");
  
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
  
  const handleContaminationTypeChange = (newType) => {
    setContaminationType(newType);
  };
  
  const handleContinue = () => {
    onNext({
      contaminationType,
      // Determinar qué tipos de medición se necesitan
      needsWaterMeasurement: contaminationType === "water" || contaminationType === "both",
      needsSandMeasurement: contaminationType === "sand" || contaminationType === "both"
    });
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContaminationTypeChange(e.currentTarget.dataset.type);
    }
  };
  
  return (
    <div 
      className="form-step"
      role="region"
      aria-labelledby="contamination-step-title"
    >
      <h2 
        id="contamination-step-title"
        style={{ fontSize: fontSize.title, fontFamily }}
        className="step-title"
      >
        Tipo de Medición
      </h2>
      
      <div className="date-options" role="radiogroup" aria-labelledby="contamination-step-title">
        {/* Opción: Contaminación del agua */}
        <div className="date-option-container">
          <button
            type="button"
            className={`date-option ${contaminationType === "water" ? "selected" : ""}`}
            onClick={() => handleContaminationTypeChange("water")}
            onKeyDown={handleKeyDown}
            data-type="water"
            role="radio"
            aria-checked={contaminationType === "water"}
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Medición del agua</span>
            <span className="contamination-icon" aria-hidden="true">💧</span>
          </button>
        </div>
        
        {/* Opción: Contaminación de la arena */}
        <div className="date-option-container">
          <button
            type="button"
            className={`date-option ${contaminationType === "sand" ? "selected" : ""}`}
            onClick={() => handleContaminationTypeChange("sand")}
            onKeyDown={handleKeyDown}
            data-type="sand"
            role="radio"
            aria-checked={contaminationType === "sand"}
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Medición de la arena</span>
            <span className="contamination-icon" aria-hidden="true">🪣</span>
          </button>
        </div>
        
        {/* Opción: Ambas */}
        <div className="date-option-container">
          <button
            type="button"
            className={`date-option ${contaminationType === "both" ? "selected" : ""}`}
            onClick={() => handleContaminationTypeChange("both")}
            onKeyDown={handleKeyDown}
            data-type="both"
            role="radio"
            aria-checked={contaminationType === "both"}
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Ambas</span>
            <span className="contamination-icon" aria-hidden="true">💧🪣</span>
          </button>
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

export default ContaminationTypeStep;