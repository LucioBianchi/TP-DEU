const db = require('../config/database');

class User {
  static async create(userData) {
    const { id, email, name, role = 'user', measurement_count = 0 } = userData;
    
    const sql = `
      INSERT OR IGNORE INTO users (id, email, name, role, measurement_count)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await db.run(sql, [id, email, name, role, measurement_count]);
      return { id, email, name, role, measurement_count };
    } catch (error) {
      throw new Error(`Error creando usuario: ${error.message}`);
    }
  }

  static async findById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    
    try {
      const user = await db.queryOne(sql, [id]);
      return user;
    } catch (error) {
      throw new Error(`Error buscando usuario: ${error.message}`);
    }
  }

  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    
    try {
      const user = await db.queryOne(sql, [email]);
      return user;
    } catch (error) {
      throw new Error(`Error buscando usuario por email: ${error.message}`);
    }
  }

  static async updateMeasurementCount(userId) {
    const sql = 'UPDATE users SET measurement_count = measurement_count + 1 WHERE id = ?';
    
    try {
      const result = await db.run(sql, [userId]);
      return result;
    } catch (error) {
      throw new Error(`Error actualizando contador de mediciones: ${error.message}`);
    }
  }

  static async getAll() {
    const sql = 'SELECT * FROM users ORDER BY created_at DESC';
    
    try {
      const users = await db.query(sql);
      return users;
    } catch (error) {
      throw new Error(`Error obteniendo usuarios: ${error.message}`);
    }
  }
}

module.exports = User;