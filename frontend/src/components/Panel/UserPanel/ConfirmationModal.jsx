import React from 'react';

export default function ConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action, 
  measurementName 
}) {
  console.log('ConfirmationModal render:', { isOpen, action, measurementName }); // Debug

  if (!isOpen || !action) return null;

  const isApproval = action === 'approved';
  const title = isApproval ? 'Aprobar Medición' : 'Rechazar Medición';
  const message = isApproval 
    ? `¿Estás seguro de que quieres aprobar la medición de "${measurementName}"?`
    : `¿Estás seguro de que quieres rechazar la medición de "${measurementName}"?`;
  
  console.log('Modal config:', { isApproval, title, message }); // Debug

  const icon = isApproval ? '✅' : '❌';
  const confirmButtonText = isApproval ? 'Sí, Aprobar' : 'Sí, Rechazar';
  const confirmButtonStyle = isApproval 
    ? { background: '#28a745' }
    : { background: '#dc3545' };

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
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
        padding: "1rem"
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirmation-title"
      aria-describedby="confirmation-description"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex="-1"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "2rem",
          maxWidth: "450px",
          width: "100%",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          border: `3px solid ${isApproval ? '#28a745' : '#dc3545'}`,
          animation: "modalSlideIn 0.3s ease-out"
        }}
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Header con icono */}
        <div style={{ 
          textAlign: "center", 
          marginBottom: "1.5rem" 
        }}>
          <div 
            style={{
              fontSize: "4rem",
              marginBottom: "1rem",
              filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))"
            }}
            tabIndex="0"
            aria-label={isApproval ? "Icono de aprobación: marca de verificación verde" : "Icono de rechazo: marca X roja"}
          >
            {icon}
          </div>
          <h2 
            id="confirmation-title"
            style={{ 
              margin: 0, 
              color: "#495057",
              fontSize: "1.4rem",
              fontWeight: "bold"
            }}
            tabIndex="0"
            aria-label={`Título del modal de confirmación: ${title}`}
          >
            {title}
          </h2>
        </div>

        {/* Mensaje de confirmación */}
        <div 
          id="confirmation-description"
          style={{ 
            textAlign: "center", 
            marginBottom: "2rem" 
          }}
        >
          <p 
            style={{ 
              margin: "0 0 1rem 0", 
              color: "#6c757d",
              fontSize: "1rem",
              lineHeight: "1.5"
            }}
            tabIndex="0"
            aria-label={`Mensaje de confirmación: ${message}`}
          >
            {message}
          </p>
          
          {isApproval && (
            <div 
              style={{
                background: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: "8px",
                padding: "1rem",
                marginTop: "1rem"
              }}
              tabIndex="0"
              aria-label="Información adicional sobre la aprobación: Esta acción actualizará los niveles de contaminación de la ubicación"
            >
              <p style={{ 
                margin: 0, 
                color: "#155724",
                fontSize: "0.9rem",
                fontWeight: "bold"
              }}>
                ℹ️ Esta acción actualizará los niveles de contaminación de la ubicación
              </p>
            </div>
          )}
          
          {!isApproval && (
            <div 
              style={{
                background: "#f8d7da",
                border: "1px solid #f5c6cb",
                borderRadius: "8px",
                padding: "1rem",
                marginTop: "1rem"
              }}
              tabIndex="0"
              aria-label="Advertencia sobre el rechazo: La medición será marcada como rechazada y no se incluirá en los cálculos"
            >
              <p style={{ 
                margin: 0, 
                color: "#721c24",
                fontSize: "0.9rem",
                fontWeight: "bold"
              }}>
                ⚠️ La medición será marcada como rechazada y no se incluirá en los cálculos
              </p>
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div style={{ 
          display: "flex", 
          gap: "1rem",
          justifyContent: "center"
        }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "120px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
            aria-label="Cancelar la acción y cerrar el modal de confirmación"
            onFocus={(e) => {
              e.target.style.outline = "2px solid #495057";
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#5a6268";
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "#6c757d";
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            Cancelar
          </button>
          
          <button
            type="button"
            onClick={onConfirm}
            style={{
              padding: "0.75rem 1.5rem",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.2s",
              minWidth: "120px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              ...confirmButtonStyle
            }}
            aria-label={`Confirmar ${isApproval ? 'aprobación' : 'rechazo'} de la medición de ${measurementName}`}
            onFocus={(e) => {
              const focusColor = isApproval ? '#1e7e34' : '#c82333';
              e.target.style.outline = `2px solid ${focusColor}`;
              e.target.style.outlineOffset = "2px";
            }}
            onBlur={(e) => {
              e.target.style.outline = "none";
            }}
            onMouseEnter={(e) => {
              const hoverColor = isApproval ? '#218838' : '#c82333';
              e.target.style.background = hoverColor;
              e.target.style.transform = "translateY(-1px)";
              e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            }}
            onMouseLeave={(e) => {
              const normalColor = isApproval ? '#28a745' : '#dc3545';
              e.target.style.background = normalColor;
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
            }}
          >
            {confirmButtonText}
          </button>
        </div>
      </div>

      {/* Estilos CSS inline para la animación */}
      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}