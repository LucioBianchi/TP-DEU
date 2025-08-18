import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import { useFormValidation } from "../../../hooks/useFormValidation";
import ValidationError from "../../common/ValidationError";

const DateStep = ({ onNext, onClose }) => {
  const { config } = useConfig();
  const { errors, validateField, clearError } = useFormValidation();
  const [dateType, setDateType] = useState("current");
  const [customDate, setCustomDate] = useState("");
  
  // Obtener fecha actual formateada
  const currentDate = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
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
      'OpenDyslexic': "'OpenDyslexic', monospace",
      'Arial': "'Arial', sans-serif",
      'Times': "'Times New Roman', serif",
      'default': "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };
    return fontMap[config.fontFamily] || fontMap.default;
  };
  
  const fontSize = getFontSize();
  const fontFamily = getFontFamily();
  
  const handleDateTypeChange = (newType) => {
    setDateType(newType);
    if (newType === "current") {
      setCustomDate("");
    } else if (newType === "custom" && !customDate) {
      setCustomDate(currentDate);
    }
  };
  
  const handleCustomDateChange = (e) => {
    setCustomDate(e.target.value);
    // Limpiar error cuando el usuario escriba
    if (errors.customDate) {
      clearError('customDate');
    }
  };
  
  const handleContinue = () => {
    const selectedDate = dateType === "current" ? currentDate : customDate;
    
    // Validar solo si es fecha personalizada
    if (dateType === "custom") {
      const error = validateField(customDate, 'date', 'customDate');
      if (error) {
        return; // No continuar si hay error
      }
    }
    
    onNext({ dateType, selectedDate });
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleDateTypeChange(e.currentTarget.dataset.type);
    }
  };
  
  return (
    <div 
      className="form-step"
      role="region"
      aria-labelledby="date-step-title"
    >
      <h2 
        id="date-step-title"
        style={{ fontSize: fontSize.title, fontFamily }}
        className="step-title"
      >
        Fecha de la muestra
      </h2>
      
      <div className="date-options" role="radiogroup" aria-labelledby="date-step-title">
        {/* Opción: Fecha actual */}
        <div className="date-option-container">
          <button
            type="button"
            className={`date-option ${dateType === "current" ? "selected" : ""}`}
            onClick={() => handleDateTypeChange("current")}
            onKeyDown={handleKeyDown}
            data-type="current"
            role="radio"
            aria-checked={dateType === "current"}
            aria-describedby="current-date-display"
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Fecha actual</span>
            <span className="calendar-icon" aria-hidden="true">📅</span>
          </button>
          
          {/* Mostrar la fecha actual seleccionada */}
          {dateType === "current" && (
            <div 
              id="current-date-display"
              className="selected-date-display"
              style={{ 
                marginTop: "0.5rem",
                padding: "0.75rem",
                background: "#f8f9fa",
                border: "2px solid #dee2e6",
                borderRadius: "6px",
                fontWeight: "600",
                color: "#495057",
                textAlign: "center"
              }}
              role="status"
              aria-live="polite"
            >
              Fecha seleccionada: {currentDate}
            </div>
          )}
        </div>
        
        {/* Opción: Otra fecha */}
        <div className="date-option-container">
          <button
            type="button"
            className={`date-option ${dateType === "custom" ? "selected" : ""}`}
            onClick={() => handleDateTypeChange("custom")}
            onKeyDown={handleKeyDown}
            data-type="custom"
            role="radio"
            aria-checked={dateType === "custom"}
            aria-describedby="custom-date-input"
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Otra fecha</span>
            <span className="calendar-icon" aria-hidden="true">📅</span>
          </button>
          
          {/* Input para fecha personalizada */}
          {dateType === "custom" && (
            <div 
              id="custom-date-input"
              className="custom-date-input"
              style={{ marginTop: "0.5rem" }}
            >
              <label 
                htmlFor="customDate" 
                style={{ 
                  fontSize: fontSize.body, 
                  fontFamily,
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#495057"
                }}
              >
                Ingrese la fecha (DD/MM/AAAA):
              </label>
              
              <input
                id="customDate"
                type="text"
                value={customDate}
                onChange={handleCustomDateChange}
                placeholder="DD/MM/AAAA"
                aria-describedby={errors.customDate ? "customDate-error" : "date-format-hint"}
                aria-invalid={errors.customDate ? "true" : "false"}
                className="coordinates-input"
                style={{ 
                  fontSize: fontSize.body, 
                  fontFamily,
                  padding: "0.75rem",
                  border: errors.customDate ? "2px solid #dc3545" : "2px solid #dee2e6",
                  borderRadius: "6px",
                  transition: "border-color 0.2s"
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleContinue();
                  }
                }}
              />
              
              <ValidationError 
                error={errors.customDate}
                fieldName="customDate"
                id="customDate-error"
              />
              
              <div 
                id="date-format-hint" 
                className="input-hint"
                style={{ 
                  fontSize: "0.85rem", 
                  color: "#6c757d", 
                  marginTop: "0.25rem" 
                }}
              >
                Formato: día, mes, año separados por barras (ej: 25/07/2024)
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="step-actions">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Cerrar cuestionario"
        >
          Cerrar
        </button>
        <button
          type="button"
          onClick={handleContinue}
          className="btn-primary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Continuar al siguiente paso"
          disabled={dateType === "custom" && !customDate.trim()}
        >
          <span className="arrow-right" aria-hidden="true">▶</span>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default DateStep;