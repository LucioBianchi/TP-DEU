import React, { useState, useEffect } from "react";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from "../../../context/AuthContext";
import MeasurementForm from "../../MeasurementForm/MeasurementForm";
import MeasurementDetailModal from "./MeasurementDetailModal";
import ConfirmationModal from "./ConfirmationModal";

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'; 

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
  const [userMeasurementsHistory, setUserMeasurementsHistory] = useState([]);
  const [canValidate, setCanValidate] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const { user, loginWithGoogle, logout, isAuthenticated, token } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      checkIfCanValidate();
      loadUserMeasurementsHistory();
    }
  }, [isAuthenticated, user]);

  const checkIfCanValidate = () => {
     // Verificar si el usuario tiene rol de validador o admin    
     const canValidateUser = user.role === 'validator' || user.role === 'admin';     
     
     setCanValidate(canValidateUser);
     
     if (canValidateUser) {
      loadPendingMeasurementsFromOthers();
    }
  };

  const loadPendingMeasurementsFromOthers = async () => {
    try {

      const response = await fetch(`${API_BASE_URL}/measurements/pending-others`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
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
      const response = await fetch(`${API_BASE_URL}/measurements/${measurementId}/review`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes: '' })
      });
      
      if (response.ok) {
        // Recargar las mediciones pendientes
        loadPendingMeasurementsFromOthers();
        // Cerrar el modal de detalles
        setShowDetailModal(false);
        setSelectedMeasurement(null);
        // Cerrar el modal de confirmación
        setShowConfirmationModal(false);
        setConfirmationAction(null);
        
        // Mostrar mensaje de éxito personalizado
        showSuccessMessage(status);
      } else {
        const errorData = await response.json();
        alert(`Error al validar la medición: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error validando medición:', error);
      alert('Error de conexión al validar la medición');
    }
  };

  const handleShowConfirmation = (action) => {
    setConfirmationAction(action);
    setShowConfirmationModal(true);
  };

  const handleConfirmValidation = () => {
    if (selectedMeasurement && confirmationAction) {
      handleValidateMeasurement(selectedMeasurement.id, confirmationAction);
    }
  };

  const showSuccessMessage = (status) => {
    const message = status === 'approved' 
      ? 'Medición aprobada exitosamente'
      : 'Medición rechazada exitosamente';
    
    // Crear un toast personalizado
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${status === 'approved' ? '#28a745' : '#dc3545'};
      color: white;
      padding: 1rem 1.5rem;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      z-index: 10000;
      font-weight: bold;
      animation: slideInRight 0.3s ease-out;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remover después de 3 segundos
    setTimeout(() => {
      toast.style.animation = 'slideOutRight 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
    
    // Agregar estilos CSS para las animaciones
    if (!document.getElementById('toast-styles')) {
      const style = document.createElement('style');
      style.id = 'toast-styles';
      style.textContent = `
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  };


  const handleShowMeasurementDetail = (measurement) => {
    setSelectedMeasurement(measurement);
    setShowDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedMeasurement(null);
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

  const loadUserMeasurementsHistory = async () => {
    console.log('�� Iniciando carga de historial...');
    console.log('�� Usuario:', user);
    console.log('�� Token:', token ? 'Presente' : 'Ausente');
    
    if (!user || !token) {
      console.log('❌ No hay usuario o token, abortando carga');
      return;
    }
    
    setIsLoadingHistory(true);
    try {
      const url = `${API_BASE_URL}/measurements/user/${user.id}`;
      console.log('�� Haciendo request a:', url);
      
      const response = await fetch(url, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('�� Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      
      if (response.ok) {
        const data = await response.json();
        console.log('�� Datos recibidos:', data);
        console.log('📊 Data.data:', data.data);
        console.log('📊 Cantidad de mediciones:', data.data?.length || 0);
        
        setUserMeasurementsHistory(data.data || []);
      } else {
        const errorText = await response.text();
        console.error('❌ Error en response:', response.status, errorText);
      }
    } catch (error) {
      console.error('💥 Error de red:', error);
    } finally {
      setIsLoadingHistory(false);
      console.log('✅ Carga de historial finalizada');
    }
  };

  const getStatusDisplayInfo = (status) => {
    switch (status) {
      case 'approved':
        return {
          text: 'Aprobada',
          background: '#d4edda',
          border: '#c3e6cb',
          textColor: '#155724',
          badgeBackground: '#28a745'
        };
      case 'rejected':
        return {
          text: 'Rechazada',
          background: '#f8d7da',
          border: '#f5c6cb',
          textColor: '#721c24',
          badgeBackground: '#dc3545'
        };
      case 'pending':
        return {
          text: 'Pendiente',
          background: '#fff3cd',
          border: '#ffeaa7',
          textColor: '#856404',
          badgeBackground: '#ffc107'
        };
      default:
        return {
          text: 'Desconocido',
          background: '#e2e3e5',
          border: '#d6d8db',
          textColor: '#383d41',
          badgeBackground: '#6c757d'
        };
    }
  };

  const formatMeasurementDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // No logueado
  if (!isAuthenticated) {
    return (
      <section aria-label="Inicio de sesión">
        <div style={{ textAlign: "center", marginBottom: "2em" }}>
          <h2 
            style={{ fontSize: "1.5em", marginBottom: "0.5em", color: "#495057" }}
            tabIndex={0}
            aria-label="Iniciar Sesión"
          >
            Iniciar Sesión
          </h2>
          <p 
            style={{ color: "#6c757d", marginBottom: "2em" }}
            tabIndex={0}
            aria-label="Accede a tu cuenta para gestionar mediciones y contribuir al monitoreo de balnearios."
          >
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
          }}
          tabIndex={0}
          >
            <p 
              style={{ margin: 0, fontSize: "0.9em", color: "#6c757d" }}
              tabIndex={0}
              aria-label="Al continuar, aceptas nuestros términos de servicio y política de privacidad."
            >
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
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem"
              }}
              role="grid"
              aria-label="Lista de mediciones pendientes de validación"
            >
              {pendingMeasurementsFromOthers.map((med, index) => (
                <article
                  key={med.id}
                  style={{
                    background: "#ffffff",
                    border: "2px solid #e9ecef",
                    borderRadius: "8px",
                    padding: "0.75rem",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                    transition: "all 0.2s ease",
                    minHeight: "100px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  }}
                  role="gridcell"
                  tabIndex="0"
                  aria-label={`Medición ${index + 1}: ${med.location_name} por ${med.user_name}`}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#007bff";
                    e.target.style.boxShadow = "0 2px 8px rgba(0,123,255,0.2)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#e9ecef";
                    e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
                  }}
                >
                  {/* Localidad */}
                  <h5 
                    style={{ 
                      margin: "0 0 0.5rem 0", 
                      fontSize: "0.9rem", 
                      fontWeight: "bold", 
                      color: "#495057",
                      lineHeight: "1.2"
                    }}
                  >
                    {med.location_name}
                  </h5>
                  
                  {/* Usuario */}
                  <div 
                    style={{ 
                      fontSize: "0.8rem", 
                      color: "#6c757d",
                      marginBottom: "0.5rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.3rem"
                    }}
                  >
                    <span 
                      className="icon" 
                      aria-hidden="true" 
                      style={{ fontSize: "0.7rem" }}
                    >
                      👤
                    </span>
                    <span>{med.user_name}</span>
                  </div>
                  
                  {/* Fecha */}
                  <div 
                    style={{ 
                      fontSize: "0.75rem", 
                      color: "#868e96",
                      marginBottom: "0.5rem"
                    }}
                  >
                    {new Date(med.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </div>

                  {/* Botón Ver Detalle */}
                  <button
                    type="button"
                    onClick={() => handleShowMeasurementDetail(med)}
                    style={{
                      width: "100%",
                      padding: "0.4rem 0.6rem",
                      background: "#007bff",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background-color 0.2s",
                      minHeight: "32px"
                    }}
                    aria-label={`Ver detalles de medición de ${med.location_name} por ${med.user_name}`}
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
                    Ver detalle
                  </button>
                </article>
              ))}
            </div>
          ) : (
            <div 
              style={{
                textAlign: "center",
                padding: "1.5rem",
                background: "#f8f9fa",
                border: "2px dashed #dee2e6",
                borderRadius: "8px"
              }}
              role="status"
              aria-live="polite"
            >
              <span 
                className="icon" 
                aria-hidden="true" 
                style={{ 
                  fontSize: "2rem", 
                  display: "block", 
                  marginBottom: "0.5rem",
                  color: "#adb5bd"
                }}
              >
                📋
              </span>
              <p style={{ 
                margin: "0 0 0.5rem 0", 
                color: "#6c757d", 
                fontWeight: "bold"
              }}>
                {canValidate ? "No hay mediciones pendientes" : "No tienes permisos de validación"}
              </p>
              <p style={{ 
                margin: 0, 
                color: "#868e96", 
                fontSize: "0.85rem" 
              }}>
                {canValidate 
                  ? "Cuando otros usuarios envíen mediciones, aparecerán aquí para su revisión."
                  : "Contacta al administrador si necesitas permisos de validación."
                }
              </p>
            </div>
          )}
        </AccordionSection>

        <AccordionSection
          id="historial"
          label="Historial de mediciones"
          open={open}
          setOpen={setOpen}
        >
          {isLoadingHistory ? (
            <div 
              style={{
                textAlign: "center",
                padding: "2rem",
                color: "#6c757d"
              }}
              role="status"
              aria-live="polite"
              aria-label="Cargando historial de mediciones"
            >
              <span 
                className="icon" 
                aria-hidden="true" 
                style={{ 
                  fontSize: "2rem", 
                  display: "block", 
                  marginBottom: "1rem",
                  animation: "spin 1s linear infinite"
                }}
              >
                ⏳
              </span>
              <p style={{ margin: 0, fontWeight: "bold" }}>
                Cargando historial...
              </p>
            </div>
          ) : userMeasurementsHistory.length === 0 ? (
            <div 
              style={{
                textAlign: "center",
                padding: "2rem",
                background: "#f8f9fa",
                border: "2px dashed #dee2e6",
                borderRadius: "8px"
              }}
              role="status"
              aria-live="polite"
            >
              <span 
                className="icon" 
                aria-hidden="true" 
                style={{ 
                  fontSize: "2rem", 
                  display: "block", 
                  marginBottom: "1rem",
                  color: "#adb5bd"
                }}
              >
                📋
              </span>
              <p style={{ 
                margin: "0 0 0.5rem 0", 
                color: "#6c757d", 
                fontWeight: "bold"
              }}>
                No hay mediciones en el historial
              </p>
              <p style={{ 
                margin: 0, 
                color: "#868e96", 
                fontSize: "0.85rem" 
              }}>
                Cuando envíes mediciones, aparecerán aquí con su estado de validación.
              </p>
            </div>
          ) : (
            <div 
              style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "0.75rem"
              }}
              role="grid"
              aria-label={`Historial de ${userMeasurementsHistory.length} mediciones`}
            >
              {userMeasurementsHistory.map((med, index) => {
                const statusInfo = getStatusDisplayInfo(med.status);
                return (
                  <article
                    key={med.id}
                    style={{
                      background: "#ffffff",
                      border: "2px solid #e9ecef",
                      borderRadius: "8px",
                      padding: "0.75rem",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                      transition: "all 0.2s ease",
                      minHeight: "100px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between"
                    }}
                    role="gridcell"
                    tabIndex="0"
                    aria-label={`Medición ${index + 1}: ${med.location_name} - ${statusInfo.text}`}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#007bff";
                      e.target.style.boxShadow = "0 2px 8px rgba(0,123,255,0.2)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e9ecef";
                      e.target.style.boxShadow = "0 1px 4px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Localidad */}
                    <h5 
                      style={{ 
                        margin: "0 0 0.5rem 0", 
                        fontSize: "0.9rem", 
                        fontWeight: "bold", 
                        color: "#495057",
                        lineHeight: "1.2"
                      }}
                    >
                      {med.location_name}
                    </h5>
                    
                    {/* Fecha */}
                    <div 
                      style={{ 
                        fontSize: "0.8rem", 
                        color: "#6c757d",
                        marginBottom: "0.5rem"
                      }}
                    >
                      {new Date(med.created_at).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </div>

                    {/* Estado */}
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "center"
                    }}>
                      <span 
                        style={{ 
                          padding: "0.4rem 0.8rem", 
                          background: statusInfo.badgeBackground,
                          color: "#fff",
                          borderRadius: "20px",
                          fontSize: "0.75rem",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px"
                        }}
                        aria-label={`Estado: ${statusInfo.text}`}
                      >
                        {statusInfo.text}
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
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

      {/* Modal de detalles de medición */}
      <MeasurementDetailModal
        measurement={selectedMeasurement}
        isOpen={showDetailModal}
        onClose={handleCloseDetailModal}
        onValidate={handleShowConfirmation}
      />

      {/* Modal de confirmación */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        onClose={() => {
          setShowConfirmationModal(false);
          setConfirmationAction(null);
        }}
        onConfirm={handleConfirmValidation}
        action={confirmationAction}
        measurementName={selectedMeasurement?.location_name || ''}
      />
    </>
  );
}