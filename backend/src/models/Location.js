const db = require('../config/database');

class Location {
  static async create(locationData) {
    const { name, latitude, longitude, description } = locationData;
    
    const sql = `
      INSERT INTO locations (name, latitude, longitude, description)
      VALUES (?, ?, ?, ?)
    `;
    
    try {
      const result = await db.run(sql, [name, latitude, longitude, description]);
      return { id: result.id, name, latitude, longitude, description };
    } catch (error) {
      throw new Error(`Error creando ubicación: ${error.message}`);
    }
  }

  static async findById(id) {
    const sql = 'SELECT * FROM locations WHERE id = ?';
    
    try {
      const location = await db.queryOne(sql, [id]);
      return location;
    } catch (error) {
      throw new Error(`Error buscando ubicación: ${error.message}`);
    }
  }

  static async getAll() {
    const sql = 'SELECT * FROM locations ORDER BY name';
    
    try {
      const locations = await db.query(sql);
      return locations;
    } catch (error) {
      throw new Error(`Error obteniendo ubicaciones: ${error.message}`);
    }
  }

  static async getWaterPollutionLevel(id) {
    const sql = 'SELECT water_pollution_level FROM locations WHERE id = ?';
    const result = await db.queryOne(sql, [id]);
    return result.water_pollution_level;
  }

  static async getSandPollutionLevel(id) {
    const sql = 'SELECT sand_pollution_level FROM locations WHERE id = ?';
    const result = await db.queryOne(sql, [id]);
    return result.sand_pollution_level;
  }

  static async updatePollutionLevels(id, waterLevel, sandLevel) {
    const sql = `
      UPDATE locations 
      SET water_pollution_level = ?, sand_pollution_level = ?, last_measurement_date = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    try {
      const result = await db.run(sql, [waterLevel, sandLevel, id]);
      return result;
    } catch (error) {
      throw new Error(`Error actualizando niveles de contaminación: ${error.message}`);
    }
  }

  static async getNearby(lat, lng, radius = 0.01) {
    const sql = `
      SELECT * FROM locations 
      WHERE ABS(latitude - ?) <= ? AND ABS(longitude - ?) <= ?
      ORDER BY name
    `;
    
    try {
      const locations = await db.query(sql, [lat, radius, lng, radius]);
      return locations;
    } catch (error) {
      throw new Error(`Error buscando ubicaciones cercanas: ${error.message}`);
    }
  }
}

module.exports = Location;