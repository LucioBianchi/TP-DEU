import { useState } from 'react';

export const useFormValidation = () => {
  const [errors, setErrors] = useState({});

  // Validaciones específicas
  const validators = {
    // Fecha debe ser válida y no posterior a hoy
    date: (value) => {
      if (!value) return 'La fecha es requerida';
      
      // Validar formato DD/MM/AAAA
      const dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      if (!dateRegex.test(value)) {
        return 'Formato inválido. Use DD/MM/AAAA';
      }
      
      const [, day, month, year] = value.match(dateRegex);
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      
      // Validar rangos de fecha
      if (dayNum < 1 || dayNum > 31) {
        return 'El día debe estar entre 1 y 31';
      }
      
      if (monthNum < 1 || monthNum > 12) {
        return 'El mes debe estar entre 1 y 12';
      }
      
      if (yearNum < 1900 || yearNum > 2100) {
        return 'El año debe estar entre 1900 y 2100';
      }
      
      // Validar que la fecha sea real (ej: no 31/02/2024)
      const inputDate = new Date(yearNum, monthNum - 1, dayNum);
      if (inputDate.getDate() !== dayNum || 
          inputDate.getMonth() !== monthNum - 1 || 
          inputDate.getFullYear() !== yearNum) {
        return 'Fecha inválida';
      }
      
      // Validar que no sea posterior a hoy (permite hoy)
      const today = new Date();
      today.setHours(23, 59, 59, 999); // Fin del día de hoy
      
      if (inputDate > today) {
        return 'La fecha no puede ser posterior a hoy';
      }
      
      return null; // Sin error
    },

    // Coordenadas dentro del rango
    coordinates: (lat, lon, localidades) => {
      if (!lat || !lon) return 'Ambas coordenadas son requeridas';

      if (localidades && localidades.length > 0) {
        const distance = calculateDistance(lat, lon, localidades);
        if (distance > 100) {
          return 'Las coordenadas deben estar a máximo 100 km de alguna localidad existente';
        }
      }

      return null;
    },

    // Valores positivos
    positiveNumber: (value, fieldName) => {
      if (!value) return `El campo es requerido`;
      
      const num = parseFloat(value);
      if (isNaN(num) || num < 0) {
        return `El campo debe ser un número positivo`;
      }
      
      return null;
    },

    // Campo requerido
    required: (value, fieldName) => {
      if (!value || value.trim() === '') {
        return `El campo es requerido`;
      }
      return null;
    }
  };

  // Validar un campo
  const validateField = (value, validatorType, fieldName, additionalData = null) => {
    const validator = validators[validatorType];
    if (!validator) return null;

    let result;
    if (validatorType === 'coordinates') {
      result = validator(value.latitude, value.longitude, additionalData);
    } else {
      result = validator(value, fieldName);
    }

    if (result) {
      setErrors(prev => ({ ...prev, [fieldName]: result }));
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    return result;
  };

  // Limpiar error de un campo
  const clearError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  // Limpiar todos los errores
  const clearAllErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateField,
    clearError,
    clearAllErrors
  };
};

// Función auxiliar para calcular distancia
const calculateDistance = (lat, lon, localidades) => {
  let minDistance = Infinity;
  
  localidades.forEach(locality => {
    if (locality.latitude && locality.longitude) {
      const R = 6371; // Radio de la Tierra en km
      const dLat = (locality.latitude - lat) * Math.PI / 180;
      const dLon = (locality.longitude - lon) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat * Math.PI / 180) * Math.cos(locality.latitude * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      
      if (distance < minDistance) {
        minDistance = distance;
      }
    }
  });
  
  return minDistance;
};
