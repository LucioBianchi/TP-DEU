import React, { useState, useRef, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";
import { DateStep, LocationStep, ContaminationTypeStep, WaterMeasurementStep, SandMeasurementStep } from "./steps";
import "./MeasurementForm.css";

// Componente principal del formulario
const MeasurementForm = ({ isOpen, onClose, onSubmit }) => {
  const { config } = useConfig();
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

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <DateStep
            onNext={(dateData) => {
              setFormData(prev => ({ ...prev, date: dateData }));
              setCurrentStep(2);
            }}
            onClose={onClose}
          />
        );
      case 2:
        return (
          <LocationStep
            onNext={(locationData) => {
              setFormData(prev => ({ ...prev, location: locationData }));
              setCurrentStep(3);
            }}
            onBack={() => setCurrentStep(1)}
            onClose={onClose}
            dateData={formData.date}
          />
        );
        case 3:
            return (
              <ContaminationTypeStep
                onNext={(contaminationData) => {
                  setFormData(prev => ({ ...prev, contamination: contaminationData }));
                  // Si solo necesita medición de agua, ir al paso 4
                  if (contaminationData.needsWaterMeasurement && !contaminationData.needsSandMeasurement) {
                    setCurrentStep(4);
                  } else if (contaminationData.needsSandMeasurement && !contaminationData.needsWaterMeasurement) {
                setCurrentStep(5); // Solo arena
                    console.log("Datos completos:", { ...formData, contamination: contaminationData });
                  } else if (contaminationData.needsWaterMeasurement && contaminationData.needsSandMeasurement) {
                    // Si necesita ambos, empezar con agua
                    setCurrentStep(4);
                  }
                }}
                onBack={() => setCurrentStep(2)}
                onClose={onClose}
                dateData={formData.date}
                locationData={formData.location}
              />
            );
            case 4:
                return (
                  <WaterMeasurementStep
                    onNext={(waterData) => {
                      setFormData(prev => ({ ...prev, water: waterData }));
                      // Si también necesita medición de arena, ir al paso 5
                      if (formData.contamination?.needsSandMeasurement) {
                        setCurrentStep(5);
                      } else {
                        // Solo agua, enviar formulario
                        handleSubmit(waterData);
                      }
                    }}
                    onBack={() => setCurrentStep(3)}
                    onClose={onClose}
                    dateData={formData.date}
                    locationData={formData.location}
                    contaminationData={formData.contamination}
                  />
                );
              case 5:
                return (
                  <SandMeasurementStep
                    onNext={(sandData) => {
                      setFormData(prev => ({ ...prev, sand: sandData }));
                      // Enviar formulario completo
                      handleSubmit(sandData);
                    }}
                    onBack={() => {
                      // Si venimos del paso de agua, volver ahí; si no, al paso 3
                      if (formData.water) {
                        setCurrentStep(4);
                      } else {
                        setCurrentStep(3);
                      }
                    }}
                    onClose={onClose}
                    dateData={formData.date}
                    locationData={formData.location}
                    contaminationData={formData.contamination}
                  />
                );
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <>
      {isOpen && (
        <div className="measurement-form-overlay">
          <div className="measurement-form-modal" ref={modalRef}>
            {/* Header del modal */}
            <div className="form-header">
              <h2>Nueva Medición</h2>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                className="close-button"
                aria-label="Cerrar formulario"
              >
                ×
              </button>
            </div>
  
            {/* Barra de progreso */}
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
  
            {/* Contenido del formulario */}
            <div className="form-content">
              {renderStep()}
            </div>
            
          </div>
        </div>
      )}
    </>
  );
};

export default MeasurementForm;