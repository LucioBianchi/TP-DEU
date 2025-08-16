import React, { useState } from "react";
import { useConfig } from "../../../context/ConfigContext";

const LocationStep = ({ onNext, onBack, onClose, dateData }) => {
  const { config } = useConfig();
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
  
  // Lista de localidades disponibles (esto debería venir de una API)
  const availableLocalities = [
    "Punta Lara",
    "Balneario Municipal de La Plata",
    "Balneario El Rincón",
    "Playa de Berisso",
    "Balneario San Fernando",
    "Playa Vicente López",
    "Balneario Quilmes",
    "Balneario Tigre",
    "Playa de Ensenada",
    "Balneario Magdalena"
  ];
  
  const handleLocationTypeChange = (newType) => {
    setLocationType(newType);
    if (newType === "locality") {
      setCoordinates({ latitude: "", longitude: "" });
    } else {
      setSelectedLocality("");
    }
  };
  
  const handleContinue = () => {
    let locationData;
    
    if (locationType === "locality") {
      if (!selectedLocality) {
        alert("Por favor seleccione una localidad");
        return;
      }
      locationData = {
        locationType: "locality",
        selectedLocality,
        coordinates: null
      };
    } else {
      if (!coordinates.latitude || !coordinates.longitude) {
        alert("Por favor ingrese ambas coordenadas");
        return;
      }
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
      if (e.target.type === 'radio') {
        const value = e.target.value;
        handleLocationTypeChange(value);
      }
    }
  };
  
  const isFormValid = () => {
    if (locationType === "locality") {
      return selectedLocality.trim() !== "";
    } else {
      return coordinates.latitude.trim() !== "" && coordinates.longitude.trim() !== "";
    }
  };
  
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
          <input
            type="radio"
            id="location-locality"
            name="locationType"
            value="locality"
            checked={locationType === "locality"}
            onChange={() => handleLocationTypeChange("locality")}
            onKeyDown={handleKeyDown}
            aria-describedby="locality-selection"
            style={{ fontSize: fontSize.body, fontFamily }}
          />
          <label 
            htmlFor="location-locality"
            className={`location-option ${locationType === "locality" ? "selected" : ""}`}
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Seleccionar localidad existente</span>
            <span className="location-icon" aria-hidden="true">🏖️</span>
          </label>
          
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
                onChange={(e) => setSelectedLocality(e.target.value)}
                style={{ 
                  fontSize: fontSize.body, 
                  fontFamily,
                  width: "100%",
                  padding: "0.75rem",
                  border: "2px solid #dee2e6",
                  borderRadius: "6px",
                  transition: "border-color 0.2s"
                }}
                aria-describedby="locality-hint"
              >
                <option value="">-- Seleccione una localidad --</option>
                {availableLocalities.map((locality, index) => (
                  <option key={index} value={locality}>
                    {locality}
                  </option>
                ))}
              </select>
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
          <input
            type="radio"
            id="location-coordinates"
            name="locationType"
            value="coordinates"
            checked={locationType === "coordinates"}
            onChange={() => handleLocationTypeChange("coordinates")}
            onKeyDown={handleKeyDown}
            aria-describedby="coordinates-input"
            style={{ fontSize: fontSize.body, fontFamily }}
          />
          <label 
            htmlFor="location-coordinates"
            className={`location-option ${locationType === "coordinates" ? "selected" : ""}`}
            style={{ fontSize: fontSize.body, fontFamily }}
          >
            <span className="radio-custom" aria-hidden="true"></span>
            <span className="option-text">Ingresar coordenadas manualmente</span>
            <span className="coordinates-icon" aria-hidden="true">📍</span>
          </label>
          
          {/* Inputs para coordenadas */}
          {locationType === "coordinates" && (
            <div 
              id="coordinates-input"
              className="coordinates-input"
              style={{ marginTop: "0.5rem" }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
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
                    onChange={(e) => setCoordinates(prev => ({ ...prev, latitude: e.target.value }))}
                    placeholder="Ej: -34.8167"
                    style={{ 
                      fontSize: fontSize.body, 
                      fontFamily,
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #dee2e6",
                      borderRadius: "6px",
                      transition: "border-color 0.2s"
                    }}
                    aria-describedby="latitude-hint"
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
                    onChange={(e) => setCoordinates(prev => ({ ...prev, longitude: e.target.value }))}
                    placeholder="Ej: -57.9833"
                    style={{ 
                      fontSize: fontSize.body, 
                      fontFamily,
                      width: "100%",
                      padding: "0.75rem",
                      border: "2px solid #dee2e6",
                      borderRadius: "6px",
                      transition: "border-color 0.2s"
                    }}
                    aria-describedby="longitude-hint"
                  />
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
        >
          <span className="arrow-right" aria-hidden="true">▶</span>
          Continuar
        </button>
      </div>
    </div>
  );
};

export default LocationStep;