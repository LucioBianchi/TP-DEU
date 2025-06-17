import React, { useState } from "react";

const sections = [
  {
    id: "que-es",
    label: "¿Qué es la contaminación?",
    content: (
      <p>
        La contaminación en balnearios puede afectar tanto el agua como la arena, poniendo en riesgo la salud de las personas y el ambiente. Es importante conocer sus causas y cómo prevenirla.
      </p>
    ),
  },
  {
    id: "como-ayudar",
    label: "¿Cómo ayudar?",
    content: (
      <ul>
        <li>No arrojar basura ni residuos en la playa o el agua.</li>
        <li>Participar en jornadas de limpieza.</li>
        <li>Informar a las autoridades sobre focos de contaminación.</li>
      </ul>
    ),
  },
  {
    id: "contacto",
    label: "Información de contacto",
    content: (
      <div>
        <p>
          Para consultas o denuncias, comunícate con:
        </p>
        <ul>
          <li>Email: <a href="mailto:info@riox.todos">info@riox.todos</a></li>
          <li>Teléfono: <a href="tel:+5400000000">+54 00 0000-0000</a></li>
        </ul>
      </div>
    ),
  },
];

export default function InfoPanel() {
  const [open, setOpen] = useState(null);

  // Manejo de teclado para accesibilidad
  const handleKeyDown = (e, id) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen(open === id ? null : id);
    }
  };

  return (
    <section aria-labelledby="info-header">
      <h2 id="info-header">Información</h2>
      <div aria-hidden="true" style={{ marginBottom: "1em" }} />
      <div>
        {sections.map(section => (
          <div key={section.id} style={{ marginBottom: "1em" }}>
            <button
              type="button"
              aria-expanded={open === section.id}
              aria-controls={`section-${section.id}`}
              id={`accordion-${section.id}`}
              onClick={() => setOpen(open === section.id ? null : section.id)}
              onKeyDown={e => handleKeyDown(e, section.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "0.75em 1em",
                borderRadius: "6px",
                border: "1px solid #007bff",
                background: open === section.id ? "#e9f5ff" : "#f8f9fa",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none",
                marginBottom: "0.25em",
                fontSize: "1em "
              }}
            >
              {section.label}
            </button>
            <div
              id={`section-${section.id}`}
              role="region"
              aria-labelledby={`accordion-${section.id}`}
              hidden={open !== section.id}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                padding: open === section.id ? "1em" : "0",
                marginTop: "0.25em"
              }}
            >
              {open === section.id && section.content}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}