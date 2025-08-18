import React from 'react';

export default function MeasurementDetailModal({ 
  measurement, 
  isOpen, 
  onClose, 
  onValidate 
}) {
  if (!isOpen || !measurement) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "1rem"
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex="-1"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "12px",
          padding: "1.5rem",
          maxWidth: "500px",
          width: "100%",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)"
        }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header del modal */}
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "1.5rem"
        }}>
          <h2 
            id="modal-title"
            style={{ 
              margin: 0, 
              color: "#495057",
              fontSize: "1.2rem"
            }}
          >
            Detalles de Medición
          </h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              color: "#6c757d",
              padding: "0.25rem",
              borderRadius: "4px",
              minWidth: "32px",
              minHeight: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            aria-label="Cerrar modal de detalles"
            onFocus={(e) => {
              e.target.style.outline = "2px solid #007bff";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.color = "#495057";
            }}
            onMouseLeave={(e) => {
              e.target.style.color = "#6c757d";
            }}
          >
            ×
          </button>
        </header>

        {/* Contenido del modal */}
        <div id="modal-description">
          {/* Información básica */}
          <section style={{ marginBottom: "1.5rem" }} aria-labelledby="basic-info-title">
            <h3 
              id="basic-info-title"
              style={{ 
                margin: "0 0 1rem 0", 
                color: "#495057",
                fontSize: "1.1rem"
              }}
            >
              📍 Información General
            </h3>
            <div style={{ 
              background: "#f8f9fa", 
              padding: "1rem", 
              borderRadius: "8px",
              border: "1px solid #e9ecef"
            }}>
              <dl style={{ margin: 0, display: "grid", gap: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <dt style={{ fontWeight: "bold", color: "#495057" }}>Localidad:</dt>
                  <dd style={{ margin: 0, color: "#6c757d" }}>{measurement.location_name}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <dt style={{ fontWeight: "bold", color: "#495057" }}>Usuario:</dt>
                  <dd style={{ margin: 0, color: "#6c757d" }}>{measurement.user_name}</dd>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <dt style={{ fontWeight: "bold", color: "#495057" }}>Fecha:</dt>
                  <dd style={{ margin: 0, color: "#6c757d" }}>
                    {new Date(measurement.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Mediciones de agua */}
          {(measurement.ecoli_water || measurement.enterococci_water) && (
            <section style={{ marginBottom: "1.5rem" }} aria-labelledby="water-measurements-title">
              <h3 
                id="water-measurements-title"
                style={{ 
                  margin: "0 0 1rem 0", 
                  color: "#495057",
                  fontSize: "1.1rem"
                }}
              >
                💧 Mediciones de Agua
              </h3>
              <div style={{ 
                background: "#e3f2fd", 
                padding: "1rem", 
                borderRadius: "8px",
                border: "1px solid #bbdefb"
              }}>
                <dl style={{ margin: 0, display: "grid", gap: "0.5rem" }}>
                  {measurement.ecoli_water && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontWeight: "bold", color: "#1565c0" }}>E. coli:</dt>
                      <dd style={{ margin: 0, color: "#1976d2" }}>
                        {measurement.ecoli_water} UFC/100ml
                      </dd>
                    </div>
                  )}
                  {measurement.enterococci_water && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontWeight: "bold", color: "#1565c0" }}>Enterococos:</dt>
                      <dd style={{ margin: 0, color: "#1976d2" }}>
                        {measurement.enterococci_water} UFC/100ml
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>
          )}

          {/* Mediciones de arena */}
          {(measurement.ecoli_sand || measurement.enterococci_sand) && (
            <section style={{ marginBottom: "1.5rem" }} aria-labelledby="sand-measurements-title">
              <h3 
                id="sand-measurements-title"
                style={{ 
                  margin: "0 0 1rem 0", 
                  color: "#495057",
                  fontSize: "1.1rem"
                }}
              >
                🏖️ Mediciones de Arena
              </h3>
              <div style={{ 
                background: "#fff3e0", 
                padding: "1rem", 
                borderRadius: "8px",
                border: "1px solid #ffcc02"
              }}>
                <dl style={{ display: "grid", gap: "0.5rem" }}>
                  {measurement.ecoli_sand && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontWeight: "bold", color: "#e65100" }}>E. coli:</dt>
                      <dd style={{ margin: 0, color: "#f57c00" }}>
                        {measurement.ecoli_sand} UFC/100g
                      </dd>
                    </div>
                  )}
                  {measurement.enterococci_sand && (
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <dt style={{ fontWeight: "bold", color: "#e65100" }}>Enterococos:</dt>
                      <dd style={{ margin: 0, color: "#f57c00" }}>
                        {measurement.enterococci_sand} UFC/100g
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </section>
          )}

          {/* Observaciones */}
          {measurement.additional_notes && (
            <section style={{ marginBottom: "1.5rem" }} aria-labelledby="observations-title">
              <h3 
                id="observations-title"
                style={{ 
                  margin: "0 0 1rem 0", 
                  color: "#495057",
                  fontSize: "1.1rem"
                }}
              >
                📝 Observaciones
              </h3>
              <div style={{ 
                background: "#f3e5f5", 
                padding: "1rem", 
                borderRadius: "8px",
                border: "1px solid #ce93d8"
              }}>
                <p style={{ 
                  margin: 0, 
                  color: "#7b1fa2",
                  lineHeight: "1.5",
                  whiteSpace: "pre-wrap"
                }}>
                  {measurement.additional_notes}
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Botones de acción - CENTRADOS */}
        <footer style={{ 
          display: "flex", 
          gap: "0.75rem",
          justifyContent: "center",
          marginTop: "2rem"
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "100px"
            }}
            aria-label="Cancelar y cerrar modal"
            onFocus={(e) => {
              e.target.style.outline = "2px solid #495057";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#5a6268";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#6c757d";
            }}
          >
            Cancelar
          </button>
          
          {/* Los botones de aprobar/rechazar siempre están disponibles para mediciones pendientes */}
          <button
            type="button"
            onClick={() => onValidate('approved')}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "100px"
            }}
            aria-label={`Aprobar medición de ${measurement.location_name}`}
            onFocus={(e) => {
              e.target.style.outline = "2px solid #1e7e34";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#218838";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#28a745";
            }}
          >
            ✓ Aprobar
          </button>
          <button
            type="button"
            onClick={() => onValidate('rejected')}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              fontSize: "0.9rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "100px"
            }}
            aria-label={`Rechazar medición de ${measurement.location_name}`}
            onFocus={(e) => {
              e.target.style.outline = "2px solid #c82333";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#c82333";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#dc3545";
            }}
          >
            ✗ Rechazar
          </button>
        </footer>
      </div>
    </div>
  );
}