import React, { useState } from "react";

// Simulación de estado de usuario y datos
const user = {
  isLogged: true,
  isValidated: true,
  canValidateUsers: true,
  name: "Juan Pérez",
  pending: [
    { id: 1, localidad: "Localidad 1", fecha: "2025-06-16" },
    { id: 2, localidad: "Localidad 2", fecha: "2025-06-15" }
  ],
  history: [
    { id: 3, localidad: "Localidad 3", fecha: "2025-06-10", estado: "aceptada" },
    { id: 4, localidad: "Localidad 4", fecha: "2025-06-09", estado: "rechazada" }
  ],
  toValidate: [
    { id: 5, nombre: "Usuario Nuevo", email: "usuario.nuevo@gmail.com" }
  ]
};

function shortenEmail(email, maxLength = 18) {
  if (email.length <= maxLength) return email;
  const [name, domain] = email.split("@");
  return `${name.slice(0, 6)}...@${domain.slice(0, 6)}...`;
}

function AccordionSection({ id, label, children, open, setOpen }) {
  const isOpen = open === id;
  return (
    <div style={{ marginBottom: "1em" }}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
        id={`accordion-${id}`}
        onClick={() => setOpen(isOpen ? null : id)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "0.75em 1em",
          borderRadius: "6px",
          border: "1px solid #007bff",
          background: isOpen ? "#e9f5ff" : "#f8f9fa",
          fontWeight: "bold",
          cursor: "pointer",
          outline: "none",
          marginBottom: "0.25em",
          fontSize: "1.15em"
        }}
      >
      <span style={{ fontSize: "0.8em", color: "#007bff", fontWeight: "bold" }}>
      {label}
      </span>
      </button>
      <div
        id={`section-${id}`}
        role="region"
        aria-labelledby={`accordion-${id}`}
        hidden={!isOpen}
        style={{
          background: "#f8f9fa",
          border: "1px solid #dee2e6",
          borderRadius: "6px",
          padding: isOpen ? "1em" : "0",
          marginTop: "0.25em"
        }}
      >
        {isOpen && children}
      </div>
    </div>
  );
}

export default function UserPanel() {
  const [open, setOpen] = useState(null);

  // No logueado
  if (!user.isLogged) {
    return (
      <section>
        <div style={{ display: "flex", flexDirection: "column", gap: "1em", marginTop: "2em" }}>
          <button
            type="button"
            style={{
              width: "100%",
              padding: "1em",
              fontSize: "1.2em",
              borderRadius: "8px",
              background: "#007bff",
              color: "#fff",
              border: "none",
              fontWeight: "bold"
            }}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            style={{
              width: "100%",
              padding: "1em",
              fontSize: "1.2em",
              borderRadius: "8px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              fontWeight: "bold"
            }}
          >
            Registrarse
          </button>
        </div>
      </section>
    );
  }

  // Logueado pero no validado
  if (!user.isValidated) {
    return (
      <section>
        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            border: "1px solid #ffeeba",
            borderRadius: "8px",
            padding: "1em",
            margin: "1em 0"
          }}
          role="status"
          aria-live="polite"
        >
          Tu cuenta está en proceso de validación / evaluación.
        </div>
        <div style={{ marginTop: "1em" }}>
          Te enviaremos un correo cuando esté habilitada para cargar mediciones.
        </div>
      </section>
    );
  }

  // Logueado y validado
  return (
    <section>
      {/* Header usuario */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.75em",
        marginBottom: "2em"
      }}>
        <span className="icon" aria-label="Usuario" role="img">👤</span>
        <span style={{ fontWeight: "bold", fontSize: "1.3em" }}>{user.name}</span>
      </div>

      {/* Subtítulo Mediciones */}
      <h2 style={{ fontSize: "1.3em", margin: "0 0 1em 0" }}>Mediciones</h2>

      {/* Botón agregar medición */}
      <button
        type="button"
        aria-label="Agregar medición"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5em",
          background: "#e9f5ff",
          border: "1px solid #007bff",
          borderRadius: "6px",
          padding: "0.5em 1em",
          fontWeight: "bold",
          marginBottom: "1em"
        }}
      >
        <span className="icon" aria-hidden="true">+</span> Agregar medición
      </button>

      {/* Acordeones */}
      <AccordionSection
        id="pendientes"
        label="Pendientes de evaluación"
        open={open}
        setOpen={setOpen}
      >
        {user.pending.length === 0 ? (
          <p>No hay mediciones pendientes.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {user.pending.map(med => (
              <li key={med.id} style={{ marginBottom: "0.5em" }}>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: "6px",
                    padding: "0.5em 1em"
                  }}
                  aria-label={`Medición pendiente en ${med.localidad}, fecha ${med.fecha}`}
                >
                  <span>{med.localidad}</span>
                  <span style={{ fontSize: "0.9em", color: "#888" }}>{med.fecha}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AccordionSection>

      <AccordionSection
        id="historial"
        label="Historial de mediciones"
        open={open}
        setOpen={setOpen}
      >
        {user.history.length === 0 ? (
          <p>No hay historial de mediciones.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {user.history.map(med => (
              <li key={med.id} style={{ marginBottom: "0.5em" }}>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: med.estado === "aceptada" ? "#e6ffed" : "#fff0f0",
                    border: med.estado === "aceptada" ? "1px solid #52c41a" : "1px solid #ff4d4f",
                    borderRadius: "6px",
                    padding: "0.5em 1em"
                  }}
                  aria-label={`Medición en ${med.localidad}, fecha ${med.fecha}, ${med.estado === "aceptada" ? "aceptada" : "rechazada"}`}
                >
                  <span>{med.localidad}</span>
                  <span style={{
                    fontSize: "0.9em",
                    color: med.estado === "aceptada" ? "#389e0d" : "#cf1322",
                    fontWeight: "bold"
                  }}>
                    {med.estado === "aceptada" ? "Aceptada" : "Rechazada"}
                  </span>
                  <span style={{ fontSize: "0.9em", color: "#888" }}>{med.fecha}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </AccordionSection>

      {/* Sección para validar usuarios */}
      {user.canValidateUsers && (
        <>
          <h2 style={{ fontSize: "1.3em", margin: "2em 0 1em 0" }}>Usuarios a validar</h2>
          <AccordionSection
            id="validar-usuarios"
            label="Ver usuarios pendientes"
            open={open}
            setOpen={setOpen}
          >
            {user.toValidate.length === 0 ? (
              <p>No hay usuarios para validar.</p>
            ) : (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {user.toValidate.map(u => (
                  <li key={u.id} style={{ marginBottom: "1em" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#e9f5ff",
                        border: "1px solid #007bff",
                        borderRadius: "6px",
                        padding: "0.5em 1em",
                        flexWrap: "wrap"
                      }}
                      aria-label={`Usuario ${u.nombre}, email ${u.email}`}
                    >
                      <span style={{ fontWeight: "bold" }}>{u.nombre}</span>
                      <span style={{
                        fontSize: "0.95em",
                        color: "#888",
                        maxWidth: "120px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}>
                        {shortenEmail(u.email)}
                      </span>
                    </div>
                    <div style={{
                      display: "flex",
                      gap: "1em",
                      marginTop: "0.5em",
                      justifyContent: "center"
                    }}>
                      <button
                        type="button"
                        aria-label={`Aceptar usuario ${u.nombre}`}
                        style={{
                          background: "#28a745",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5em 1.5em",
                          fontWeight: "bold"
                        }}
                      >
                        Aceptar
                      </button>
                      <button
                        type="button"
                        aria-label={`Rechazar usuario ${u.nombre}`}
                        style={{
                          background: "#dc3545",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          padding: "0.5em 1.5em",
                          fontWeight: "bold"
                        }}
                      >
                        Rechazar
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </AccordionSection>
        </>
      )}
    </section>
  );
}