const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const { User } = require('../models');
const { JWT_SECRET, GOOGLE_CLIENT_ID } = require('../config/auth');

// Cliente de Google OAuth
const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthController {
  // Login con Google
  static async googleLogin(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ 
          success: false,
          error: 'Token de Google requerido' 
        });
      }

      // Verificar token de Google
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      
      // Buscar o crear usuario en la base
      let user = await User.findByEmail(payload.email);
      
      if (!user) {
        // Crear nuevo usuario
        const userData = {
          id: payload.sub,
          email: payload.email,
          name: payload.name || '',
          measurement_count: 0
        };
        
        user = await User.create(userData);
      }
      
      // Crear JWT propio
      const jwtPayload = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      };
      
      const ourToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '7d' });
      
      res.json({
        success: true,
        token: ourToken,
        user: jwtPayload,
        message: 'Login exitoso'
      });
      
    } catch (error) {
      console.error('Error en login de Google:', error);
      res.status(401).json({ 
        success: false,
        error: 'Token de Google inválido' 
      });
    }
  }

  // Obtener usuario actual
  static async getCurrentUser(req, res) {
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
      console.error('Error obteniendo usuario:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error interno del servidor' 
      });
    }
  }
}

module.exports = AuthController;