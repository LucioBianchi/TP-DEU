const database = require('../src/config/database');
const { Location } = require('../src/models');
const fs = require('fs');
const path = require('path');

async function initDatabase() {
  try {
    // Conectar a la base de datos
    await database.connect();
    
    // Leer el esquema
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Inicializando base de datos...');
    
    // Ejecutar el esquema usando exec (no run)
    await database.exec(schema);
    console.log('Esquema ejecutado correctamente');
    
    // Insertar solo ubicaciones de ejemplo (SIN niveles de contaminación)
    await insertDefaultLocations();
    
    console.log('Base de datos inicializada correctamente!');
    console.log('Los niveles de contaminación se calcularan dinamicamente basandose en las mediciones');
    
  } catch (error) {
    console.error('Error inicializando base de datos:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
}

async function insertDefaultLocations() {
  console.log('Insertando ubicaciones por defecto...');
  
  // Ubicaciones precargadas por defecto (SIN niveles de contaminación fijos)
  const defaultLocations = [
    {
      name: 'Punta Lara',
      latitude: -34.8167,
      longitude: -57.9833,
      description: 'Balneario histórico de La Plata, playa de arena fina y aguas tranquilas. Ideal para familias y deportes acuáticos.'
    },
    {
      name: 'Balneario Municipal de La Plata',
      latitude: -34.8200,
      longitude: -57.9800,
      description: 'Balneario oficial de la ciudad, con servicios completos, guardavidas y estacionamiento.'
    },
    {
      name: 'Balneario El Rincón',
      latitude: -34.8150,
      longitude: -57.9850,
      description: 'Balneario privado con restaurante, sombrillas y actividades recreativas.'
    },
    {
      name: 'Playa de Berisso',
      latitude: -34.8500,
      longitude: -57.9000,
      description: 'Playa popular de Berisso, cercana a La Plata, con ambiente familiar y tranquilo.'
    },
    {
      name: 'Balneario San Fernando',
      latitude: -34.4500,
      longitude: -58.5500,
      description: 'Balneario histórico del norte del GBA, con amplias playas y servicios completos.'
    },
    {
      name: 'Playa Vicente López',
      latitude: -34.5333,
      longitude: -58.4667,
      description: 'Playa urbana del norte, fácil acceso en transporte público, ideal para visitas cortas.'
    },
    {
      name: 'Balneario Quilmes',
      latitude: -34.7167,
      longitude: -58.2667,
      description: 'Balneario del sur del GBA, con vista al Río de la Plata y ambiente histórico.'
    },
    {
      name: 'Balneario Tigre',
      latitude: -34.4267,
      longitude: -58.5767,
      description: 'Balneario en zona de delta, ambiente natural, ideal para deportes acuáticos.'
    },
    {
      name: 'Playa de Ensenada',
      latitude: -34.8700,
      longitude: -57.9200,
      description: 'Playa cercana a La Plata, ambiente tranquilo y familiar, menos concurrida.'
    },
    {
      name: 'Balneario Magdalena',
      latitude: -35.0833,
      longitude: -57.5167,
      description: 'Balneario de la costa atlántica bonaerense, aguas más limpias y ambiente natural.'
    }
  ];

  for (const locationData of defaultLocations) {
    try {
      // Crear ubicación SIN especificar niveles de contaminación
      // Los campos water_pollution_level y sand_pollution_level se mantienen como NULL
      // hasta que se aprueben las primeras mediciones
      await Location.create(locationData);
      console.log('Ubicación creada:', locationData.name);
    } catch (error) {
      console.log('Ubicación', locationData.name, 'ya existe o error:', error.message);
    }
  }
  
  console.log(`${defaultLocations.length} ubicaciones procesadas`);
  
  // Verificar que las ubicaciones se crearon
  try {
    const locationCount = await database.queryOne('SELECT COUNT(*) as count FROM locations');
    console.log('Total ubicaciones en la base:', locationCount.count);
    
    // Verificar que los niveles de contaminación están NULL (como debe ser)
    const nullLevelsCount = await database.queryOne(`
      SELECT COUNT(*) as count 
      FROM locations 
      WHERE water_pollution_level IS NULL AND sand_pollution_level IS NULL
    `);
    console.log('Ubicaciones sin niveles de contaminación (correcto):', nullLevelsCount.count);
    
  } catch (error) {
    console.log('Error verificando ubicaciones:', error.message);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  initDatabase();
}

module.exports = { initDatabase };