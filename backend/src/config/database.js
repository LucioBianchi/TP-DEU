const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.dbPath = path.join(__dirname, '../../database/balnearios.db');
    this.db = null;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error conectando a la base de datos:', err);
          reject(err);
        } else {
          console.log('Conectado a la base de datos SQLite');
          resolve(this.db);
        }
      });
    });
  }

  getConnection() {
    if (!this.db) {
      throw new Error('Base de datos no conectada. Ejecuta connect() primero.');
    }
    return this.db;
  }

  close() {
    return new Promise((resolve) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error cerrando base de datos:', err);
          } else {
            console.log('Base de datos cerrada correctamente');
          }
          this.db = null;
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  // Método helper para ejecutar queries
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  // Método helper para ejecutar una sola fila
  async queryOne(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  // Método helper para ejecutar INSERT/UPDATE/DELETE
  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
}

// Singleton instance
const database = new Database();
module.exports = database;