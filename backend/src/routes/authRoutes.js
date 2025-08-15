const express = require('express');
const AuthController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/google - Login con Google
router.post('/google', AuthController.googleLogin);

// GET /api/auth/me - Obtener usuario actual (requiere autenticación)
router.get('/me', authenticateToken, AuthController.getCurrentUser);

module.exports = router;