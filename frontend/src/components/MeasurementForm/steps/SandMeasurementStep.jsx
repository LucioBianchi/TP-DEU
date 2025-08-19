import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import { useFormValidation } from "../../../hooks/useFormValidation";
import ValidationError from "../../common/ValidationError";

const SandMeasurementStep = ({ onNext, onBack, onClose, dateData, locationData, contaminationData }) => {
  const { config } = useConfig();
  const { errors, validateField, clearError } = useFormValidation();
  const [measurements, setMeasurements] = useState({
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
    // Validar solo E. coli y enterococos (sin metros)
    const fieldsToValidate = [
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
        eColi: parseFloat(measurements.eColi) || 0,
        enterococci: parseFloat(measurements.enterococci) || 0
      }
    });
  };
  
  const isFormValid = () => {
    return measurements.eColi.trim() !== "" && 
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
      
      {/* Recordatorio de metros */}
      <div 
        className="recommendation-box"
        tabIndex={0}
        role="note"
        aria-label="Recomendación importante: Se recomienda tomar la muestra recorriendo un tramo de 100 metros."
      >
        <div className="recommendation-icon">ℹ️</div>
        <div className="recommendation-content">
          <strong>Recomendación:</strong> Se recomienda tomar la muestra recorriendo un tramo de 100 metros.
        </div>
      </div>
      
      <div className="coordinates-input">
        <div className="coordinates-inputs">
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
              className={errors.eColi ? "input-error" : ""}
              aria-describedby={errors.eColi ? "sand-ecoli-error" : "sand-ecoli-hint"}
              aria-invalid={errors.eColi ? "true" : "false"}
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                width: "100%",
                padding: "0.75rem",
                border: errors.eColi ? "2px solid #dc3545" : "2px solid #dee2e6",
                borderRadius: "6px",
                transition: "border-color 0.2s"
              }}
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
              className={errors.enterococci ? "input-error" : ""}
              aria-describedby={errors.enterococci ? "sand-enterococci-error" : "sand-enterococci-hint"}
              aria-invalid={errors.enterococci ? "true" : "false"}
              style={{ 
                fontSize: fontSize.body, 
                fontFamily,
                width: "100%",
                padding: "0.75rem",
                border: errors.enterococci ? "2px solid #dc3545" : "2px solid #dee2e6",
                borderRadius: "6px",
                transition: "border-color 0.2s"
              }}
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