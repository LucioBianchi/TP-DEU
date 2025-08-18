import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import { useFormValidation } from "../../../hooks/useFormValidation";
import ValidationError from "../../common/ValidationError";

const SandMeasurementStep = ({ onNext, onBack, onClose, dateData, locationData, contaminationData }) => {
  const { config } = useConfig();
  const { errors, validateField, clearError } = useFormValidation();
  const [measurements, setMeasurements] = useState({
    metersTraveled: "",
    eColi: "",
    enterococci: ""
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
      default: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      dyslexic: "'OpenDyslexic', Arial, sans-serif",
      serif: "Georgia, serif",
      monospace: "'Courier New', monospace"
    };
    return fontMap[config.fontFamily] || fontMap.default;
  };
  
  const fontSize = getFontSize();
  const fontFamily = getFontFamily();
  
  const handleInputChange = (field, value) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando el usuario escriba
    if (errors[field]) {
      clearError(field);
    }
  };

  const handleContinue = () => {
    // Validar todos los campos
    const fieldsToValidate = [
      { value: measurements.metersTraveled, validatorType: 'positiveNumber', fieldName: 'metersTraveled' },
      { value: measurements.eColi, validatorType: 'positiveNumber', fieldName: 'eColi' },
      { value: measurements.enterococci, validatorType: 'positiveNumber', fieldName: 'enterococci' }
    ];
    
    let allValid = true;
    fieldsToValidate.forEach(({ value, validatorType, fieldName }) => {
      const error = validateField(value, validatorType, fieldName);
      if (error) allValid = false;
    });
    
    if (!allValid) return;
    
    onNext({
      sandMeasurements: {
        metersTraveled: parseFloat(measurements.metersTraveled) || 0,
        eColi: parseFloat(measurements.eColi) || 0,
        enterococci: parseFloat(measurements.enterococci) || 0
      }
    });
  };

  const isFormValid = () => {
    return measurements.metersTraveled.trim() !== "" && 
           measurements.eColi.trim() !== "" && 
           measurements.enterococci.trim() !== "";
  };
  
  return (
    <div 
      className="form-step"
      role="region"
      aria-labelledby="sand-measurement-step-title"
    >
      <h2 
        id="sand-measurement-step-title"
        style={{ fontSize: fontSize.title, fontFamily }}
        className="step-title"
      >
        <span className="contamination-icon" aria-hidden="true">🏖️</span>
        Contaminación de la arena
      </h2>
      
      <div className="coordinates-input">
        <div className="coordinates-inputs">
          {/* Metros recorridos */}
          <div>
            <label 
              htmlFor="sandMetersTraveled" 
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600"
              }}
            >
              Metros recorridos:
            </label>
            <input
              id="sandMetersTraveled"
              type="number"
              min="0"
              step="0.1"
              value={measurements.metersTraveled}
              onChange={(e) => handleInputChange("metersTraveled", e.target.value)}
              placeholder="Ej: 100"
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #dee2e6",
                borderRadius: "6px",
                transition: "border-color 0.2s"
              }}
              aria-describedby="sand-meters-hint"
              tabIndex={0}
            />
            <ValidationError 
              error={errors.metersTraveled}
              fieldName="metersTraveled"
              id="sand-meters-error"
            />
            <div 
              id="sand-meters-hint" 
              className="input-hint"
              style={{ 
                fontSize: "0.85rem", 
                color: "#6c757d", 
                marginTop: "0.25rem" 
              }}
            >
              Distancia recorrida para la medición en metros
            </div>
          </div>
          
          {/* E. coli */}
          <div>
            <label 
              htmlFor="sandEColi" 
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600"
              }}
            >
              E. coli (UFC/100 g):
            </label>
            <input
              id="sandEColi"
              type="number"
              min="0"
              step="0.1"
              value={measurements.eColi}
              onChange={(e) => handleInputChange("eColi", e.target.value)}
              placeholder="Ej: 25"
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #dee2e6",
                borderRadius: "6px",
                transition: "border-color 0.2s"
              }}
              aria-describedby="sand-ecoli-hint"
              tabIndex={0}
            />
            <ValidationError 
              error={errors.eColi}
              fieldName="eColi"
              id="sand-ecoli-error"
            />
            <div 
              id="sand-ecoli-hint" 
              className="input-hint"
              style={{ 
                fontSize: "0.85rem", 
                color: "#6c757d", 
                marginTop: "0.25rem" 
              }}
            >
              Concentración de Escherichia coli en UFC por 100 gramos de arena
            </div>
          </div>
          
          {/* Enterococos */}
          <div>
            <label 
              htmlFor="sandEnterococci" 
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "600"
              }}
            >
              Enterococos (UFC/100 g):
            </label>
            <input
              id="sandEnterococci"
              type="number"
              min="0"
              step="0.1"
              value={measurements.enterococci}
              onChange={(e) => handleInputChange("enterococci", e.target.value)}
              placeholder="Ej: 10"
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                width: "100%",
                padding: "0.75rem",
                border: "2px solid #dee2e6",
                borderRadius: "6px",
                transition: "border-color 0.2s"
              }}
              aria-describedby="sand-enterococci-hint"
              tabIndex={0}
            />
            <ValidationError 
              error={errors.enterococci}
              fieldName="enterococci"
              id="sand-enterococci-error"
            />
            <div 
              id="sand-enterococci-hint" 
              className="input-hint"
              style={{ 
                fontSize: "0.85rem", 
                color: "#6c757d", 
                marginTop: "0.25rem" 
              }}
            >
              Concentración de Enterococos en UFC por 100 gramos de arena
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
          disabled={!isFormValid()}
          tabIndex={0}
        >
          <span className="arrow-right" aria-hidden="true">▶</span>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default SandMeasurementStep;