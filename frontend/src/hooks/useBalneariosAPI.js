import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function useBalneariosAPI() {
  const [balnearios, setBalnearios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtener todos los balnearios
  const fetchBalnearios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/locations`);
      if (response.ok) {
        const data = await response.json();
        setBalnearios(data.data);
      } else {
        throw new Error('Error obteniendo balnearios');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener balneario específico
  const fetchBalneario = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations/${id}`);
      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        throw new Error('Error obteniendo balneario');
      }
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  // Obtener balnearios cercanos
  const fetchBalneariosCercanos = useCallback(async (lat, lng, radius = 0.01) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/locations/nearby?lat=${lat}&lng=${lng}&radius=${radius}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.data;
      } else {
        throw new Error('Error obteniendo balnearios cercanos');
      }
    } catch (err) {
      setError(err.message);
      return [];
    }
  }, []);

  // Cargar balnearios al montar el hook
  useEffect(() => {
    fetchBalnearios();
  }, [fetchBalnearios]);

  return {
    balnearios,
    loading,
    error,
    fetchBalnearios,
    fetchBalneario,
    fetchBalneariosCercanos,
    refetch: fetchBalnearios
  };
}