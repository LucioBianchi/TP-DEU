import React, { useState } from "react";

const sections = [
  {
    id: "que-es",
    label: "¿Qué es la contaminación?",
    content: (
      <article>
        <p tabIndex="0" aria-label="La contaminación en balnearios puede afectar tanto el agua como la arena, poniendo en riesgo la salud de las personas y el ambiente. Es importante conocer sus causas y cómo prevenirla.">
          La contaminación en balnearios puede afectar tanto el agua como la arena, poniendo en riesgo la salud de las personas y el ambiente. Es importante conocer sus causas y cómo prevenirla.
        </p>
        <p tabIndex="0" aria-label="La contaminación del agua puede incluir bacterias, virus, parásitos y sustancias químicas que pueden causar enfermedades gastrointestinales, infecciones de la piel y otros problemas de salud.">
          La contaminación del agua puede incluir bacterias, virus, parásitos y sustancias químicas que pueden causar enfermedades gastrointestinales, infecciones de la piel y otros problemas de salud.
        </p>
        <p tabIndex="0" aria-label="La contaminación de la arena puede contener microorganismos patógenos, residuos plásticos, colillas de cigarrillos y otros desechos que representan un riesgo para la salud, especialmente para niños que juegan en la playa.">
          La contaminación de la arena puede contener microorganismos patógenos, residuos plásticos, colillas de cigarrillos y otros desechos que representan un riesgo para la salud, especialmente para niños que juegan en la playa.
        </p>
      </article>
    ),
  },
  {
    id: "como-ayudar",
    label: "¿Cómo ayudarnos?",
    content: (
      <article>
        <p tabIndex="0" aria-label="Puedes contribuir a mantener las playas limpias y seguras de las siguientes maneras:">
          Puedes contribuir a mantener las playas limpias y seguras de las siguientes maneras:
        </p>
        <ul role="list" aria-label="Lista de acciones para ayudar">
          <li tabIndex="0" aria-label="No arrojar basura: Lleva contigo todos los residuos y deposítalos en los contenedores correspondientes.">
            <strong>No arrojar basura:</strong> Lleva contigo todos los residuos y deposítalos en los contenedores correspondientes.
          </li>
          <li tabIndex="0" aria-label="Usar productos biodegradables: Opta por protectores solares y otros productos que no dañen el medio ambiente.">
            <strong>Usar productos biodegradables:</strong> Opta por protectores solares y otros productos que no dañen el medio ambiente.
          </li>
          <li tabIndex="0" aria-label="Realizar mediciones: Participa en el monitoreo ciudadano de la calidad del agua y arena de las playas.">
            <strong>Realizar mediciones:</strong> Participa en el monitoreo ciudadano de la calidad del agua y arena de las playas.
          </li>
        </ul>
      </article>
    ),
  },
  {
    id: "como-se-mide",
    label: "¿Cómo realizar mediciones?",
    content: (
      <article>
        <h3 tabIndex="0" aria-label="Protocolo de muestreo">Protocolo de muestreo</h3>
        <p tabIndex="0" aria-label="Las muestras tanto de agua como de arena se toman siguiendo un protocolo específico y deben ser enviadas a laboratorio para su análisis.">
          Las muestras tanto de agua como de arena se toman siguiendo un protocolo específico y deben ser enviadas a laboratorio para su análisis microbiológico certificado.
        </p>
        
        <h4 tabIndex="0" aria-label="Materiales necesarios">📋 Materiales necesarios</h4>
        <ul role="list" aria-label="Lista de materiales para muestreo">
          <li tabIndex="0">🧪 Frascos estériles de 500ml con tapa hermética</li>
          <li tabIndex="0">🧤 Guantes de látex o nitrilo desechables</li>
          <li tabIndex="0">💉 Jeringa estéril de 50ml (para agua)</li>
          <li tabIndex="0">🥄 Cucharas estériles o espátulas desechables</li>
          <li tabIndex="0">🧊 Conservadora con hielo (4°C)</li>
          <li tabIndex="0">🏷️ Etiquetas resistentes al agua</li>
          <li tabIndex="0">📝 Planilla de campo</li>
        </ul>

        <h4 tabIndex="0" aria-label="Muestreo de agua">🌊 Muestreo de agua</h4>
        <ol role="list" aria-label="Pasos detallados para el muestreo de agua">
          <li tabIndex="0">
            <strong>Preparación:</strong> Use guantes estériles y evite tocar el interior del frasco
          </li>
          <li tabIndex="0">
            <strong>Ubicación:</strong> Tome muestras a 30-50cm de profundidad, alejado de desagües pluviales
          </li>
          <li tabIndex="0">
            <strong>Técnica compuesta:</strong> Con jeringa estéril, tome 5-7 submuestras a lo largo de 100 metros de costa
          </li>
          <li tabIndex="0">
            <strong>Combinación:</strong> Mezcle todas las submuestras en un frasco estéril de 500ml
          </li>
          <li tabIndex="0">
            <strong>Conservación:</strong> Mantenga a 4°C y lleve al laboratorio dentro de 6 horas
          </li>
        </ol>
        
        <h4 tabIndex="0" aria-label="Muestreo de arena">🏖️ Muestreo de arena</h4>
        <div tabIndex="0">
          <p><strong>¿Por qué es importante?</strong></p>
          <p>La arena acumula contaminantes que pueden sobrevivir durante más tiempo que en el agua. Las bacterias pueden ingresar al cuerpo a través de pequeñas heridas o mucosas al jugar, caminar descalzo o acostarse sobre la arena.</p>
        </div>
        
        <ol role="list" aria-label="Pasos detallados para el muestreo de arena">
          <li tabIndex="0">
            <strong>Zona de muestreo:</strong> Arena húmeda en la zona inter-mareal (donde rompen las olas)
          </li>
          <li tabIndex="0">
            <strong>Profundidad:</strong> Tome muestras de los primeros 5cm de profundidad
          </li>
          <li tabIndex="0">
            <strong>Técnica:</strong> Con cuchara estéril, tome 5-7 submuestras a lo largo de 100m de playa
          </li>
          <li tabIndex="0">
            <strong>Cantidad:</strong> Colecte aproximadamente 200g de arena total
          </li>
          <li tabIndex="0">
            <strong>Almacenamiento:</strong> Use frasco estéril, mantenga refrigerado y procese dentro de 24 horas
          </li>
        </ol>

        <h4 tabIndex="0" aria-label="Análisis de laboratorio">🔬 Análisis de laboratorio</h4>
        <p tabIndex="0">
          En el laboratorio se determina la concentración de:
        </p>
        <ul role="list">
          <li tabIndex="0"><strong>Escherichia coli</strong> - Indicador de contaminación fecal reciente</li>
          <li tabIndex="0"><strong>Enterococos</strong> - Indicador más resistente, persiste más tiempo en ambiente marino</li>
        </ul>
        
        <div className="alert alert-warning" tabIndex="0">
          <strong> Importante:</strong> Los resultados se expresan en UFC/100ml para agua y UFC/100g para arena.
        </div>
      </article>
    ),
  },
  {
    id: "laboratorios",
    label: "¿Dónde analizar las muestras?",
    content: (
      <article>
        <h3 tabIndex="0" aria-label="Laboratorios recomendados">🏥 Laboratorios en La Plata y Gran Buenos Aires</h3>
        
        <div className="lab-card" tabIndex="0">
          <h4>🧪 IABIM - Instituto de Análisis Bioquímicos y Microbiológicos</h4>
          <ul role="list">
            <li><strong>📍 Dirección:</strong> Calle 3 e/47 y 48 #782, La Plata</li>
            <li><strong>📍 Sucursal:</strong> Av. 19 e/530 y 531 #109, La Plata</li>
            <li><strong>📞 Teléfono:</strong> <a href="tel:+542214525555">+54 221 452-5555</a></li>
            <li><strong>🌐 Web:</strong> <a href="https://www.iabim.com" target="_blank" rel="noopener">www.iabim.com</a></li>
            <li><strong>📧 Email:</strong> <a href="mailto:info@iabim.com">info@iabim.com</a></li>
            <li><strong>💰 Costo aproximado:</strong> Consultar</li>
            <li><strong>⏱️ Tiempo de resultado:</strong> 3-5 días hábiles</li>
          </ul>
        </div>

        <div className="lab-card" tabIndex="0">
          <h4>🧪 LAMI - Laboratorio de Análisis Microbiológicos</h4>
          <ul role="list">
            <li><strong>📍 Dirección:</strong> Bernal, Provincia de Buenos Aires</li>
            <li><strong>🚗 Acceso:</strong> Próximo a bajada autopista La Plata-Buenos Aires</li>
            <li><strong>🌐 Web:</strong> <a href="https://www.laboratoriolami.com" target="_blank" rel="noopener">www.laboratoriolami.com</a></li>
            <li><strong>🔬 Servicios:</strong> Análisis microbiológicos especializados</li>
            <li><strong>💰 Costo:</strong> Consultar según tipo de análisis</li>
          </ul>
        </div>

        <div className="lab-card" tabIndex="0">
          <h4>🏛️ Laboratorio Central - Autoridad del Agua (ADA)</h4>
          <ul role="list">
            <li><strong>📍 Ubicación:</strong> La Plata</li>
            <li><strong>🔬 Servicios:</strong> Análisis oficiales de agua</li>
            <li><strong>📞 Contacto:</strong> Autoridad del Agua de la Provincia de Buenos Aires</li>
            <li><strong>ℹ️ Nota:</strong> Para muestreos oficiales y denuncias ambientales</li>
            <li><strong>🌐 Web:</strong> <a href="https://ada.gba.gov.ar" target="_blank" rel="noopener">ada.gba.gov.ar</a></li>
          </ul>
        </div>

        <h4 tabIndex="0" aria-label="Cómo contactar">📞 Antes de ir al laboratorio</h4>
        <ul role="list" aria-label="Pasos previos al análisis">
          <li tabIndex="0"><strong>Llamar previamente:</strong> Confirme horarios y disponibilidad</li>
          <li tabIndex="0"><strong>Consultar precios:</strong> Los costos pueden variar según temporada</li>
          <li tabIndex="0"><strong>Coordinar entrega:</strong> Algunas muestras requieren entrega inmediata</li>
          <li tabIndex="0"><strong>Solicitar protocolo:</strong> Pida instrucciones específicas de muestreo</li>
        </ul>

      </article>
    ),
  },
  {
    id: "contacto",
    label: "Información de contacto",
    content: (
      <article>
        <p tabIndex="0" aria-label="Para consultas, denuncias o reportes de contaminación, comunícate con nosotros:">
          Para consultas, denuncias o reportes de contaminación, comunícate con nosotros:
        </p>
        <ul role="list" aria-label="Información de contacto disponible">
          <li tabIndex="0" aria-label="Email: info@riox.todos">
            <strong>Email:</strong> 
            <a 
              href="mailto:info@riox.todos" 
              aria-label="Enviar email a info@riox.todos"
              onFocus={(e) => {
                e.target.style.outline = "2px solid #007bff";
                e.target.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                e.target.style.outline = "none";
              }}
            >
              info@riox.todos
            </a>
          </li>
          <li tabIndex="0" aria-label="Teléfono: +54 00 0000-0000">
            <strong>Teléfono:</strong> 
            <a 
              href="tel:+5400000000" 
              aria-label="Llamar al +54 00 0000-0000"
              onFocus={(e) => {
                e.target.style.outline = "2px solid #007bff";
                e.target.style.outlineOffset = "2px";
              }}
              onBlur={(e) => {
                e.target.style.outline = "none";
              }}
            >
              +54 00 0000-0000
            </a>
          </li>
          <li tabIndex="0" aria-label="Horarios de atención: Lunes a viernes de 9:00 a 18:00">
            <strong>Horarios de atención:</strong> Lunes a viernes de 9:00 a 18:00
          </li>
        </ul>
        <p tabIndex="0" aria-label="Emergencias ambientales: Si detectas un vertido o contaminación grave, llama inmediatamente al número de emergencias.">
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

  const handleKeyDown = (e, sectionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(sectionId);
    }
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
              onKeyDown={(e) => handleKeyDown(e, section.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "1em 1.2em",
                borderRadius: "8px",
                border: "2px solid #007bff",
                borderColor: open === section.id ? "#0056b3" : "#007bff",
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
              aria-label={`${section.label}. Presiona Enter o Espacio para ${open === section.id ? 'cerrar' : 'abrir'} esta sección`}
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
              role="region"
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
                <div 
                  style={{ lineHeight: "1.6" }}
                  role="contentinfo"
                  aria-label={`Contenido de la sección: ${section.label}`}
                >
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