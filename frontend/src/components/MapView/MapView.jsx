import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useBalnearios } from "../../hooks/useBalnearios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
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
  const popupRefs = useRef({});

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
    // Solo el marker activo debe ser focuseable
    const containers = document.querySelectorAll('.leaflet-marker-icon.custom-marker-container');
    containers.forEach(container => {
      const marker = container.querySelector('.custom-marker');
      if (openPopupId) {
        if (marker && marker.getAttribute('aria-label')?.includes(balnearios.find(b => b.id === openPopupId)?.nombre)) {
          container.setAttribute('tabindex', '0');
        } else {
          container.setAttribute('tabindex', '-1');
        }
      } else {
        container.setAttribute('tabindex', '0');
      }
    });
  }, [openPopupId, balnearios]);

  useEffect(() => {
    if (!openPopupId) return;

    // Encuentra todos los elementos focuseables dentro del popup
    const popup = document.querySelector('.leaflet-popup[aria-label]');
    if (!popup) return;
    const focusable = popup.querySelectorAll('[tabindex="0"], a, button, input, select, textarea');
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    function handleTrap(e) {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    popup.addEventListener('keydown', handleTrap);
    return () => popup.removeEventListener('keydown', handleTrap);
  }, [openPopupId]);

  return (
    <section 
      aria-label="Mapa interactivo de balnearios del Río de la Plata"
      tabIndex={-1}
      style={{ outline: 'none' }}
    >
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
            position={[b.latitude, b.longitude]}
            icon={createCustomIcon(getContaminationColor(b.agua), b.nombre, b.agua, b.arena)}
            eventHandlers={{
              // El marker solo abre el popup si se hace click o enter/espacio en el botón, no directamente en el marker
            }}
          >
            <Popup
              onOpen={() => {
                setOpenPopupId(b.id);
                setTimeout(() => {
                  if (popupRefs.current[b.id]) {
                    popupRefs.current[b.id].focus();
                  }
                  // Forzar blur y quitar tabindex del marker activo
                  const containers = document.querySelectorAll('.leaflet-marker-icon.custom-marker-container');
                  containers.forEach(container => {
                    const marker = container.querySelector('.custom-marker');
                    if (marker && marker.getAttribute('aria-label')?.includes(b.nombre)) {
                      container.setAttribute('tabindex', '-1');
                    }
                  });
                }, 0);
              }}
              onClose={() => setOpenPopupId(null)}
              aria-label={`Información detallada de ${b.nombre}`}
              autoPan={true}
              autoFocus={false}
            >
              <article 
                style={{ 
                  minWidth: "300px", 
                  maxWidth: "400px",
                  padding: "0"
                }}
                role="dialog"
                aria-labelledby={`popup-title-${b.id}`}
                aria-describedby={`popup-content-${b.id}`}
                tabIndex={0}
              >
                {/* Header */}
                <header style={{
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
                    tabIndex={0}
                    role="region"
                    aria-label="Nombre del balneario"
                    ref={el => (popupRefs.current[b.id] = el)}
                  >
                    {b.nombre}
                  </h3>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "0.9em",
                      color: "#6c757d"
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label="Localidad"
                  >
                    <strong>Localidad:</strong> {b.localidad}
                  </p>
                </header>

                {/* Contenido */}
                <div 
                  id={`popup-content-${b.id}`}
                  style={{ padding: "1rem" }}
                >
                  {/* Descripción */}
                  <p
                    style={{
                      margin: "0 0 1rem 0",
                      color: "#495057",
                      lineHeight: "1.5"
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label="Descripción"
                  >
                    {b.descripcion}
                  </p>

                  {/* Estado de contaminación */}
                  <section
                    style={{
                      marginBottom: "1rem"
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label="Estado de contaminación"
                  >
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
                      <article
                        style={{
                          padding: "0.75rem",
                          borderRadius: "6px",
                          border: "2px solid",
                          borderColor: getContaminationColor(b.agua),
                          background: "#f8f9fa"
                        }}
                        tabIndex={0}
                        role="region"
                        aria-label="Estado del agua"
                      >
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
                      </article>

                      <article
                        style={{
                          padding: "0.75rem",
                          borderRadius: "6px",
                          border: "2px solid",
                          borderColor: getContaminationColor(b.arena),
                          background: "#f8f9fa"
                        }}
                        tabIndex={0}
                        role="region"
                        aria-label="Estado de la arena"
                      >
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
                      </article>
                    </div>
                  </section>

                  {/* Recomendaciones */}
                  <section
                    style={{
                      padding: "0.75rem",
                      background: "#e3f2fd",
                      borderRadius: "6px",
                      borderLeft: "4px solid #007bff"
                    }}
                    tabIndex={0}
                    role="region"
                    aria-label="Recomendación"
                  >
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
                  </section>
                </div>
              </article>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}