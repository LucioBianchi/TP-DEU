const { Location, Measurement } = require('../models');

class LocationController {
  // Obtener todas las ubicaciones
  static async getAll(req, res) {
    try {
      const locations = await Location.getAll();
      res.json({
        success: true,
        data: locations,
        count: locations.length
      });
    } catch (error) {
      console.error('Error obteniendo ubicaciones:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener ubicación específica
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const location = await Location.findById(id);
      
      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Ubicación no encontrada'
        });
      }
      
      res.json({
        success: true,
        data: location
      });
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Obtener mediciones de una ubicación específica
  static async getMeasurements(req, res) {
    try {
      const { id } = req.params;
      const { status = 'approved' } = req.query;
      
      // Verificar que la ubicación existe
      const location = await Location.findById(id);
      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Ubicación no encontrada'
        });
      }
      
      let measurements;
      if (status === 'all') {
        // Obtener todas las mediciones de la ubicación
        measurements = await Measurement.getByLocation(id);
      } else {
        // Obtener solo mediciones con estado específico
        measurements = await Measurement.getByLocationAndStatus(id, status);
      }
      
      res.json({
        success: true,
        data: {
          location,
          measurements
        },
        count: measurements.length
      });
    } catch (error) {
      console.error('Error obteniendo mediciones de ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Buscar ubicaciones cercanas
  static async getNearby(req, res) {
    try {
      const { lat, lng, radius = 0.01 } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({
          success: false,
          error: 'Latitud y longitud son requeridas'
        });
      }
      
      const locations = await Location.getNearby(parseFloat(lat), parseFloat(lng), parseFloat(radius));
      
      res.json({
        success: true,
        data: locations,
        count: locations.length
      });
    } catch (error) {
      console.error('Error buscando ubicaciones cercanas:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Crear nueva ubicación (solo admin)
  static async create(req, res) {
    try {
      const { name, latitude, longitude, description } = req.body;
      
      // Validaciones básicas
      if (!name || latitude === undefined || longitude === undefined) {
        return res.status(400).json({
          success: false,
          error: 'name, latitude y longitude son requeridos'
        });
      }
      
      // Verificar que no exista una ubicación en las mismas coordenadas
      const existingLocation = await Location.findByCoordinates(latitude, longitude);
      if (existingLocation) {
        return res.status(409).json({
          success: false,
          error: 'Ya existe una ubicación en esas coordenadas'
        });
      }
      
      const locationData = {
        name,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        description: description || ''
      };
      
      const location = await Location.create(locationData);
      
      res.status(201).json({
        success: true,
        data: location,
        message: 'Ubicación creada exitosamente'
      });
    } catch (error) {
      console.error('Error creando ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }

  // Actualizar ubicación (solo admin)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
      
      // Verificar que la ubicación existe
      const location = await Location.findById(id);
      if (!location) {
        return res.status(404).json({
          success: false,
          error: 'Ubicación no encontrada'
        });
      }
      
      // Actualizar solo los campos permitidos
      const updateData = {};
      if (name !== undefined) updateData.name = name;
      if (description !== undefined) updateData.description = description;
      
      if (Object.keys(updateData).length === 0) {
        return res.status(400).json({
          success: false,
          error: 'No hay campos para actualizar'
        });
      }
      
      const result = await Location.update(id, updateData);
      
      res.json({
        success: true,
        message: 'Ubicación actualizada exitosamente'
      });
    } catch (error) {
      console.error('Error actualizando ubicación:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  }
}

module.exports = LocationController;