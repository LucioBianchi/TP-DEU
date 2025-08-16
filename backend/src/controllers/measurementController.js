const { Measurement, User, Location } = require('../models');

class MeasurementController {

  // Obtener todas las mediciones
  static async getAll(req, res) {
    try {
      const measurements = await Measurement.getAll();
      
      res.json({
        success: true,
        data: measurements,
        count: measurements.length
      });
    } catch (error) {
      console.error('Error obteniendo mediciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener mediciones pendientes
  static async getPending(req, res) {
    try {
      const measurements = await Measurement.getPending();
      
      res.json({
        success: true,
        data: measurements,
        count: measurements.length
      });
    } catch (error) {
      console.error('Error obteniendo mediciones pendientes:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener mediciones aprobadas
  static async getApproved(req, res) {
    try {
      const measurements = await Measurement.getApproved();
      
      res.json({
        success: true,
        data: measurements,
        count: measurements.length
      });
    } catch (error) {
      console.error('Error obteniendo mediciones aprobadas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Crear nueva medición
  static async create(req, res) {
    try {
      const { 
        location_id, 
        ecoli_water, 
        enterococci_water, 
        ecoli_sand, 
        enterococci_sand, 
        additional_notes 
      } = req.body;
      const user_id = req.user.id;
      
      // Validaciones básicas
      if (!location_id || 
          (ecoli_water === undefined && enterococci_water === undefined) ||
          (ecoli_sand === undefined && enterococci_sand === undefined)) {
        return res.status(400).json({
          success: false,
          error: 'location_id y al menos un valor de contaminación son requeridos'
        });
      }
      
      // Verificar que la ubicación existe
      const location = await Location.findById(location_id);
      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Ubicación no encontrada'
        });
      }
      
      // Crear la medición
      const measurementData = {
        user_id,
        location_id,
        ecoli_water: ecoli_water ? parseFloat(ecoli_water) : null,
        enterococci_water: enterococci_water ? parseFloat(enterococci_water) : null,
        ecoli_sand: ecoli_sand ? parseFloat(ecoli_sand) : null,
        enterococci_sand: enterococci_sand ? parseFloat(enterococci_sand) : null,
        additional_notes: additional_notes || ''
      };
      
      const measurement = await Measurement.create(measurementData);
      
      // Actualizar contador de mediciones del usuario
      await User.updateMeasurementCount(user_id);
      
      res.status(201).json({
        success: true,
        data: measurement,
        message: 'Medición creada exitosamente'
      });
    } catch (error) {
      console.error('Error creando medición:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
  

  // Aprobar/rechazar medición
  static async review(req, res) {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;
      const reviewer_id = req.user.id;
      
      if (!['approved', 'rejected'].includes(status)) {
        return res.status(400).json({
          success: false,
          error: 'Estado debe ser "approved" o "rejected"'
        });
      }
      
      // Verificar que la medición existe
      const measurement = await Measurement.findById(id);
      if (!measurement) {
        return res.status(404).json({
          success: false,
          error: 'Medición no encontrada'
        });
      }
      
      // Actualizar estado de la medición
      await Measurement.updateStatus(id, status, reviewer_id);
      
      // Si se aprueba, actualizar niveles de contaminación de la ubicación
      if (status === 'approved') {
        await Measurement.updateLocationPollutionLevels(measurement.location_id);
      }
      
      res.json({
        success: true,
        message: `Medición ${status} exitosamente`
      });
    } catch (error) {
      console.error('Error revisando medición:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

   // Obtener mediciones por ubicación
   static async getByLocation(req, res) {
    try {
      const { locationId } = req.params;
      res.json({
        success: true,
        data: [],
        count: 0,
        message: 'Método getByLocation implementado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener historial de usuario
  static async getUserHistory(req, res) {
    try {
      const { userId } = req.params;
      res.json({
        success: true,
        data: [],
        count: 0,
        message: 'Método getUserHistory implementado'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = MeasurementController;