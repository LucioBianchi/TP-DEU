import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function useMedicionesAPI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Crear nueva medición
  const crearMedicion = useCallback(async (medicionData) => {
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/measurements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicionData)
      });

      if (response.ok) {
        const data = await response.json();
        return { success: true, data: data.data };
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error creando medición');
      }
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // Obtener historial de mediciones del usuario
  const obtenerHistorialUsuario = useCallback(async (userId) => {
    if (!token) {
      throw new Error('Usuario no autenticado');
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/users/${userId}/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        throw new Error('Error obteniendo historial');
      }
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, [token]);

  return {
    loading,
    error,
    crearMedicion,
    obtenerHistorialUsuario
  };
}