import React, { useState } from "react";

const sections = [
  {
    id: "que-es",
    label: "¿Qué es la contaminación?",
    content: (
      <article>
        <p>
          La contaminación en balnearios puede afectar tanto el agua como la arena, poniendo en riesgo la salud de las personas y el ambiente. Es importante conocer sus causas y cómo prevenirla.
        </p>
        <p>
          La contaminación del agua puede incluir bacterias, virus, parásitos y sustancias químicas que pueden causar enfermedades gastrointestinales, infecciones de la piel y otros problemas de salud.
        </p>
        <p>
          La contaminación de la arena puede contener microorganismos patógenos, residuos plásticos, colillas de cigarrillos y otros desechos que representan un riesgo para la salud, especialmente para niños que juegan en la playa.
        </p>
      </article>
    ),
  },
  {
    id: "como-se-mide",
    label: "¿Cómo se mide?",
    content: (
      <article>
        <h3>Protocolo de muestreo</h3>
        <p>
          Las muestras tanto de agua como de arena se toman siguiendo un protocolo específico y deben ser enviadas a laboratorio para su análisis.
        </p>
        
        <h4>Muestreo de agua</h4>
        <ul>
          <li>Se utiliza una jeringa estéril para tomar pequeñas submuestras a lo largo de 100 metros de playa.</li>
          <li>Las submuestras se combinan en una botella para formar una muestra compuesta.</li>
          <li>En el laboratorio se analiza la presencia de <strong>Escherichia coli</strong> y <strong>Estreptococo fecal</strong>.</li>
        </ul>
        
        <h4>Muestreo de arena</h4>
        <p>
          La arena acumula contaminantes que pueden sobrevivir durante más tiempo. Las bacterias pueden ingresar al cuerpo a través de pequeñas heridas o mucosas al jugar, caminar descalzo o acostarse sobre la arena.
        </p>
        <p>
          Se toman muestras de arena a diferentes profundidades y se analizan en laboratorio para detectar la presencia de microorganismos patógenos y otros contaminantes.
        </p>
      </article>
    ),
  },
  {
    id: "como-ayudar",
    label: "¿Cómo ayudarnos?",
    content: (
      <article>
        <p>Puedes contribuir a mantener las playas limpias y seguras de las siguientes maneras:</p>
        <ul>
          <li><strong>No arrojar basura:</strong> Lleva contigo todos los residuos y deposítalos en los contenedores correspondientes.</li>
          <li><strong>Usar productos biodegradables:</strong> Opta por protectores solares y otros productos que no dañen el medio ambiente.</li>
          <li><strong>Realizar mediciones:</strong> Participa en el monitoreo ciudadano de la calidad del agua y arena de las playas.</li>
        </ul>
      </article>
    ),
  },
  {
    id: "contacto",
    label: "Información de contacto",
    content: (
      <article>
        <p>
          Para consultas, denuncias o reportes de contaminación, comunícate con nosotros:
        </p>
        <ul>
          <li>
            <strong>Email:</strong> 
            <a href="mailto:info@riox.todos" aria-label="Enviar email a info@riox.todos">
              info@riox.todos
            </a>
          </li>
          <li>
            <strong>Teléfono:</strong> 
            <a href="tel:+5400000000" aria-label="Llamar al +54 00 0000-0000">
              +54 00 0000-0000
            </a>
          </li>
          <li>
            <strong>Horarios de atención:</strong> Lunes a viernes de 9:00 a 18:00
          </li>
        </ul>
        <p>
          <strong>Emergencias ambientales:</strong> Si detectas un vertido o contaminación grave, llama inmediatamente al número de emergencias.
        </p>
      </article>
    ),
  },
];

export default function InfoPanel() {
  const [open, setOpen] = useState(null);

  const handleToggle = (sectionId) => {
    setOpen(open === sectionId ? null : sectionId);
  };

  return (
    <section aria-label="Información sobre contaminación de balnearios">
      <h2 className="sr-only">Información sobre contaminación</h2>
      <div aria-label="Secciones de información">
        {sections.map((section, index) => (
          <div key={section.id} style={{ marginBottom: "1.5em" }}>
            <button
              type="button"
              aria-expanded={open === section.id}
              aria-controls={`section-${section.id}`}
              id={`accordion-${section.id}`}
              onClick={() => handleToggle(section.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "1em 1.2em",
                borderRadius: "8px",
                border: "2px solid #007bff",
                background: open === section.id ? "#e9f5ff" : "#f8f9fa",
                fontWeight: "bold",
                cursor: "pointer",
                outline: "none",
                fontSize: "1.1em",
                transition: "all 0.2s ease",
                minHeight: "48px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}
              onFocus={(e) => {
                e.target.style.outline = "2px solid #0056b3";
                e.target.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                e.target.style.outline = "none";
              }}
            >
              <span>{section.label}</span>
              <span 
                aria-hidden="true"
                style={{
                  fontSize: "1.2em",
                  transition: "transform 0.2s ease",
                  transform: open === section.id ? "rotate(180deg)" : "rotate(0deg)"
                }}
              >
                ▼
              </span>
            </button>
            
            <div
              id={`section-${section.id}`}
              aria-labelledby={`accordion-${section.id}`}
              hidden={open !== section.id}
              style={{
                background: "#f8f9fa",
                border: "1px solid #dee2e6",
                borderRadius: "8px",
                padding: open === section.id ? "1.5em" : "0",
                marginTop: "0.5em",
                maxHeight: open === section.id ? "1000px" : "0",
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              {open === section.id && (
                <div style={{ lineHeight: "1.6" }}>
                  {section.content}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}