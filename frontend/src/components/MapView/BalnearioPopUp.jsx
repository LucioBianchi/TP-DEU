import React, { forwardRef } from "react";

// Componente para la tarjeta de contaminación
const ContaminationCard = ({ title, level, color, description }) => (
  <div 
    style={{
      background: color,
      color: "white",
      padding: "0.75rem",
      borderRadius: "8px",
      margin: "0.5rem 0",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: "1rem",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
    }}
    role="region"
    aria-label={`${title}: ${level} - ${description}`}
    tabIndex={0}
  >
    <div style={{ fontSize: "1.1rem", marginBottom: "0.25rem" }}>{title}</div>
    <div style={{ fontSize: "0.95rem", opacity: 0.95 }}>{level}</div>
  </div>
);

// Componente para la sección de contaminación
const ContaminationSection = ({ balneario }) => (
  <section
    style={{ marginBottom: "1.25rem" }}
    role="region"
    aria-labelledby="contamination-title"
    tabIndex={0}
  >
    <h4 
      id="contamination-title"
      style={{
        margin: "0 0 0.75rem 0",
        fontSize: "1.2rem",
        color: "#2c3e50",
        borderBottom: "2px solid #3498db",
        paddingBottom: "0.5rem",
        fontWeight: "600"
      }}
    >
      Estado de Contaminación
    </h4>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
      <ContaminationCard
        title="Agua"
        level={balneario.agua}
        color={balneario.agua === "Alto" ? "#e74c3c" : balneario.agua === "Medio" ? "#f39c12" : "#27ae60"}
        description={balneario.agua === "Alto" ? "Contaminación alta - No recomendado para uso recreativo" : 
                   balneario.agua === "Medio" ? "Contaminación media - Precaución recomendada" : 
                   "Contaminación baja - Seguro para uso recreativo"}
      />
      <ContaminationCard
        title="Arena"
        level={balneario.arena}
        color={balneario.arena === "Alto" ? "#e74c3c" : balneario.arena === "Medio" ? "#f39c12" : "#27ae60"}
        description={balneario.arena === "Alto" ? "Contaminación alta - No recomendado para uso recreativo" : 
                   balneario.arena === "Medio" ? "Contaminación media - Precaución recomendada" : 
                   "Contaminación baja - Seguro para uso recreativo"}
      />
    </div>
  </section>
);

// Componente principal del popup - versión accesible
const BalnearioPopUp = forwardRef(({ balneario, onOpen, onClose, popupRefs }, ref) => {
  return (
    <article 
    tyle={{ 
        minWidth: "320px", 
        maxWidth: "420px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: "border-box",
        width: "100%",
        textAlign: "left"
      }}
      ref={ref}
      role="dialog"
      aria-labelledby={`popup-title-${balneario.id}`}
      aria-describedby={`popup-content-${balneario.id}`}
      tabIndex={0}
      aria-label={`Información detallada del balneario ${balneario.nombre}`}
    >
      {/* Título principal */}
      <header>
        <h3 
          id={`popup-title-${balneario.id}`}
          style={{
            margin: "0 0 0.5rem 0",
            fontSize: "1.5rem",
            fontWeight: "700",
            color: "#2c3e50",
            textAlign: "center"
          }}
          ref={el => (popupRefs.current[balneario.id] = el)}
          tabIndex={0}
          role="heading"
          aria-level="1"
        >
          {balneario.nombre}
        </h3>
        
        {/* Localidad */}
        <p
          style={{
            margin: "0 0 1rem 0",
            fontSize: "1rem",
            color: "#7f8c8d",
            textAlign: "center",
            fontWeight: "500"
          }}
          tabIndex={0}
          role="region"
          aria-label="Localidad del balneario"
        >
          <strong>Localidad:</strong> {balneario.localidad}
        </p>
      </header>

      {/* Contenido principal */}
      <main 
        id={`popup-content-${balneario.id}`}
        role="main"
        tabIndex={0}
      >
        {/* Descripción */}
        <section
          style={{ marginBottom: "1.25rem" }}
          role="region"
          aria-labelledby={`description-title-${balneario.id}`}
          tabIndex={0}
        >
          <h4 
            id={`description-title-${balneario.id}`}
            style={{
              margin: "0 0 0.5rem 0",
              fontSize: "1.1rem",
              color: "#2c3e50",
              fontWeight: "600"
            }}
            className="sr-only"
          >
            Descripción del balneario
          </h4>
          <p
            style={{
              margin: "0 0 1.25rem 0",
              fontSize: "1.05rem",
              lineHeight: "1.6",
              color: "#2c3e50",
              fontWeight: "400",
              textAlign: "justify"
            }}
            tabIndex={0}
            role="region"
            aria-label="Descripción del balneario"
          >
            {balneario.descripcion || "Sin descripción disponible"}
          </p>
        </section>

        {/* Sección de contaminación */}
        <ContaminationSection balneario={balneario} />
      </main>

    </article>
  );
});

BalnearioPopUp.displayName = "BalnearioPopUp";

export default BalnearioPopUp;