import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";
import { useBalnearios } from "../../../hooks/useBalnearios";
import { useFormValidation } from "../../../hooks/useFormValidation";
import ValidationError from "../../common/ValidationError";

const LocationStep = ({ onNext, onBack, onClose, dateData }) => {
  const { config } = useConfig();
  const { uniqueValues, loading, error } = useBalnearios();
  const { errors, validateField, clearError } = useFormValidation();
  const [locationType, setLocationType] = useState("locality");
  const [selectedLocality, setSelectedLocality] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: "",
    longitude: ""
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
  
  const handleLocationTypeChange = (newType) => {
    setLocationType(newType);
    if (newType === "locality") {
      setCoordinates({ latitude: "", longitude: "" });
      clearError('selectedLocality');
    } else {
      setSelectedLocality("");
      clearError('coordinates');
    }
  };

  const handleSelectedLocalityChange = (e) => {
    setSelectedLocality(e.target.value);
    if (errors.selectedLocality) {
      clearError('selectedLocality');
    }
  };

  const handleCoordinateChange = (field, value) => {
    setCoordinates(prev => ({ ...prev, [field]: value }));
    if (errors.coordinates) {
      clearError('coordinates');
    }
  };

  const handleContinue = () => {
    let locationData;
    
    if (locationType === "locality") {
      // Validar selección de localidad
      const error = validateField(selectedLocality, 'required', 'selectedLocality');
      if (error) return;

      const selectedLocalityData = uniqueValues.localidades.find(b => b.nombre === selectedLocality);
      locationData = {
        id: selectedLocalityData?.id,
        locationType: "locality",
        selectedLocality,
        coordinates: null
      };
    } else {
      // Validar coordenadas
      const error = validateField(coordinates, 'coordinates', 'coordinates', uniqueValues.localidades);
      if (error) return;

      locationData = {
        locationType: "coordinates",
        selectedLocality: null,
        coordinates: {
          latitude: parseFloat(coordinates.latitude),
          longitude: parseFloat(coordinates.longitude)
        }
      };
    }
    
    onNext(locationData);
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleLocationTypeChange(e.currentTarget.dataset.type);
    }
  };
  
  const isFormValid = () => {
    if (locationType === "locality") {
      return selectedLocality.trim() !== "";
    } else {
      return coordinates.latitude.trim() !== "" && coordinates.longitude.trim() !== "";
    }
  };
  
  // Mostrar loading mientras se cargan las localidades
  if (loading) {
    return (
      <div className="form-step">
        <h2 className="step-title">Cargando localidades...</h2>
        <div className="loading-spinner">⏳</div>
      </div>
    );
  }
  
  // Mostrar error si falla la carga
  if (error) {
    return (
      <div className="form-step">
        <h2 className="step-title">Error al cargar localidades</h2>
        <p className="error-message">No se pudieron cargar las localidades. Por favor, intente nuevamente.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn-primary"
          style={{ fontSize: fontSize.button, fontFamily }}
        >
          Reintentar
        </button>
      </div>
    );
  }
  
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
      
      <div className="location-options" role="radiogroup" aria-labelledby="location-step-title">
        {/* Opción: Por Localidad */}
        <div className="location-option-container">
          <button
            type="button"
            className={`location-option ${locationType === "locality" ? "selected" : ""}`}
            onClick={() => handleLocationTypeChange("locality")}
            onKeyDown={handleKeyDown}
            data-type="locality"
            role="radio"
            aria-checked={locationType === "locality"}
            aria-describedby="locality-selection"
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Seleccionar localidad</span>
            <span className="location-icon" aria-hidden="true">🏖️</span>
          </button>
          
          {/* Selector de localidad */}
          {locationType === "locality" && (
            <div 
              id="locality-selection"
              className="locality-selection"
              style={{ marginTop: "0.5rem" }}
            >
              <label 
                htmlFor="localitySelect" 
                style={{ 
                  fontSize: fontSize.body, 
                  fontFamily,
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600"
                }}
              >
                Elija la localidad:
              </label>
              <select
                id="localitySelect"
                value={selectedLocality}
                onChange={handleSelectedLocalityChange}
                className={errors.selectedLocality ? "input-error" : ""}
                aria-describedby={errors.selectedLocality ? "selectedLocality-error" : "locality-hint"}
                aria-invalid={errors.selectedLocality ? "true" : "false"}
                style={{ 
                  fontSize: fontSize.body, 
                  fontFamily,
                  width: "100%",
                  padding: "0.75rem",
                  border: errors.selectedLocality ? "2px solid #dc3545" : "2px solid #dee2e6",
                  borderRadius: "6px",
                  transition: "border-color 0.2s"
                }}
              >
                <option value=""> Seleccione una localidad </option>
                {uniqueValues.localidades && uniqueValues.localidades.map((locality) => (
                  <option key={locality.id} value={locality.nombre}>
                    {locality.nombre}
                  </option>
                ))}
              </select>
              
              <ValidationError 
                error={errors.selectedLocality}
                fieldName="selectedLocality"
                id="selectedLocality-error"
              />
              
              <div 
                id="locality-hint" 
                className="input-hint"
                style={{ 
                  fontSize: "0.85rem", 
                  color: "#6c757d", 
                  marginTop: "0.25rem" 
                }}
              >
                Seleccione de la lista de balnearios disponibles
              </div>
            </div>
          )}
        </div>
        
        {/* Opción: Por Coordenadas */}
        <div className="location-option-container">
          <button
            type="button"
            className={`location-option ${locationType === "coordinates" ? "selected" : ""}`}
            onClick={() => handleLocationTypeChange("coordinates")}
            onKeyDown={handleKeyDown}
            data-type="coordinates"
            role="radio"
            aria-checked={locationType === "coordinates"}
            aria-describedby="coordinates-input"
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Ingresar coordenadas manualmente</span>
            <span className="coordinates-icon" aria-hidden="true">📍</span>
          </button>
          
          {/* Inputs para coordenadas */}
          {locationType === "coordinates" && (
            <div 
              id="coordinates-input"
              className="coordinates-input"
              style={{ marginTop: "0.5rem" }}
            >
              <div className="coordinates-inputs">
                <div>
                  <label 
                    htmlFor="latitude" 
                    style={{ 
                      fontSize: fontSize.body, 
                      fontFamily,
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600"
                    }}
                  >
                    Latitud:
                  </label>
                  <input
                    id="latitude"
                    type="number"
                    step="any"
                    value={coordinates.latitude}
                    onChange={(e) => handleCoordinateChange("latitude", e.target.value)}
                    placeholder="Ej: -34.8167"
                    className={errors.coordinates ? "input-error" : ""}
                    aria-describedby={errors.coordinates ? "coordinates-error" : "latitude-hint"}
                    aria-invalid={errors.coordinates ? "true" : "false"}
                    style={{ 
                      fontSize: fontSize.body, 
                      fontFamily,
                      width: "100%",
                      padding: "0.75rem",
                      border: errors.coordinates ? "2px solid #dc3545" : "2px solid #dee2e6",
                      borderRadius: "6px",
                      transition: "border-color 0.2s"
                    }}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="longitude" 
                    style={{ 
                      fontSize: fontSize.body, 
                      fontFamily,
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600"
                    }}
                  >
                    Longitud:
                  </label>
                  <input
                    id="longitude"
                    type="number"
                    step="any"
                    value={coordinates.longitude}
                    onChange={(e) => handleCoordinateChange("longitude", e.target.value)}
                    placeholder="Ej: -57.9833"
                    className={errors.coordinates ? "input-error" : ""}
                    aria-describedby={errors.coordinates ? "coordinates-error" : "longitude-hint"}
                    aria-invalid={errors.coordinates ? "true" : "false"}
                    style={{ 
                      fontSize: fontSize.body, 
                      fontFamily,
                      width: "100%",
                      padding: "0.75rem",
                      border: errors.coordinates ? "2px solid #dc3545" : "2px solid #dee2e6",
                      borderRadius: "6px",
                      transition: "border-color 0.2s"
                    }}
                  />
                </div>
              </div>
              
              <ValidationError 
                error={errors.coordinates}
                fieldName="coordinates"
                id="coordinates-error"
              />
              
              <div 
                id="latitude-hint" 
                className="input-hint"
                style={{ 
                  fontSize: "0.85rem", 
                  color: "#6c757d", 
                  marginTop: "0.25rem" 
                }}
              >
                Valor decimal (ej: -34.8167)
              </div>
              <div 
                id="longitude-hint" 
                className="input-hint"
                style={{ 
                  fontSize: "0.85rem", 
                  color: "#6c757d", 
                  marginTop: "0.25rem" 
                }}
              >
                Valor decimal (ej: -57.9833)
              </div>
            </div>
          )}
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

export default LocationStep;