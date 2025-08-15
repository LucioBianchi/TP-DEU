const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/auth');

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>
  
  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Token de acceso requerido' 
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Token inválido o expirado' 
      });
    }
    
    // Agregar información del usuario al request
    req.user = user;
    next();
  });
};

// Middleware para verificar roles específicos
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    // Primero verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Usuario no autenticado' 
      });
    }
    
    // Verificar si el usuario tiene uno de los roles permitidos
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false,
        error: 'Acceso denegado. Rol insuficiente' 
      });
    }
    
    next();
  };
};

// Middleware para verificar que el usuario es dueño del recurso o admin
const requireOwnershipOrAdmin = (resourceUserIdField = 'user_id') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false,
        error: 'Usuario no autenticado' 
      });
    }
    
    // Si es admin, puede acceder a todo
    if (req.user.role === 'admin') {
      return next();
    }
    
    // Si no es admin, verificar que sea dueño del recurso
    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({ 
        success: false,
        error: 'Acceso denegado. Solo puedes acceder a tus propios recursos' 
      });
    }
    
    next();
  };
};

module.exports = {
  authenticateToken,
  requireRole,
  requireOwnershipOrAdmin
};