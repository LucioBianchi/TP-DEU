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
          localidad: r.name || '',
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

    // Asegurar que filters tenga valores por defecto
    const safeFilters = {
      localidad: '',
      agua: '',
      arena: '',
      ...filters
    };
    
    
    const result = normalized.filter(b => {
      // Filtro por nombre/localidad - USAR safeFilters en lugar de filters
      const matchLocalidad = !safeFilters.localidad || 
                         safeFilters.localidad === "" || 
                         b.nombre.toLowerCase().includes(safeFilters.localidad.toLowerCase());
      
      // Filtro por contaminación de agua - USAR safeFilters en lugar de filters
      const matchAgua = !safeFilters.agua || 
                       safeFilters.agua === "" || 
                       b.agua === safeFilters.agua;
      
      // Filtro por contaminación de arena - USAR safeFilters en lugar de filters
      const matchArena = !safeFilters.arena || 
                        safeFilters.arena === "" || 
                        b.arena === safeFilters.arena;
      
      const matches = matchLocalidad && matchAgua && matchArena;
      console.log(`Balneario ${b.nombre}: localidad=${matchLocalidad}, agua=${matchAgua}, arena=${matchArena}, total=${matches}`);
      
      return matches;
    });
    
    console.log('Resultado del filtrado:', result);
    return result;
  }, [normalized, filters]);

  const uniqueValues = useMemo(() => {
    if (!normalized.length) return { localidades: [], aguas: [], arenas: [] };
    
    return {
      localidades: normalized.map(b => ({ id: b.id, nombre: b.nombre })),
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
  // Si el nivel es null, undefined o no es un número válido, retornar "Sin datos"
  if (level === null || level === undefined || !Number.isFinite(Number(level))) {
    return 'Sin datos';
  }
  
  const v = Number(level);
  
  // Si el valor es 0, también considerar como "Sin datos"
  if (v === 0) {
    return 'Sin datos';
  }
  
  // Lógica CORRECTA basada en los valores reales del backend
  if (v === 1.0) return 'Bajo';
  if (v === 3.0) return 'Medio';
  if (v === 5.0) return 'Alto';
  
  // Fallback para valores inesperados
  return 'Sin datos';
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