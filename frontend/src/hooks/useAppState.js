import { useState, useCallback } from 'react';

export function useAppState() {
  const [currentPage, setCurrentPage] = useState(null);
  const [filters, setFilters] = useState({
    localidad: '',
    agua: '',
    arena: ''
  });

  const navigateTo = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const closePanel = useCallback(() => {
    setCurrentPage(null);
    // El foco se manejará en el componente Sidebar
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
    closePanel,
    updateFilters,
    resetFilters
  };
} 