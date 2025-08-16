-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    measurement_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ubicaciones/balnearios
CREATE TABLE IF NOT EXISTS locations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  water_pollution_level REAL DEFAULT NULL,
  sand_pollution_level REAL DEFAULT NULL,
  last_measurement_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de mediciones
CREATE TABLE IF NOT EXISTS measurements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    location_id INTEGER NOT NULL,
    ecoli_water REAL,
    enterococci_water REAL,
    ecoli_sand REAL,
    enterococci_sand REAL,
    additional_notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    reviewed_at DATETIME,
    reviewed_by TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (location_id) REFERENCES locations(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id)
);

-- Tabla para imágenes de ubicaciones
CREATE TABLE IF NOT EXISTS location_images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    location_id INTEGER NOT NULL,
    image_path TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (location_id) REFERENCES locations(id)
);

-- Tabla para historial de mediciones del usuario
CREATE TABLE IF NOT EXISTS user_measurement_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    measurement_id INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (measurement_id) REFERENCES measurements(id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_measurements_user_id ON measurements(user_id);
CREATE INDEX IF NOT EXISTS idx_measurements_location_id ON measurements(location_id);
CREATE INDEX IF NOT EXISTS idx_measurements_status ON measurements(status);
CREATE INDEX IF NOT EXISTS idx_locations_coordinates ON locations(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_measurements_ecoli_water ON measurements(ecoli_water);
CREATE INDEX IF NOT EXISTS idx_measurements_enterococci_water ON measurements(enterococci_water);
CREATE INDEX IF NOT EXISTS idx_measurements_ecoli_sand ON measurements(ecoli_sand);
CREATE INDEX IF NOT EXISTS idx_measurements_enterococci_sand ON measurements(enterococci_sand);