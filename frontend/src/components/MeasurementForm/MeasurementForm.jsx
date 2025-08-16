import React, { useState, useRef, useEffect } from "react";
import { DateStep } from "./steps";
import "./MeasurementForm.css";

// Componente principal del formulario
const MeasurementForm = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  
  // Focus trap y manejo de teclado
  useEffect(() => {
    if (isOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);
  
  const handleNext = (stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    setCurrentStep(prev => prev + 1);
  };
  
  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };
  
  const handleSubmit = (finalStepData) => {
    const completeData = { ...formData, ...finalStepData };
    onSubmit(completeData);
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div 
      className="measurement-form-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="form-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="measurement-form-modal"
        role="document"
        aria-label="Formulario de medición"
      >
        {/* Barra superior */}
        <div className="form-header">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / 2) * 100}%` }}
            ></div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="close-button"
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </div>
        
        {/* Contenido del formulario */}
        <div className="form-content">
          {currentStep === 1 && (
            <DateStep 
              onNext={handleNext}
              onClose={onClose}
            />
          )}
          
          {currentStep === 2 && (
            <div>LocationStep - Próximo paso</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeasurementForm;