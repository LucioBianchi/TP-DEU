import { useMemo } from 'react';
import { useBalneariosAPI } from './useBalneariosAPI';

export function useBalnearios(filters) {
  const { balnearios, loading, error } = useBalneariosAPI();

  // Normalizar respuesta API -> forma interna homogénea
  const normalized = useMemo(() => {
    if (!Array.isArray(balnearios)) return [];
    
    console.log('Datos crudos del API:', balnearios);
    
    const result = balnearios
      .map(r => {
        const waterNum = numOrZero(r.water_pollution_level);
        const sandNum = numOrZero(r.sand_pollution_level);
        const normalizedItem = {
          id: r.id,
            // nombres
          nombre: r.name || r.nombre || '',
          localidad: r.locality || r.localidad || '',
            // coordenadas normalizadas
          latitude: toNumber(r.latitude),
          longitude: toNumber(r.longitude),
            // niveles numéricos crudos
          water_pollution_level: waterNum,
          sand_pollution_level: sandNum,
            // niveles textuales derivados (agua/arena para UI previa)
          agua: getContaminationLevel(waterNum),
          arena: getContaminationLevel(sandNum),
            // descripción
          descripcion: r.description || r.descripcion || '',
            // fecha (si aplica)
          last_measurement_date: r.last_measurement_date || null
        };
        
        console.log('Item normalizado:', normalizedItem);
        return normalizedItem;
      })
      // filtrar entradas sin coordenadas válidas para no romper Leaflet
      .filter(r => isFinite(r.latitude) && isFinite(r.longitude));
    
    console.log('Resultado final normalizado:', result);
    return result;
  }, [balnearios]);

  const filteredBalnearios = useMemo(() => {
    if (!normalized.length) return [];
    
    console.log('Filtros aplicados:', filters);
    console.log('Datos normalizados antes del filtrado:', normalized);
    
    const result = normalized.filter(b => {
      // Filtro por nombre/localidad
      const matchNombre = !filters.nombre || 
                         filters.nombre === "" || 
                         b.nombre.toLowerCase().includes(filters.nombre.toLowerCase());
      
      // Filtro por contaminación de agua
      const matchAgua = !filters.agua || 
                       filters.agua === "" || 
                       b.agua === filters.agua;
      
      // Filtro por contaminación de arena
      const matchArena = !filters.arena || 
                        filters.arena === "" || 
                        b.arena === filters.arena;
      
      const matches = matchNombre && matchAgua && matchArena;
      console.log(`Balneario ${b.nombre}: nombre=${matchNombre}, agua=${matchAgua}, arena=${matchArena}, total=${matches}`);
      
      return matches;
    });
    
    console.log('Resultado del filtrado:', result);
    return result;
  }, [normalized, filters]);

  const uniqueValues = useMemo(() => {
    if (!normalized.length) return { nombres: [], aguas: [], arenas: [] };
    
    return {
      nombres: [...new Set(normalized.map(b => b.nombre))],
      aguas: [...new Set(normalized.map(b => b.agua))],
      arenas: [...new Set(normalized.map(b => b.arena))]
    };
  }, [normalized]);

  const stats = useMemo(() => {
    return {
      total: normalized.length,
      filtered: filteredBalnearios.length
    };
  }, [normalized.length, filteredBalnearios.length]);

  const result = {
    balnearios: filteredBalnearios,
    allBalnearios: balnearios,
    uniqueValues,
    stats,
    loading,
    error
  };
  
  console.log('Hook useBalnearios retornando:', result);
  
  return result;
}

// Helpers
function getContaminationLevel(level) {
  const v = typeof level === 'number' ? level : numOrZero(level);
  if (v <= 0.3) return 'Bajo';
  if (v <= 0.7) return 'Medio';
  return 'Alto';
}
function toNumber(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}
function numOrZero(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
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