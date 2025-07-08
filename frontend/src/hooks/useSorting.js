import { useState, useCallback } from 'react';

export function useSorting() {
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const sortBalnearios = useCallback((balnearios, sortType) => {
    if (!sortType) return balnearios;

    const sorted = [...balnearios];
    
    switch (sortType) {
      case 'distance':
        // Simular ordenamiento por distancia (aquí se podría integrar con geolocalización)
        sorted.sort((a, b) => {
          // Por ahora ordenar por ID como placeholder
          return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
        });
        break;
        
      case 'contamination':
        // Ordenar por nivel total de contaminación
        sorted.sort((a, b) => {
          const getContaminationLevel = (balneario) => {
            const aguaLevel = balneario.agua === 'Alta' ? 3 : balneario.agua === 'Media' ? 2 : 1;
            const arenaLevel = balneario.arena === 'Alta' ? 3 : balneario.arena === 'Media' ? 2 : 1;
            return aguaLevel + arenaLevel;
          };
          
          const aLevel = getContaminationLevel(a);
          const bLevel = getContaminationLevel(b);
          
          return sortDirection === 'asc' ? aLevel - bLevel : bLevel - aLevel;
        });
        break;
        
      case 'water':
        // Ordenar por contaminación de agua
        sorted.sort((a, b) => {
          const getWaterLevel = (balneario) => {
            return balneario.agua === 'Alta' ? 3 : balneario.agua === 'Media' ? 2 : 1;
          };
          
          const aLevel = getWaterLevel(a);
          const bLevel = getWaterLevel(b);
          
          return sortDirection === 'asc' ? aLevel - bLevel : bLevel - aLevel;
        });
        break;
        
      case 'sand':
        // Ordenar por contaminación de arena
        sorted.sort((a, b) => {
          const getSandLevel = (balneario) => {
            return balneario.arena === 'Alta' ? 3 : balneario.arena === 'Media' ? 2 : 1;
          };
          
          const aLevel = getSandLevel(a);
          const bLevel = getSandLevel(b);
          
          return sortDirection === 'asc' ? aLevel - bLevel : bLevel - aLevel;
        });
        break;
        
      default:
        return balnearios;
    }
    
    return sorted;
  }, [sortDirection]);

  const handleSort = useCallback((sortType) => {
    if (sortBy === sortType) {
      // Si ya está ordenado por este criterio, cambiar dirección
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      // Nuevo criterio de ordenamiento
      setSortBy(sortType);
      setSortDirection('asc');
    }
  }, [sortBy]);

  const clearSort = useCallback(() => {
    setSortBy(null);
    setSortDirection('asc');
  }, []);

  return {
    sortBy,
    sortDirection,
    sortBalnearios,
    handleSort,
    clearSort
  };
} 