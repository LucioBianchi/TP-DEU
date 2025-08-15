const express = require('express');
const LocationController = require('../controllers/LocationController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Rutas públicas
router.get('/', LocationController.getAll);
router.get('/nearby', LocationController.getNearby);
router.get('/:id', LocationController.getById);
router.get('/:id/measurements', LocationController.getMeasurements);

// Rutas que requieren autenticación y rol admin
router.post('/', authenticateToken, requireRole(['admin']), LocationController.create);
router.put('/:id', authenticateToken, requireRole(['admin']), LocationController.update);

module.exports = router;