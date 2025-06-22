import { useState, useCallback } from 'react';

export function useAppState() {
  const [currentPage, setCurrentPage] = useState('mapa');
  const [filters, setFilters] = useState({
    localidad: '',
    agua: '',
    arena: ''
  });

  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      localidad: '',
      agua: '',
      arena: ''
    });
  }, []);

  return {
    currentPage,
    filters,
    navigateTo,
    updateFilters,
    resetFilters
  };
} 