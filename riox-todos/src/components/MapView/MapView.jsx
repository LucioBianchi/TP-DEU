import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useBalnearios } from "../../hooks/useBalnearios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import BalnearioModal from "../Modal/BalnearioModal";
import "./MapView.css";

// Arreglar el problema de los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Crear icono personalizado
const createCustomIcon = (color = "#007bff", balnearioName = "", aguaLevel = "", arenaLevel = "") => {
  const getContaminationDescription = (agua, arena) => {
    const aguaText = agua === "Alto" ? "contaminación alta" : agua === "Medio" ? "contaminación media" : "contaminación baja";
    const arenaText = arena === "Alto" ? "contaminación alta" : arena === "Medio" ? "contaminación media" : "contaminación baja";
    return `Agua: ${aguaText}, Arena: ${arenaText}`;
  };

  const getAccessibilityLevel = (agua, arena) => {
    if (agua === "Alto" || arena === "Alto") {
      return "No recomendado para uso recreativo";
    } else if (agua === "Medio" || arena === "Medio") {
      return "Precaución recomendada";
    } else {
      return "Seguro para uso recreativo";
    }
  };

  return L.divIcon({
    html: `
      <div 
        class="custom-marker" 
        role="button" 
        tabindex="0"
        aria-label="Balneario ${balnearioName}. ${getContaminationDescription(aguaLevel, arenaLevel)}. ${getAccessibilityLevel(aguaLevel, arenaLevel)}. Presiona Enter o Espacio para ver información detallada"
        style="cursor: pointer; outline: none;"
      >
        <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 8.5 12 24 12 24s12-15.5 12-24c0-6.63-5.37-12-12-12z" fill="${color}"/>
          <circle cx="12" cy="12" r="6" fill="white"/>
        </svg>
      </div>
    `,
    className: "custom-marker-container",
    iconSize: [24, 36],
    iconAnchor: [12, 36],
    popupAnchor: [0, -36]
  });
};

export default function MapView({ filters }) {
  const { balnearios } = useBalnearios(filters);
  const [openPopupId, setOpenPopupId] = useState(null);

  // Función para obtener el color según el nivel de contaminación
  const getContaminationColor = (nivel) => {
    switch (nivel) {
      case "Bajo":
        return "#28a745";
      case "Medio":
        return "#ffc107";
      case "Alto":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  // Función para obtener el texto descriptivo
  const getContaminationText = (nivel) => {
    switch (nivel) {
      case "Bajo":
        return "Contaminación baja - Seguro para uso recreativo";
      case "Medio":
        return "Contaminación media - Precaución recomendada";
      case "Alto":
        return "Contaminación alta - No recomendado para uso recreativo";
      default:
        return "Información no disponible";
    }
  };

  // Manejar Escape para cerrar popup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && openPopupId) {
        e.preventDefault();
        setOpenPopupId(null);
        // Cerrar todos los popups de Leaflet
        const popups = document.querySelectorAll('.leaflet-popup');
        popups.forEach(popup => {
          if (popup._leaflet_id) {
            popup._leaflet_map.closePopup();
          }
        });
      }
    };

    if (openPopupId) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [openPopupId]);

  // Asegurar que los marcadores sean accesibles por teclado
  useEffect(() => {
    const markers = document.querySelectorAll('.custom-marker');
    markers.forEach(marker => {
      // Asegurar que los marcadores sean focusables
      marker.setAttribute('tabindex', '0');
      
      // Agregar manejo de teclado adicional
      const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          marker.click();
        }
      };
      
      marker.addEventListener('keydown', handleKeyDown);
      
      return () => {
        marker.removeEventListener('keydown', handleKeyDown);
      };
    });
  }, [balnearios]);

  return (
    <MapContainer 
      center={[-34.6037, -58.3816]} 
      zoom={13} 
      style={{ height: "100vh", width: "100%" }} 
      aria-label="Mapa de balnearios"
    >
      <TileLayer
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {balnearios.map(b => (
        <Marker 
          key={b.id} 
          position={[b.lat, b.lng]}
          icon={createCustomIcon(getContaminationColor(b.agua), b.nombre, b.agua, b.arena)}
          eventHandlers={{
            click: () => setOpenPopupId(b.id),
            keydown: (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpenPopupId(b.id);
              }
            }
          }}
        >
          <Popup
            onOpen={() => setOpenPopupId(b.id)}
            onClose={() => setOpenPopupId(null)}
            aria-label={`Información detallada de ${b.nombre}`}
          >
            <div 
              style={{ 
                minWidth: "300px", 
                maxWidth: "400px",
                padding: "0"
              }}
              role="dialog"
              aria-labelledby={`popup-title-${b.id}`}
              aria-describedby={`popup-content-${b.id}`}
            >
              {/* Header */}
              <div style={{
                background: "#f8f9fa",
                padding: "1rem",
                borderBottom: "1px solid #dee2e6",
                borderRadius: "8px 8px 0 0"
              }}>
                <h3 
                  id={`popup-title-${b.id}`}
                  style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "1.2em",
                    fontWeight: "bold",
                    color: "#495057"
                  }}
                >
                  {b.nombre}
                </h3>
                <p style={{
                  margin: "0",
                  fontSize: "0.9em",
                  color: "#6c757d"
                }}>
                  <strong>Localidad:</strong> {b.localidad}
                </p>
              </div>

              {/* Contenido */}
              <div 
                id={`popup-content-${b.id}`}
                style={{ padding: "1rem" }}
              >
                {/* Descripción */}
                <p style={{
                  margin: "0 0 1rem 0",
                  color: "#495057",
                  lineHeight: "1.5"
                }}>
                  {b.descripcion}
                </p>

                {/* Estado de contaminación */}
                <div style={{
                  marginBottom: "1rem"
                }}>
                  <h4 style={{
                    margin: "0 0 0.75rem 0",
                    fontSize: "1em",
                    color: "#495057"
                  }}>
                    Estado de Contaminación
                  </h4>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.75rem"
                  }}>
                    <div style={{
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "2px solid",
                      borderColor: getContaminationColor(b.agua),
                      background: "#f8f9fa"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.25rem"
                      }}>
                        <div style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: getContaminationColor(b.agua)
                        }} />
                        <span style={{
                          fontWeight: "bold",
                          fontSize: "0.9em",
                          color: getContaminationColor(b.agua)
                        }}>
                          Agua: {b.agua}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: "0.8em",
                        color: "#6c757d"
                      }}>
                        {getContaminationText(b.agua)}
                      </p>
                    </div>

                    <div style={{
                      padding: "0.75rem",
                      borderRadius: "6px",
                      border: "2px solid",
                      borderColor: getContaminationColor(b.arena),
                      background: "#f8f9fa"
                    }}>
                      <div style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        marginBottom: "0.25rem"
                      }}>
                        <div style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          backgroundColor: getContaminationColor(b.arena)
                        }} />
                        <span style={{
                          fontWeight: "bold",
                          fontSize: "0.9em",
                          color: getContaminationColor(b.arena)
                        }}>
                          Arena: {b.arena}
                        </span>
                      </div>
                      <p style={{
                        margin: 0,
                        fontSize: "0.8em",
                        color: "#6c757d"
                      }}>
                        {getContaminationText(b.arena)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recomendaciones */}
                <div style={{
                  padding: "0.75rem",
                  background: "#e3f2fd",
                  borderRadius: "6px",
                  borderLeft: "4px solid #007bff"
                }}>
                  <h4 style={{
                    margin: "0 0 0.5rem 0",
                    fontSize: "0.9em",
                    color: "#495057"
                  }}>
                    Recomendación
                  </h4>
                  <p style={{
                    margin: 0,
                    fontSize: "0.85em",
                    color: "#495057",
                    lineHeight: "1.4"
                  }}>
                    {b.agua === "Alto" || b.arena === "Alto" 
                      ? "Se recomienda evitar el uso recreativo de este balneario debido a los altos niveles de contaminación detectados."
                      : "Este balneario presenta condiciones aceptables para uso recreativo, pero siempre es recomendable verificar las condiciones actuales antes de visitar."
                    }
                  </p>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}