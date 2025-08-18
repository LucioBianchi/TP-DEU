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
      tabIndex={0}
    >
      <div className="welcome-overlay" tabIndex={0}>
        <div className="welcome-centerbox" tabIndex={0}>
          <h1 
            id="welcome-title" 
            className="welcome-title"
            tabIndex={0}
            aria-label="Rio x Todos"
          >
            Rio x Todos
          </h1>
          <p 
            id="welcome-desc" 
            className="welcome-desc"
            tabIndex={0}
            aria-label="Conocé el nivel de contaminación de los balnearios del Rio de La Plata de forma rápida y confiable. Además, investigadores y usuarios habilitados pueden colaborar cargando medición para construir una base científica abierta y dinámica."
          >
            Conocé el nivel de contaminación de los balnearios del Rio de La Plata de forma rápida y confiable. Además, investigadores y usuarios habilitados pueden colaborar cargando medición para construir una base científica abierta y dinámica.
          </p>
          <button
            className="welcome-start-btn"
            onClick={onStart}
            ref={startBtnRef}
            aria-label="Comenzar"
            type="button"
            tabIndex={0}
          >
            Comenzar
          </button>
        </div>
      </div>
    </section>
  );
} 