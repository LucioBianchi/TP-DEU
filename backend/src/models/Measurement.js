const db = require('../config/database');

class Measurement {
  static async create(measurementData) {
    const { user_id, location_id, water_quality, sand_quality, additional_notes } = measurementData;
    
    const sql = `
      INSERT INTO measurements (user_id, location_id, water_quality, sand_quality, additional_notes)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await db.run(sql, [user_id, location_id, water_quality, sand_quality, additional_notes]);
      
      // Agregar al historial del usuario
      await db.run(
        'INSERT INTO user_measurement_history (user_id, measurement_id) VALUES (?, ?)',
        [user_id, result.id]
      );
      
      return { id: result.id, user_id, location_id, water_quality, sand_quality, additional_notes };
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
    `;
  }
}

module.exports = Measurement;