const { database, Location } = require('../src/models');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    // Conectar a la base de datos
    await database.connect();
    
    // Leer y ejecutar el esquema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Inicializando base de datos...');
    
    // Ejecutar el esquema (crear tablas)
    await database.run(schema);
    console.log('Esquema ejecutado correctamente');
    
    // Insertar solo ubicaciones de ejemplo
    await insertDefaultLocations();
    
    console.log('Base de datos inicializada correctamente!');
    
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  } finally {
    database.close();
  }
}

async function insertDefaultLocations() {
  console.log('Insertando ubicaciones por defecto...');
  
  // Ubicaciones precargadas por defecto
  const defaultLocations = [
    {
      name: 'Balneario Municipal',
      latitude: -34.6037,
      longitude: -58.3816,
      description: 'Balneario principal de la ciudad con amplias playas y servicios completos'
    },
    {
      name: 'Playa San Fernando',
      latitude: -34.4500,
      longitude: -58.5500,
      description: 'Playa popular para familias, aguas tranquilas y arena fina'
    },
    {
      name: 'Balneario Quilmes',
      latitude: -34.7167,
      longitude: -58.2667,
      description: 'Balneario histórico con vista al Río de la Plata, ideal para deportes acuáticos'
    },
    {
      name: 'Playa Vicente López',
      latitude: -34.5333,
      longitude: -58.4667,
      description: 'Playa urbana con acceso fácil, perfecta para visitas cortas'
    },
    {
      name: 'Balneario Tigre',
      latitude: -34.4267,
      longitude: -58.5767,
      description: 'Balneario en zona de delta, ambiente natural y tranquilo'
    }
  ];

  for (const locationData of defaultLocations) {
    try {
      await Location.create(locationData);
      console.log(`Ubicación creada: ${locationData.name}`);
    } catch (error) {
      console.log(`Ubicación ${locationData.name} ya existe o error:`, error.message);
    }
  }
  
  console.log(`${defaultLocations.length} ubicaciones procesadas`);
  
  // Verificar que las ubicaciones se crearon
  try {
    const locationCount = await database.queryOne('SELECT COUNT(*) as count FROM locations');
    console.log(`Total ubicaciones en la base: ${locationCount.count}`);
  } catch (error) {
    console.log('Error verificando ubicaciones:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };