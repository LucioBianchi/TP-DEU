/**
 * Estándares de contaminación basados en guías OMS/EPA y protocolos científicos
 * Centraliza toda la lógica de cálculo de niveles de contaminación
 */

// Constantes para estándares de agua (UFC/100 ml)
export const WATER_STANDARDS = {
    LOW: {
      ecoli: 250,
      enterococci: 50,
      label: 'Bajo',
      color: '#28a745',
      description: 'Seguro para uso recreativo'
    },
    MEDIUM: {
      ecoli: { min: 250, max: 500 },
      enterococci: { min: 50, max: 100 },
      label: 'Medio',
      color: '#ffc107',
      description: 'Precaución recomendada'
    },
    HIGH: {
      ecoli: 500,
      enterococci: 100,
      label: 'Alto',
      color: '#dc3545',
      description: 'No recomendado para uso recreativo'
    }
  };
  
  // Constantes para estándares de arena (UFC/100 g)
  export const SAND_STANDARDS = {
    LOW: {
      ecoli: 100,
      enterococci: 20,
      label: 'Bajo',
      color: '#28a745',
      description: 'Seguro para uso recreativo'
    },
    MEDIUM: {
      ecoli: { min: 100, max: 500 },
      enterococci: { min: 20, max: 100 },
      label: 'Medio',
      color: '#ffc107',
      description: 'Precaución recomendada'
    },
    HIGH: {
      ecoli: 500,
      enterococci: 100,
      label: 'Alto',
      color: '#dc3545',
      description: 'No recomendado para uso recreativo'
    }
  };

  export function calculatePollutionLevel(ecoli, enterococci, type) {
    if (!ecoli || !enterococci) return 3.0;
    
    const standards = type === 'water' ? WATER_STANDARDS : SAND_STANDARDS;
    
    let level = 1.0; // Bajo
    
    if (ecoli >= standards.MEDIUM.ecoli || enterococci >= standards.MEDIUM.enterococci) {
      level = 5.0; // Alto
    } else if (ecoli >= standards.LOW.ecoli || enterococci >= standards.LOW.enterococci) {
      level = 3.0; // Medio
    }
    
    return level;
  }
  
  /**
   * Determina el nivel de contaminación del agua basado en estándares OMS/EPA
   * @param {number} ecoli - UFC de E. coli por 100 ml
   * @param {number} enterococci - UFC de enterococos por 100 ml
   * @returns {Object} Objeto con nivel, color y descripción
   */
  export const getWaterContaminationLevel = (ecoli, enterococci) => {
    // Validar que los valores sean números válidos
    if (typeof ecoli !== 'number' || typeof enterococci !== 'number' || 
        isNaN(ecoli) || isNaN(enterococci) || ecoli < 0 || enterococci < 0) {
      return {
        level: 'UNKNOWN',
        label: 'Desconocido',
        color: '#6c757d',
        description: 'Datos insuficientes para determinar nivel'
      };
    }
  
    // Determinar nivel basado en el peor caso (principio de precaución)
    let worstCase = 'LOW';
  
    // Verificar E. coli
    if (ecoli >= WATER_STANDARDS.HIGH.ecoli) {
      worstCase = 'HIGH';
    } else if (ecoli >= WATER_STANDARDS.MEDIUM.ecoli.min) {
      worstCase = 'MEDIUM';
    }
  
    // Verificar enterococos
    if (enterococci >= WATER_STANDARDS.HIGH.enterococci) {
      worstCase = 'HIGH';
    } else if (enterococci >= WATER_STANDARDS.MEDIUM.enterococci.min && worstCase !== 'HIGH') {
      worstCase = 'MEDIUM';
    }
  
    return {
      level: worstCase,
      label: WATER_STANDARDS[worstCase].label,
      color: WATER_STANDARDS[worstCase].color,
      description: WATER_STANDARDS[worstCase].description,
      ecoli: ecoli,
      enterococci: enterococci
    };
  };
  
  /**
   * Determina el nivel de contaminación de la arena basado en estándares europeos
   * @param {number} ecoli - UFC de E. coli por 100 g
   * @param {number} enterococci - UFC de enterococos por 100 g
   * @returns {Object} Objeto con nivel, color y descripción
   */
  export const getSandContaminationLevel = (ecoli, enterococci) => {
    // Validar que los valores sean números válidos
    if (typeof ecoli !== 'number' || typeof enterococci !== 'number' || 
        isNaN(ecoli) || isNaN(enterococci) || ecoli < 0 || enterococci < 0) {
      return {
        level: 'UNKNOWN',
        label: 'Desconocido',
        color: '#6c757d',
        description: 'Datos insuficientes para determinar nivel'
      };
    }
  
    // Determinar nivel basado en el peor caso (principio de precaución)
    let worstCase = 'LOW';
  
    // Verificar E. coli
    if (ecoli >= SAND_STANDARDS.HIGH.ecoli) {
      worstCase = 'HIGH';
    } else if (ecoli >= SAND_STANDARDS.MEDIUM.ecoli.min) {
      worstCase = 'MEDIUM';
    }
  
    // Verificar enterococos
    if (enterococci >= SAND_STANDARDS.HIGH.enterococci) {
      worstCase = 'HIGH';
    } else if (enterococci >= SAND_STANDARDS.MEDIUM.enterococci.min && worstCase !== 'HIGH') {
      worstCase = 'MEDIUM';
    }
  
    return {
      level: worstCase,
      label: SAND_STANDARDS[worstCase].label,
      color: SAND_STANDARDS[worstCase].color,
      description: SAND_STANDARDS[worstCase].description,
      ecoli: ecoli,
      enterococci: enterococci
    };
  };
  
  /**
   * Obtiene el color para un nivel de contaminación específico
   * @param {string} level - Nivel de contaminación ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')
   * @param {string} type - Tipo de medición ('water' o 'sand')
   * @returns {string} Color hexadecimal
   */
  export const getContaminationColor = (level, type = 'water') => {
    const standards = type === 'water' ? WATER_STANDARDS : SAND_STANDARDS;
    return standards[level]?.color || '#6c757d';
  };
  
  /**
   * Obtiene la descripción para un nivel de contaminación específico
   * @param {string} level - Nivel de contaminación ('LOW', 'MEDIUM', 'HIGH', 'UNKNOWN')
   * @param {string} type - Tipo de medición ('water' o 'sand')
   * @returns {string} Descripción del nivel
   */
  export const getContaminationDescription = (level, type = 'water') => {
    const standards = type === 'water' ? WATER_STANDARDS : SAND_STANDARDS;
    return standards[level]?.description || 'Datos insuficientes';
  };
  
  /**
   * Formatea los valores de contaminación para mostrar en la UI
   * @param {number} value - Valor numérico
   * @param {string} unit - Unidad de medida ('ml' o 'g')
   * @returns {string} Valor formateado
   */
  export const formatContaminationValue = (value, unit = 'ml') => {
    if (typeof value !== 'number' || isNaN(value)) return 'N/A';
    
    if (value < 1) {
      return `< 1 UFC/100 ${unit}`;
    } else if (value < 10) {
      return `${value.toFixed(1)} UFC/100 ${unit}`;
    } else {
      return `${Math.round(value)} UFC/100 ${unit}`;
    }
  };

  
  /**
   * Calcula el nivel de riesgo general combinando agua y arena
   * @param {Object} waterLevel - Nivel de contaminación del agua
   * @param {Object} sandLevel - Nivel de contaminación de la arena
   * @returns {Object} Nivel de riesgo general
   */
  export const getOverallRiskLevel = (waterLevel, sandLevel) => {
    // Mapear niveles a valores numéricos para comparación
    const levelValues = { 'LOW': 1, 'MEDIUM': 2, 'HIGH': 3, 'UNKNOWN': 0 };
    
    const waterValue = levelValues[waterLevel.level] || 0;
    const sandValue = levelValues[sandLevel.level] || 0;
    
    // Tomar el peor caso
    const worstValue = Math.max(waterValue, sandValue);
    
    // Mapear de vuelta a nivel
    const riskLevels = ['UNKNOWN', 'LOW', 'MEDIUM', 'HIGH'];
    const overallLevel = riskLevels[worstValue];
    
    return {
      level: overallLevel,
      label: getContaminationDescription(overallLevel),
      color: getContaminationColor(overallLevel),
      waterLevel: waterLevel.level,
      sandLevel: sandLevel.level
    };
  };
  
  /**
   * Valida si un valor de contaminación está dentro de rangos razonables
   * @param {number} value - Valor a validar
   * @param {string} type - Tipo de medición ('water' o 'sand')
   * @param {string} bacteria - Tipo de bacteria ('ecoli' o 'enterococci')
   * @returns {boolean} True si el valor es válido
   */
  export const isValidContaminationValue = (value, type = 'water', bacteria = 'ecoli') => {
    if (typeof value !== 'number' || isNaN(value) || value < 0) return false;
    
    // Límites máximos razonables (10,000 UFC/100 ml o g)
    const maxReasonable = 10000;
    
    return value <= maxReasonable;
  };