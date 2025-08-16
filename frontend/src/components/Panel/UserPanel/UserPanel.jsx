import React, { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../../context/AuthContext";
import MeasurementForm from "../../MeasurementForm/MeasurementForm";

// Simulación de datos del usuario
const initialUserData = {
  isValidated: true,
  canValidateUsers: true,
  pending: [],
  history: [],
  toValidate: []
};

function shortenEmail(email, maxLength = 18) {
  if (email.length <= maxLength) return email;
  const [name, domain] = email.split("@");
  return `${name.slice(0, 6)}...@${domain.slice(0, 6)}...`;
}

function AccordionSection({ id, label, children, open, setOpen }) {
  const isOpen = open === id;
  return (
    <div style={{ marginBottom: "1.5em" }}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`section-${id}`}
        id={`accordion-${id}`}
        onClick={() => setOpen(isOpen ? null : id)}
        style={{
          width: "100%",
          textAlign: "left",
          padding: "1em 1.2em",
          borderRadius: "8px",
          border: "2px solid #007bff",
          background: isOpen ? "#e9f5ff" : "#f8f9fa",
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
        <span style={{ color: "#007bff", fontWeight: "bold" }}>
          {label}
        </span>
        <span 
          aria-hidden="true"
          style={{
            fontSize: "1.2em",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
          }}
        >
          ▼
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
          borderRadius: "8px",
          padding: isOpen ? "1.5em" : "0",
          marginTop: "0.5em",
          maxHeight: isOpen ? "1000px" : "0",
          overflow: "hidden",
          transition: "all 0.3s ease"
        }}
      >
        {isOpen && (
          <div style={{ lineHeight: "1.6" }}>
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserPanel() {
  const [open, setOpen] = useState(null);
  const [userData, setUserData] = useState(initialUserData);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);
  const [pendingMeasurementsFromOthers, setPendingMeasurementsFromOthers] = useState([]);
  const [canValidate, setCanValidate] = useState(false);
  const { user, loginWithGoogle, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      checkIfCanValidate();
    }
  }, [isAuthenticated, user]);

  const checkIfCanValidate = () => {
    // Verificar si el usuario tiene rol de validador o admin
    setCanValidate(user.role === 'validator' || user.role === 'admin');
    
    if (canValidate) {
      loadPendingMeasurementsFromOthers();
    }
  };

  const loadPendingMeasurementsFromOthers = async () => {
    try {
      const response = await fetch('/api/measurements/pending-others', {
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setPendingMeasurementsFromOthers(data.data);
      }
    } catch (error) {
      console.error('Error cargando mediciones pendientes:', error);
    }
  };

  const handleValidateMeasurement = async (measurementId, status) => {
    try {
      const response = await fetch(`/api/measurements/${measurementId}/review`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes: '' })
      });
      
      if (response.ok) {
        // Recargar las mediciones pendientes
        loadPendingMeasurementsFromOthers();
        // Mostrar mensaje de éxito
        alert(`Medición ${status === 'approved' ? 'aprobada' : 'rechazada'} exitosamente`);
      } else {
        alert('Error al validar la medición');
      }
    } catch (error) {
      console.error('Error validando medición:', error);
      alert('Error al validar la medición');
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    const result = await loginWithGoogle(credentialResponse.credential);
    if (!result.success) {
      alert(result.error || 'Error al iniciar sesión');
    }
  };

  const handleAddMeasurement = () => {
    setShowMeasurementForm(true);
  };

  const handleCloseMeasurementForm = () => {
    setShowMeasurementForm(false);
  };

  // No logueado
  if (!isAuthenticated) {
    return (
      <section aria-label="Inicio de sesión">
        <div style={{ textAlign: "center", marginBottom: "2em" }}>
          <h2 style={{ fontSize: "1.5em", marginBottom: "0.5em", color: "#495057" }}>
            Iniciar Sesión
          </h2>
          <p style={{ color: "#6c757d", marginBottom: "2em" }}>
            Accede a tu cuenta para gestionar mediciones y contribuir al monitoreo de balnearios.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1em" }}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert('Error al iniciar sesión con Google')}
            useOneTap
          />

          <div style={{ 
            textAlign: "center", 
            marginTop: "1em",
            padding: "1em",
            background: "#f8f9fa",
            borderRadius: "8px",
            border: "1px solid #dee2e6"
          }}>
            <p style={{ margin: 0, fontSize: "0.9em", color: "#6c757d" }}>
              Al continuar, aceptas nuestros términos de servicio y política de privacidad.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Logueado pero no validado
  if (!userData.isValidated) {
    return (
      <section aria-label="Estado de validación">
        <div style={{ textAlign: "center", marginBottom: "2em" }}>
          <span className="icon" style={{ fontSize: "3em", display: "block", marginBottom: "1em" }}>⏳</span>
          <h2 style={{ fontSize: "1.5em", marginBottom: "0.5em", color: "#495057" }}>
            Cuenta en validación
          </h2>
        </div>

        <div
          style={{
            background: "#fff3cd",
            color: "#856404",
            border: "2px solid #ffeaa7",
            borderRadius: "8px",
            padding: "1.5em",
            marginBottom: "2em"
          }}
          role="status"
          aria-live="polite"
        >
          <p style={{ margin: "0 0 1em 0", fontWeight: "bold" }}>
            Tu cuenta está en proceso de validación / evaluación.
          </p>
          <p style={{ margin: 0, fontSize: "0.9em" }}>
            Te enviaremos un correo cuando esté habilitada para cargar mediciones.
          </p>
        </div>

        <button
          type="button"
          onClick={logout}
          style={{
            width: "100%",
            padding: "0.8em",
            fontSize: "1em",
            borderRadius: "8px",
            background: "#6c757d",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.2s"
          }}
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
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </section>
    );
  }

  // Logueado y validado 
  return (
    <>
      <section aria-label="Perfil de usuario">
        {/* Header usuario */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75em",
          marginBottom: "2em",
          padding: "1em",
          background: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #dee2e6"
        }}>
          <span className="icon" aria-label="Usuario" role="img" style={{ fontSize: "2em" }}>👤</span>
          
          <div>
            {/* Tag de Admin */}
            {user.role === 'admin' && (
              <div style={{
                display: "inline-block",
                background: "#dc3545",
                color: "#fff",
                padding: "0.2em 0.6em",
                borderRadius: "12px",
                fontSize: "0.7em",
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: "0.5px",
                marginBottom: "0.3em"
              }}>
                Admin
              </div>
            )}
            <div style={{ fontWeight: "bold", fontSize: "1.2em", color: "#495057" }}>
              {user.name}
            </div>
            <div style={{ fontSize: "0.9em", color: "#6c757d" }}>
              {shortenEmail(user.email)}
            </div>
          </div>
        </div>

        {/* Botón agregar medición */}
        <button
          type="button"
          aria-label="Agregar nueva medición"
          onClick={handleAddMeasurement}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5em",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "0.8em",
            fontWeight: "bold",
            marginBottom: "2em",
            cursor: "pointer",
            transition: "background-color 0.2s",
            fontSize: "1em"
          }}
          onFocus={(e) => {
            e.target.style.outline = "2px solid #0056b3";
            e.target.style.outlineOffset = "2px";
          }}
          onBlur={(e) => {
            e.target.style.outline = "none";
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "#007bff";
          }}
        >
          <span className="icon" aria-hidden="true">+</span> 
          Agregar medición
        </button>

        {/* Acordeones */}
        <AccordionSection
          id="pendientes"
          label="Pendientes de evaluación"
          open={open}
          setOpen={setOpen}
        >
          {canValidate && pendingMeasurementsFromOthers.length > 0 ? (
            <div>
              <h4 style={{ marginBottom: "1em", color: "#495057" }}>
                Mediciones de otros usuarios para validar
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {pendingMeasurementsFromOthers.map(med => (
                  <li key={med.id} style={{ 
                    marginBottom: "0.8em",
                    padding: "0.8em",
                    background: "#fffbe6",
                    border: "1px solid #ffe58f",
                    borderRadius: "6px"
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <div style={{ fontWeight: "bold", color: "#856404" }}>
                          {med.location_name}
                        </div>
                        <div style={{ fontSize: "0.9em", color: "#6c757d" }}>
                          Por: {med.user_name} • {new Date(med.created_at).toLocaleDateString()}
                        </div>
                        <div style={{ fontSize: "0.8em", color: "#6c757d", marginTop: "0.5em" }}>
                          Agua: E.coli {med.ecoli_water || 'N/A'}, Enterococos {med.enterococci_water || 'N/A'}
                          {med.ecoli_sand && ` • Arena: E.coli ${med.ecoli_sand}, Enterococos ${med.enterococci_sand}`}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5em" }}>
                        <button
                          onClick={() => handleValidateMeasurement(med.id, 'approved')}
                          style={{
                            padding: "0.3em 0.6em",
                            background: "#28a745",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.8em",
                            cursor: "pointer"
                          }}
                        >
                          Aprobar
                        </button>
                        <button
                          onClick={() => handleValidateMeasurement(med.id, 'rejected')}
                          style={{
                            padding: "0.3em 0.6em",
                            background: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "0.8em",
                            cursor: "pointer"
                          }}
                        >
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p style={{ textAlign: "center", color: "#6c757d", fontStyle: "italic" }}>
              {canValidate ? "No hay mediciones pendientes de otros usuarios." : "No hay mediciones pendientes."}
            </p>
          )}
        </AccordionSection>

        <AccordionSection
          id="historial"
          label="Historial de mediciones"
          open={open}
          setOpen={setOpen}
        >
          {userData.history.length === 0 ? (
            <p style={{ color: "#6c757d", fontStyle: "italic" }}>
              No hay mediciones en el historial.
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {userData.history.map(med => (
                <li key={med.id} style={{ 
                  marginBottom: "0.8em",
                  padding: "0.8em",
                  background: med.estado === "aceptada" ? "#d4edda" : "#f8d7da",
                  border: `1px solid ${med.estado === "aceptada" ? "#c3e6cb" : "#f5c6cb"}`,
                  borderRadius: "6px"
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: "bold", color: med.estado === "aceptada" ? "#155724" : "#721c24" }}>
                        {med.localidad}
                      </div>
                      <div style={{ fontSize: "0.9em", color: "#6c757d" }}>
                        {med.fecha}
                      </div>
                    </div>
                    <span style={{ 
                      padding: "0.3em 0.6em", 
                      background: med.estado === "aceptada" ? "#28a745" : "#dc3545",
                      color: "#fff",
                      borderRadius: "4px",
                      fontSize: "0.8em",
                      fontWeight: "bold"
                    }}>
                      {med.estado === "aceptada" ? "Aceptada" : "Rechazada"}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </AccordionSection>

        {/* Botón cerrar sesión */}
        <button
          type="button"
          onClick={logout}
          style={{
            width: "100%",
            padding: "0.8em",
            fontSize: "1em",
            borderRadius: "8px",
            background: "#6c757d",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background-color 0.2s",
            marginTop: "2em"
          }}
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
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </button>
      </section>

      {/* Formulario de medición */}
      {showMeasurementForm && (
        <MeasurementForm
          isOpen={showMeasurementForm} 
          onClose={handleCloseMeasurementForm}
          onSubmit={(measurement) => { 
            console.log('Medición enviada exitosamente:', measurement);
            setShowMeasurementForm(false);
            // Aquí podrías actualizar el estado local o recargar datos
          }}
        />
      )}
    </>
  );
}