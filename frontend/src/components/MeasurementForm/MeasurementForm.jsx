import React, { useState, useRef, useEffect } from "react";
import { useConfig } from "../../context/ConfigContext";
import { useMedicionesAPI } from "../../hooks/useMedicionesAPI";
import { DateStep, LocationStep, ContaminationTypeStep, WaterMeasurementStep, SandMeasurementStep, ExtraInfoStep } from "./steps";
import "./MeasurementForm.css";

// Componente principal del formulario
const MeasurementForm = ({ isOpen, onClose, onSubmit }) => {
  const { config } = useConfig();
  const { crearMedicion, loading, error } = useMedicionesAPI();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
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
  
  const handleSubmit = async (finalStepData) => {
    try {
      // Preparar datos para el backend
      const measurementData = {
        location_id: formData.location?.id || formData.coordinates?.id,
        ecoli_water: formData.water?.waterMeasurements?.eColi ? parseFloat(formData.water.waterMeasurements.eColi) : null,
        enterococci_water: formData.water?.waterMeasurements?.enterococci ? parseFloat(formData.water.waterMeasurements.enterococci) : null,
        ecoli_sand: formData.sand?.sandMeasurements?.eColi ? parseFloat(formData.sand.sandMeasurements.eColi) : null,
        enterococci_sand: formData.sand?.sandMeasurements?.enterococci ? parseFloat(formData.sand.sandMeasurements.enterococci) : null,
        additional_notes: finalStepData?.observations || ''
      };
      
      console.log('Datos a enviar al backend:', measurementData);

      // Enviar al backend
      const result = await crearMedicion(measurementData);
      
      if (result.success) {
        setShowSuccessPopup(true);
        // Cerrar el popup después de 3 segundos
        setTimeout(() => {
          setShowSuccessPopup(false);
          onClose();
          if (onSubmit) onSubmit(result.data);
        }, 3000);
      } else {
        console.error('Error al enviar medición:', result.error);
      }
    } catch (err) {
      console.error('Error al enviar medición:', err);
    }
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
                    } else if (contaminationData.needsWaterMeasurement && contaminationData.needsSandMeasurement) {
                    setCurrentStep(4); // Empezar con agua
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
                    // Solo agua, ir a información extra
                    setCurrentStep(6);
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
                // Ir a información extra
                setCurrentStep(6);
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
        case 6:
            return (
            <ExtraInfoStep
                onNext={(extraData) => {
                setFormData(prev => ({ ...prev, extra: extraData }));
                // Enviar formulario completo
                handleSubmit(extraData);
                }}
                onBack={() => {
                // Volver al paso anterior según qué mediciones se hicieron
                if (formData.water && formData.sand) {
                    setCurrentStep(5); // Volver a arena
                } else if (formData.water) {
                    setCurrentStep(4); // Volver a agua
                } else if (formData.sand) {
                    setCurrentStep(5); // Volver a arena
                } else {
                    setCurrentStep(3); // Volver a tipo de contaminación
                }
                }}
                onClose={onClose}
                dateData={formData.date}
                locationData={formData.location}
                contaminationData={formData.contamination}
                waterData={formData.water}
                sandData={formData.sand}
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

      {/* Popup de éxito */}
      {showSuccessPopup && (
        <div className="success-popup-overlay">
          <div className="success-popup">
            <div className="success-icon">✅</div>
            <h3>¡Medición enviada exitosamente!</h3>
            <p>Tu medición ha sido registrada en el sistema.</p>
            <p>Será revisada por un validador antes de ser aprobada.</p>
          </div>
        </div>
      )}
    </>
  );
};

export default MeasurementForm;