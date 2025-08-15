const { User, Measurement } = require('../models');

class UserController {
  // Obtener todos los usuarios (solo admin)
  static async getAll(req, res) {
    try {
      const users = await User.getAll();
      res.json({
        success: true,
        data: users,
        count: users.length
      });
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener usuario específico
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      // No mostrar información sensible
      const { email, name, role, measurement_count, created_at } = user;
      
      res.json({
        success: true,
        data: { id, email, name, role, measurement_count, created_at }
      });
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener perfil del usuario actual
  static async getProfile(req, res) {
    try {
      const user = await User.findById(req.user.id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Error obteniendo perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener historial de mediciones del usuario
  static async getMeasurementHistory(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar que el usuario existe
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      const measurements = await Measurement.getUserHistory(id);
      
      res.json({
        success: true,
        data: {
          user: { id: user.id, name: user.name, measurement_count: user.measurement_count },
          measurements
        },
        count: measurements.length
      });
    } catch (error) {
      console.error('Error obteniendo historial de mediciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Actualizar perfil del usuario
  static async updateProfile(req, res) {
    try {
      const { name } = req.body;
      
      if (!name || name.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'El nombre es requerido'
        });
      }
      
      const result = await User.updateName(req.user.id, name.trim());
      
      res.json({
        success: true,
        message: 'Perfil actualizado exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando perfil:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Cambiar rol de usuario (solo admin)
  static async updateRole(req, res) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      
      if (!['user', 'validator', 'admin'].includes(role)) {
        return res.status(400).json({
          success: false,
          error: 'Rol debe ser user, validator o admin'
        });
      }
      
      // Verificar que el usuario existe
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      // No permitir cambiar el rol del último admin
      if (user.role === 'admin' && role !== 'admin') {
        const adminCount = await User.getAdminCount();
        if (adminCount <= 1) {
          return res.status(400).json({
            success: false,
            error: 'No se puede cambiar el rol del último administrador'
          });
        }
      }
      
      const result = await User.updateRole(id, role);
      
      res.json({
        success: true,
        message: `Rol de usuario actualizado a ${role}`
      });
    } catch (error) {
      console.error('Error actualizando rol:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener estadísticas del usuario
  static async getUserStats(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar que el usuario existe
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'Usuario no encontrado'
        });
      }
      
      // Obtener estadísticas de mediciones
      const measurements = await Measurement.getUserHistory(id);
      const approvedCount = measurements.filter(m => m.status === 'approved').length;
      const pendingCount = measurements.filter(m => m.status === 'pending').length;
      const rejectedCount = measurements.filter(m => m.status === 'rejected').length;
      
      const stats = {
        total_measurements: user.measurement_count,
        approved_measurements: approvedCount,
        pending_measurements: pendingCount,
        rejected_measurements: rejectedCount,
        approval_rate: user.measurement_count > 0 ? (approvedCount / user.measurement_count * 100).toFixed(1) : 0
      };
      
      res.json({
        success: true,
        data: {
          user: { id: user.id, name: user.name, role: user.role },
          stats
        }
      });
    } catch (error) {
      console.error('Error obteniendo estadísticas del usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = UserController;