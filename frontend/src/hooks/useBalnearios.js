import { useMemo } from 'react';
import { useBalneariosAPI } from './useBalneariosAPI';

export function useBalnearios(filters) {
  const { balnearios, loading, error } = useBalneariosAPI();

  const filteredBalnearios = useMemo(() => {
    if (!balnearios.length) return [];
    
    return balnearios.filter(b => {
      // Filtro por nombre/localidad
      const matchNombre = !filters.nombre || 
                         filters.nombre === "" || 
                         b.name.toLowerCase().includes(filters.nombre.toLowerCase());
      
      // Filtro por contaminación de agua
      const matchAgua = !filters.agua || 
                       filters.agua === "" || 
                       getContaminationLevel(b.water_pollution_level) === filters.agua;
      
      // Filtro por contaminación de arena
      const matchArena = !filters.arena || 
                        filters.arena === "" || 
                        getContaminationLevel(b.sand_pollution_level) === filters.arena;
      
      return matchNombre && matchAgua && matchArena;
    });
  }, [balnearios, filters]);

  const uniqueValues = useMemo(() => {
    if (!balnearios.length) return { nombres: [], aguas: [], arenas: [] };
    
    return {
      nombres: [...new Set(balnearios.map(b => b.name))],
      aguas: [...new Set(balnearios.map(b => getContaminationLevel(b.water_pollution_level)))],
      arenas: [...new Set(balnearios.map(b => getContaminationLevel(b.sand_pollution_level)))]
    };
  }, [balnearios]);

  const stats = useMemo(() => {
    return {
      total: balnearios.length,
      filtered: filteredBalnearios.length
    };
  }, [balnearios.length, filteredBalnearios.length]);

  return {
    balnearios: filteredBalnearios,
    allBalnearios: balnearios,
    uniqueValues,
    stats,
    loading,
    error
  };
}

// Función auxiliar para convertir niveles numéricos a texto
function getContaminationLevel(level) {
  if (level <= 0.3) return 'Bajo';
  if (level <= 0.7) return 'Medio';
  return 'Alto';
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