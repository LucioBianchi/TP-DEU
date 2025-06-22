import React, { useEffect, useRef } from "react";
import { balnearios } from "../../data/balnearios";

export default function BalnearioModal({ balnearioId, onClose }) {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  const balneario = balnearios.find(b => b.id === balnearioId);
  
  if (!balneario) {
    return null;
  }

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

  // Focus en el botón de cerrar cuando se abre el modal
  useEffect(() => {
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, []);

  // Trap focus dentro del modal
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };
    
    modal.addEventListener('keydown', handleKeyDown);
    return () => modal.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
    >
      <div
        ref={modalRef}
        className="modal-content"
        style={{
          background: "#fff",
          borderRadius: "12px",
          maxWidth: "600px",
          width: "100%",
          maxHeight: "90vh",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Header del modal */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1.5rem 1.5rem 0 1.5rem",
          borderBottom: "1px solid #e9ecef"
        }}>
          <h2 id="modal-title" style={{
            margin: 0,
            fontSize: "1.5em",
            fontWeight: "bold",
            color: "#495057"
          }}>
            {balneario.nombre}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Cerrar modal"
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5em",
              cursor: "pointer",
              padding: "0.5em",
              borderRadius: "4px",
              color: "#6c757d",
              transition: "all 0.2s",
              minWidth: "44px",
              minHeight: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onFocus={(e) => {
              e.target.style.outline = "2px solid #007bff";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#f8f9fa";
              e.target.style.color = "#495057";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "none";
              e.target.style.color = "#6c757d";
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenido del modal */}
        <div id="modal-description" style={{
          padding: "1.5rem",
          overflowY: "auto",
          flex: 1
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            marginBottom: "1.5rem"
          }}>
            {/* Imagen */}
            <div style={{
              gridColumn: "1",
              gridRow: "1"
            }}>
              <div style={{
                width: "100%",
                height: "200px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.2em",
                fontWeight: "bold"
              }}>
                Imagen del Balneario
              </div>
            </div>

            {/* Información básica */}
            <div style={{
              gridColumn: "2",
              gridRow: "1"
            }}>
              <h3 style={{
                margin: "0 0 1rem 0",
                fontSize: "1.3em",
                color: "#495057"
              }}>
                Información General
              </h3>
              <p style={{
                margin: "0 0 0.5rem 0",
                color: "#6c757d"
              }}>
                <strong>Localidad:</strong> {balneario.localidad}
              </p>
              <p style={{
                margin: "0 0 1rem 0",
                color: "#495057",
                lineHeight: "1.6"
              }}>
                {balneario.descripcion}
              </p>
            </div>
          </div>

          {/* Estado de contaminación */}
          <div style={{
            marginBottom: "1.5rem"
          }}>
            <h3 style={{
              margin: "0 0 1rem 0",
              fontSize: "1.3em",
              color: "#495057"
            }}>
              Estado de Contaminación
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem"
            }}>
              <div style={{
                padding: "1rem",
                borderRadius: "8px",
                border: "2px solid",
                borderColor: getContaminationColor(balneario.agua)
              }}>
                <h4 style={{
                  margin: "0 0 0.5rem 0",
                  color: "#495057"
                }}>
                  Agua
                </h4>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem"
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getContaminationColor(balneario.agua)
                  }} />
                  <span style={{
                    fontWeight: "bold",
                    color: getContaminationColor(balneario.agua)
                  }}>
                    {balneario.agua}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: "0.9em",
                  color: "#6c757d"
                }}>
                  {getContaminationText(balneario.agua)}
                </p>
              </div>

              <div style={{
                padding: "1rem",
                borderRadius: "8px",
                border: "2px solid",
                borderColor: getContaminationColor(balneario.arena)
              }}>
                <h4 style={{
                  margin: "0 0 0.5rem 0",
                  color: "#495057"
                }}>
                  Arena
                </h4>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.5rem"
                }}>
                  <div style={{
                    width: "12px",
                    height: "12px",
                    borderRadius: "50%",
                    backgroundColor: getContaminationColor(balneario.arena)
                  }} />
                  <span style={{
                    fontWeight: "bold",
                    color: getContaminationColor(balneario.arena)
                  }}>
                    {balneario.arena}
                  </span>
                </div>
                <p style={{
                  margin: 0,
                  fontSize: "0.9em",
                  color: "#6c757d"
                }}>
                  {getContaminationText(balneario.arena)}
                </p>
              </div>
            </div>
          </div>

          {/* Recomendaciones */}
          <div>
            <h3 style={{
              margin: "0 0 1rem 0",
              fontSize: "1.3em",
              color: "#495057"
            }}>
              Recomendaciones
            </h3>
            <div style={{
              padding: "1rem",
              background: "#f8f9fa",
              borderRadius: "8px",
              borderLeft: "4px solid #007bff"
            }}>
              <p style={{
                margin: 0,
                color: "#495057",
                lineHeight: "1.6"
              }}>
                {balneario.agua === "Alta" || balneario.arena === "Alta" 
                  ? "Se recomienda evitar el uso recreativo de este balneario debido a los altos niveles de contaminación detectados."
                  : "Este balneario presenta condiciones aceptables para uso recreativo, pero siempre es recomendable verificar las condiciones actuales antes de visitar."
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 