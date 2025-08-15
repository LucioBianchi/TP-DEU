const express = require('express');
const UserController = require('../controllers/UserController');
const { authenticateToken, requireRole, requireOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Rutas que requieren autenticación
router.get('/profile', authenticateToken, UserController.getProfile);
router.put('/profile', authenticateToken, UserController.updateProfile);
router.get('/:id/history', authenticateToken, requireOwnershipOrAdmin('id'), UserController.getMeasurementHistory);
router.get('/:id/stats', authenticateToken, requireOwnershipOrAdmin('id'), UserController.getUserStats);

// Rutas que requieren rol admin
router.get('/', authenticateToken, requireRole(['admin']), UserController.getAll);
router.get('/:id', authenticateToken, requireRole(['admin']), UserController.getById);
router.put('/:id/role', authenticateToken, requireRole(['admin']), UserController.updateRole);

module.exports = router;