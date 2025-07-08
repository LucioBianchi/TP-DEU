import React, { useRef, useEffect } from "react";
import "./WelcomeScreen.css";

export default function WelcomeScreen({ onStart }) {
  const startBtnRef = useRef(null);

  // Foco automático en el botón "Comenzar" al montar
  useEffect(() => {
    startBtnRef.current?.focus();
  }, []);

  return (
    <section
      className="welcome-bg"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      aria-describedby="welcome-desc"
      tabIndex={-1}
    >
      <div className="welcome-overlay">
        <div className="welcome-centerbox">
          <h1 id="welcome-title" className="welcome-title">
            Rio x Todos
          </h1>
          <p id="welcome-desc" className="welcome-desc">
          Conocé el nivel de contaminación de los balnearios del Rio de La Plata de forma rápida y confiable. Además, investigadores y usuarios habilitados pueden colaborar cargando mediciones para construir una base científica abierta y dinámica.
          </p>
          <button
            className="welcome-start-btn"
            onClick={onStart}
            ref={startBtnRef}
            aria-label="Comenzar a usar la aplicación"
            type="button"
          >
            Comenzar
          </button>
        </div>
      </div>
    </section>
  );
} 