import React, { useState, useRef, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";
import "./MeasurementForm.css";

// Componente para el paso de fecha de medición
const DateStep = ({ onNext, onClose }) => {
  const { config } = useConfig();
  const [dateType, setDateType] = useState("current");
  const [customDate, setCustomDate] = useState("25/07/2024");
  
  const getFontSize = (baseSize) => {
    const sizeMap = {
      small: { title: '1.2rem', body: '0.9rem', button: '0.95rem' },
      medium: { title: '1.4rem', body: '1rem', button: '1rem' },
      large: { title: '1.6rem', body: '1.1rem', button: '1.1rem' }
    };
    return sizeMap[config.textSize] || sizeMap.medium;
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
      
      <div className="date-options">
        <label 
          className={`date-option ${dateType === "current" ? "selected" : ""}`}
          style={{ fontSize: fontSize.body, fontFamily }}
        >
          <input
            type="radio"
            name="dateType"
            value="current"
            checked={dateType === "current"}
            onChange={(e) => setDateType(e.target.value)}
            aria-label="Seleccionar fecha actual"
          />
          <span className="radio-custom"></span>
          <span className="option-text">Fecha actual</span>
          <span className="calendar-icon" aria-hidden="true">📅</span>
        </label>
        
        <label 
          className={`date-option ${dateType === "custom" ? "selected" : ""}`}
          style={{ fontSize: fontSize.body, fontFamily }}
        >
          <input
            type="radio"
            name="dateType"
            value="custom"
            checked={dateType === "custom"}
            onChange={(e) => setDateType(e.target.value)}
            aria-label="Seleccionar otra fecha"
          />
          <span className="radio-custom"></span>
          <span className="option-text">Otra fecha</span>
          <span className="calendar-icon" aria-hidden="true">📅</span>
        </label>
      </div>
      
      {dateType === "custom" && (
        <div className="custom-date-input">
          <label htmlFor="customDate" style={{ fontSize: fontSize.body, fontFamily }}>
            Fecha:
          </label>
          <input
            id="customDate"
            type="text"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            placeholder="DD/MM/AAAA"
            style={{ fontSize: fontSize.body, fontFamily }}
            aria-describedby="date-format-hint"
          />
          <span id="date-format-hint" className="sr-only">
            Formato: día, mes, año separados por barras
          </span>
        </div>
      )}
      
      <div className="step-actions">
        <button
          onClick={onClose}
          className="btn-secondary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Cerrar cuestionario"
        >
          Cerrar
        </button>
        <button
          onClick={() => onNext({ dateType, customDate })}
          className="btn-primary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Continuar al siguiente paso"
        >
          <span className="arrow-right" aria-hidden="true">▶</span>
          Continuar
        </button>
      </div>
    </div>
  );
};

// Componente para el paso de ubicación
const LocationStep = ({ onNext, onBack, onClose, dateData }) => {
  const { config } = useConfig();
  const [locationType, setLocationType] = useState("coordinates");
  const [longitude, setLongitude] = useState("-34.6037");
  const [latitude, setLatitude] = useState("-58.3816");
  const [locality, setLocality] = useState("Ensenada");
  
  const getFontSize = (baseSize) => {
    const sizeMap = {
      small: { title: '1.2rem', body: '0.9rem', button: '0.95rem' },
      medium: { title: '1.4rem', body: '1rem', button: '1rem' },
      large: { title: '1.6rem', body: '1.1rem', button: '1.1rem' }
    };
    return sizeMap[config.textSize] || sizeMap.medium;
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
  
  return (
    <div 
      className="form-step"
      role="region"
      aria-labelledby="location-step-title"
    >
      <h2 
        id="location-step-title"
        style={{ fontSize: fontSize.title, fontFamily }}
        className="step-title"
      >
        Ubicación de la medición
      </h2>
      
      <div className="location-options">
        <label 
          className={`location-option ${locationType === "current" ? "selected" : ""}`}
          style={{ fontSize: fontSize.body, fontFamily }}
        >
          <input
            type="radio"
            name="locationType"
            value="current"
            checked={locationType === "current"}
            onChange={(e) => setLocationType(e.target.value)}
            aria-label="Usar ubicación actual"
          />
          <span className="radio-custom"></span>
          <span className="option-text">Ubicación Actual</span>
          <span className="location-icon" aria-hidden="true">📍</span>
        </label>
        
        <label 
          className={`location-option ${locationType === "coordinates" ? "selected" : ""}`}
          style={{ fontSize: fontSize.body, fontFamily }}
        >
          <input
            type="radio"
            name="locationType"
            value="coordinates"
            checked={locationType === "coordinates"}
            onChange={(e) => setLocationType(e.target.value)}
            aria-label="Usar coordenadas específicas"
          />
          <span className="radio-custom"></span>
          <span className="option-text">Coordenadas</span>
          <span className="location-icon" aria-hidden="true">📍</span>
        </label>
      </div>
      
      {locationType === "coordinates" && (
        <div className="coordinates-inputs">
          <div className="input-group">
            <label htmlFor="longitude" style={{ fontSize: fontSize.body, fontFamily }}>
              Longitud:
            </label>
            <input
              id="longitude"
              type="text"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="-34.6037"
              style={{ fontSize: fontSize.body, fontFamily }}
              aria-describedby="longitude-hint"
            />
            <span id="longitude-hint" className="sr-only">
              Coordenada de longitud en formato decimal
            </span>
          </div>
          
          <div className="input-group">
            <label htmlFor="latitude" style={{ fontSize: fontSize.body, fontFamily }}>
              Latitud:
            </label>
            <input
              id="latitude"
              type="text"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="-58.3816"
              style={{ fontSize: fontSize.body, fontFamily }}
              aria-describedby="latitude-hint"
            />
            <span id="latitude-hint" className="sr-only">
              Coordenada de latitud en formato decimal
            </span>
          </div>
        </div>
      )}
      
      <div className="locality-input">
        <label htmlFor="locality" style={{ fontSize: fontSize.body, fontFamily }}>
          Localidad:
        </label>
        <select
          id="locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          style={{ fontSize: fontSize.body, fontFamily }}
          aria-describedby="locality-hint"
        >
          <option value="Ensenada">Ensenada</option>
          <option value="La Plata">La Plata</option>
          <option value="Berisso">Berisso</option>
          <option value="Quilmes">Quilmes</option>
          <option value="San Fernando">San Fernando</option>
          <option value="Vicente López">Vicente López</option>
          <option value="Tigre">Tigre</option>
          <option value="Magdalena">Magdalena</option>
        </select>
        <span id="locality-hint" className="sr-only">
          Selecciona la localidad donde se realizó la medición
        </span>
      </div>
      
      <div className="step-actions">
        <button
          onClick={onBack}
          className="btn-secondary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Volver al paso anterior"
        >
          ← Volver
        </button>
        <button
          onClick={() => onNext({ 
            locationType, 
            longitude, 
            latitude, 
            locality 
          })}
          className="btn-primary"
          style={{ fontSize: fontSize.button, fontFamily }}
          aria-label="Continuar al siguiente paso"
        >
          <span className="arrow-right" aria-hidden="true">▶</span>
          Continuar
        </button>
      </div>
    </div>
  );
};

// Componente principal del formulario
const MeasurementForm = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  // Focus trap y manejo de teclado
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  const handleNext = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = (finalStepData) => {
    const completeData = { ...formData, ...finalStepData };
    onSubmit(completeData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="measurement-form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="measurement-form-modal"
        role="document"
        aria-label="Formulario de medición"
      >
        {/* Barra superior */}
        <div className="form-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="close-button"
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>
        
        {/* Contenido del formulario */}
        <div className="form-content">
          {currentStep === 1 && (
            <DateStep 
              onNext={handleNext}
              onClose={onClose}
            />
          )}
          
          {currentStep === 2 && (
            <LocationStep 
              onNext={handleSubmit}
              onBack={handleBack}
              onClose={onClose}
              dateData={formData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;