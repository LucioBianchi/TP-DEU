import { useMemo } from 'react';
import { balnearios } from '../data/balnearios';

export function useBalnearios(filters) {
  const filteredBalnearios = useMemo(() => {
    return balnearios.filter(b => {
      const matchLocalidad = !filters.localidad || 
                            filters.localidad === "Todas" || 
                            b.localidad === filters.localidad;
      const matchAgua = !filters.agua || b.agua === filters.agua;
      const matchArena = !filters.arena || b.arena === filters.arena;
      return matchLocalidad && matchAgua && matchArena;
    });
  }, [filters]);

  const uniqueValues = useMemo(() => {
    return {
      localidades: [...new Set(balnearios.map(b => b.localidad))],
      aguas: [...new Set(balnearios.map(b => b.agua))],
      arenas: [...new Set(balnearios.map(b => b.arena))]
    };
  }, []);

  const stats = useMemo(() => {
    return {
      total: balnearios.length,
      filtered: filteredBalnearios.length
    };
  }, [filteredBalnearios.length]);

  return {
    balnearios: filteredBalnearios,
    allBalnearios: balnearios,
    uniqueValues,
    stats
  };
}

// Función auxiliar para ordenamiento
function sortBalnearios(balnearios, sortType, direction) {
  const sorted = [...balnearios];
  
  switch (sortType) {
    case 'distance':
      // Simular ordenamiento por distancia
      sorted.sort((a, b) => {
        return direction === 'asc' ? a.id - b.id : b.id - a.id;
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
        
        return direction === 'asc' ? aLevel - bLevel : bLevel - aLevel;
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
        
        return direction === 'asc' ? aLevel - bLevel : bLevel - aLevel;
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
        
        return direction === 'asc' ? aLevel - bLevel : bLevel - aLevel;
      });
      break;
      
    default:
      return balnearios;
  }
  
  return sorted;
} 