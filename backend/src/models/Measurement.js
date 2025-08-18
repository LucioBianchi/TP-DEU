const db = require('../config/database');

class Measurement {
  static async create(measurementData) {
    const { 
      user_id, 
      location_id, 
      ecoli_water, 
      enterococci_water, 
      ecoli_sand, 
      enterococci_sand, 
      additional_notes 
    } = measurementData;
    
    const sql = `
      INSERT INTO measurements (
        user_id, location_id, 
        ecoli_water, enterococci_water, 
        ecoli_sand, enterococci_sand, 
        additional_notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await db.run(sql, [
        user_id, location_id, 
        ecoli_water, enterococci_water, 
        ecoli_sand, enterococci_sand, 
        additional_notes
      ]);
      
      // Agregar al historial del usuario
      await db.run(
        'INSERT INTO user_measurement_history (user_id, measurement_id) VALUES (?, ?)',
        [user_id, result.id]
      );
      
      return { 
        id: result.id, 
        user_id, 
        location_id, 
        ecoli_water, 
        enterococci_water, 
        ecoli_sand, 
        enterococci_sand, 
        additional_notes 
      };
    } catch (error) {
      throw new Error(`Error creando medición: ${error.message}`);
    }
  }

  static async findById(id) {
    const sql = `
      SELECT m.*, u.name as user_name, l.name as location_name
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.id = ?
    `;
    
    try {
      const measurement = await db.queryOne(sql, [id]);
      return measurement;
    } catch (error) {
      throw new Error(`Error buscando medición: ${error.message}`);
    }
  }

  static async getPending() {
    const sql = `
      SELECT m.*, u.name as user_name, l.name as location_name
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.status = 'pending'
      ORDER BY m.created_at DESC
    `;
    
    try {
      const measurements = await db.query(sql);
      return measurements;
    } catch (error) {
      throw new Error(`Error obteniendo mediciones pendientes: ${error.message}`);
    }
  }

  static async getApproved() {
    const sql = `
      SELECT m.*, u.name as user_name, l.name as location_name
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.status = 'approved'
      ORDER BY m.created_at DESC
    `;
    
    try {
      const measurements = await db.query(sql);
      return measurements;
    } catch (error) {
      throw new Error(`Error obteniendo mediciones aprobadas: ${error.message}`);
    }
  }

  static async getUserHistory(userId) {
    const sql = `
      SELECT m.*, l.name as location_name, l.latitude, l.longitude
      FROM measurements m
      JOIN locations l ON m.location_id = l.id
      WHERE m.user_id = ?
      ORDER BY m.created_at DESC
    `;
    
    try {
      const measurements = await db.query(sql, [userId]);
      return measurements;
    } catch (error) {
      throw new Error(`Error obteniendo historial de mediciones: ${error.message}`);
    }
  }

  static async updateStatus(id, status, reviewedBy) {
    const sql = `
      UPDATE measurements 
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
      WHERE id = ?
    `;
    
    try {
      const result = await db.run(sql, [status, reviewedBy, id]);
      return result;
    } catch (error) {
      throw new Error(`Error actualizando estado de medición: ${error.message}`);
    }
  }

  static async getByLocation(locationId) {
    const sql = `
      SELECT m.*, u.name as user_name
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      WHERE m.location_id = ? AND m.status = 'approved'
      ORDER BY m.created_at DESC
    `;
    
    try {
      const measurements = await db.query(sql, [locationId]);
      return measurements;
    } catch (error) {
      throw new Error(`Error obteniendo mediciones de ubicación: ${error.message}`);
    }
  }

  static async getAll(limit = 50, offset = 0) {
    const sql = `
      SELECT m.*, u.name as user_name, l.name as location_name
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      JOIN locations l ON m.location_id = l.id
      ORDER BY m.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    try {
      const measurements = await db.query(sql, [limit, offset]);
      return measurements;
    } catch (error) {
      throw new Error(`Error obteniendo todas las mediciones: ${error.message}`);
    }
  }

  // Obtener mediciones pendientes de otros usuarios
  static async getPendingMeasurementsFromOthers(userId) {
    const sql = `
      SELECT m.*, u.name as user_name, l.name as location_name
      FROM measurements m
      JOIN users u ON m.user_id = u.id
      JOIN locations l ON m.location_id = l.id
      WHERE m.status = 'pending' AND m.user_id != ?
      ORDER BY m.created_at DESC
    `;
    
    try {
      const measurements = await db.query(sql, [userId]);
      return measurements;
    } catch (error) {
      throw new Error(`Error obteniendo mediciones pendientes de otros usuarios: ${error.message}`);
    }
  }

  // Método para actualizar niveles de contaminación de ubicación basado en mediciones aprobadas
  static async updateLocationPollutionLevels(locationId) {
    const sql = `
      SELECT 
        AVG(ecoli_water) as avg_ecoli_water,
        AVG(enterococci_water) as avg_enterococci_water,
        AVG(ecoli_sand) as avg_ecoli_sand,
        AVG(enterococci_sand) as avg_enterococci_sand,
        COUNT(*) as measurement_count
      FROM measurements 
      WHERE location_id = ? AND status = 'approved'
      AND created_at >= datetime('now', '-30 days')
    `;
    
    try {
      const results = await db.query(sql, [locationId]);
      const result = results[0]; // Tomar el primer resultado
      
      if (result && (result.avg_ecoli_water || result.avg_enterococci_water || result.avg_ecoli_sand || result.avg_enterococci_sand)) {
        // Calcular nivel general basado en promedios
        const waterLevel = this.calculatePollutionLevel(
          result.avg_ecoli_water, 
          result.avg_enterococci_water, 
          'water'
        );
        
        const sandLevel = this.calculatePollutionLevel(
          result.avg_ecoli_sand, 
          result.avg_enterococci_sand, 
          'sand'
        );
        
        // Actualizar la ubicación
        await db.query(
          `UPDATE locations 
           SET water_pollution_level = ?, sand_pollution_level = ?, last_measurement_date = CURRENT_TIMESTAMP
           WHERE id = ?`,
          [waterLevel, sandLevel, locationId]
        );
      }
    } catch (error) {
      console.error('Error actualizando niveles de contaminación:', error);
      // No lanzar error para evitar que falle la aprobación
      // Solo loguear el error
    }
  }

  // Método auxiliar para calcular nivel de contaminación
  static calculatePollutionLevel(ecoli, enterococci, type) {
    if (!ecoli || !enterococci) return 0.0; // Valor por defecto
    
    const standards = type === 'water' ? {
      low: { ecoli: 250, enterococci: 50 },
      medium: { ecoli: 500, enterococci: 100 }
    } : {
      low: { ecoli: 100, enterococci: 20 },
      medium: { ecoli: 500, enterococci: 100 }
    };
    
    // Determinar nivel basado en el peor caso
    let level = 1.0; // Bajo
    
    if (ecoli >= standards.medium.ecoli || enterococci >= standards.medium.enterococci) {
      level = 5.0; // Alto
    } else if (ecoli >= standards.low.ecoli || enterococci >= standards.low.enterococci) {
      level = 3.0; // Medio
    }
    
    return level;
  }
}

module.exports = Measurement;