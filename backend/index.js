require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Importar configuración de base de datos
const database = require('./src/config/database');

// Importar rutas
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const locationRoutes = require('./src/routes/locationRoutes');
const measurementRoutes = require('./src/routes/measurementRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Conectar a la base de datos
database.connect()
  .then(() => {
    console.log('Base de datos conectada correctamente');
  })
  .catch((error) => {
    console.error('Error conectando a la base de datos:', error);
    process.exit(1);
  });

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/measurements', measurementRoutes);

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    message: 'Backend funcionando correctamente',
    database: 'Conectado'
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    success: false,
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
  });
});


// Inicializar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  console.log(`API disponible en http://localhost:${PORT}/api`);
});

// Manejo de señales de terminación
process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    await database.close();
    process.exit(0);
  });
  
  process.on('SIGINT', async () => {
    console.log('SIGINT recibido, cerrando servidor...');
    await database.close();
    process.exit(0);
  });