const db = require('../config/database');

class User {
  static async create(userData) {
    const { id, email, name, role = 'user', measurement_count = 0 } = userData;
    
    // Si el email coincide con el admin del .env, forzar rol admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const finalRole = (adminEmail && email === adminEmail) ? 'admin' : role;

    const sql = `
      INSERT OR IGNORE INTO users (id, email, name, role, measurement_count)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    try {
      const result = await db.run(sql, [id, email, name, finalRole, measurement_count]);
      return { id, email, name, role: finalRole, measurement_count };
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
    try {
      // Primero actualizar el contador
      const result = await db.run(
        'UPDATE users SET measurement_count = measurement_count + 1 WHERE id = ?', 
        [userId]
      );
      
      // Verificar si puede ser promovido a validador
      const canBecomeValidator = await this.canBecomeValidator(userId);
      
      if (canBecomeValidator) {
        // Promover automáticamente a validador
        await this.promoteToValidator(userId);
        console.log(`Usuario ${userId} promovido a validador automáticamente`);
      }
      
      return result;
    } catch (error) {
      throw new Error(`Error actualizando contador de mediciones: ${error.message}`);
    }
  }
  
  // Verificar si un usuario puede ser validador
  static async canBecomeValidator(userId) {
    const sql = `
      SELECT COUNT(*) as approved_count
      FROM measurements 
      WHERE user_id = ? AND status = 'approved'
    `;
    
    try {
      const result = await db.queryOne(sql, [userId]);
      return result.approved_count >= 3;
    } catch (error) {
      throw new Error(`Error verificando elegibilidad de validador: ${error.message}`);
    }
  }
  
  // Promover usuario a validador
  static async promoteToValidator(userId) {
    const sql = 'UPDATE users SET role = ? WHERE id = ?';
    
    try {
      const result = await db.run(sql, ['validator', userId]);
      return result;
    } catch (error) {
      throw new Error(`Error promoviendo usuario a validador: ${error.message}`);
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