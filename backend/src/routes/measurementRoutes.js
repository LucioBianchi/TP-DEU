const express = require('express');
const MeasurementController = require('../controllers/measurementController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// GET /api/measurements - Obtener TODAS las mediciones
router.get('/', MeasurementController.getAll);

// GET /api/measurements/pending - Obtener mediciones pendientes
router.get('/pending', authenticateToken, requireRole(['validator', 'admin']), MeasurementController.getPending);

// GET /api/measurements/pending-others - Obtener mediciones pendientes de otros usuarios
router.get('/pending-others', authenticateToken, requireRole(['validator', 'admin']), MeasurementController.getPendingMeasurementsFromOthers);

// GET /api/measurements/approved - Obtener mediciones aprobadas
router.get('/approved', MeasurementController.getApproved);

// GET /api/measurements/location/:locationId - Obtener mediciones de una ubicación
router.get('/location/:locationId', MeasurementController.getByLocation);

// GET /api/measurements/user/:userId - Obtener historial de un usuario
router.get('/user/:userId', authenticateToken, MeasurementController.getUserHistory);

// POST /api/measurements - Crear nueva medición
router.post('/', authenticateToken, MeasurementController.create);

// PUT /api/measurements/:id/review - Aprobar/rechazar medición
router.put('/:id/review', authenticateToken, requireRole(['validator', 'admin']), MeasurementController.review);

module.exports = router;