import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useBalnearios } from "../../hooks/useBalnearios";
import "leaflet/dist/leaflet.css";
import BalnearioModal from "../Modal/BalnearioModal";

export default function MapView({ filters }) {
  const { balnearios } = useBalnearios(filters);
  const [openPopupId, setOpenPopupId] = useState(null);

  // Función para obtener el color según el nivel de contaminación
  const getContaminationColor = (nivel) => {
    switch (nivel) {
      case "Baja":
        return "#28a745";
      case "Media":
        return "#ffc107";
      case "Alta":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  // Función para obtener el texto descriptivo
  const getContaminationText = (nivel) => {
    switch (nivel) {
      case "Baja":
        return "Contaminación baja - Seguro para uso recreativo";
      case "Media":
        return "Contaminación media - Precaución recomendada";
      case "Alta":
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
          >
            <div style={{ 
              minWidth: "300px", 
              maxWidth: "400px",
              padding: "0"
            }}>
              {/* Header */}
              <div style={{
                background: "#f8f9fa",
                padding: "1rem",
                borderBottom: "1px solid #dee2e6",
                borderRadius: "8px 8px 0 0"
              }}>
                <h3 style={{
                  margin: "0 0 0.5rem 0",
                  fontSize: "1.2em",
                  fontWeight: "bold",
                  color: "#495057"
                }}>
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
              <div style={{ padding: "1rem" }}>
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
                    {b.agua === "Alta" || b.arena === "Alta" 
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