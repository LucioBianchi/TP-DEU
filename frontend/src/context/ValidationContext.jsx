import React, { createContext, useContext, useState } from 'react';

const ValidationContext = createContext();

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation debe usarse dentro de ValidationProvider');
  }
  return context;
};

export const ValidationProvider = ({ children }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const setError = (field, message) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  const clearError = (field) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const setTouchedField = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const clearAllErrors = () => {
    setErrors({});
    setTouched({});
  };

  const hasErrors = () => {
    return Object.keys(errors).length > 0;
  };

  return (
    <ValidationContext.Provider value={{
      errors,
      touched,
      setError,
      clearError,
      setTouchedField,
      clearAllErrors,
      hasErrors
    }}>
      {children}
    </ValidationContext.Provider>
  );
};
