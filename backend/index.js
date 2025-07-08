require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const { OAuth2Client } = require('google-auth-library');

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

app.use(cors());
app.use(express.json());

// DB setup
const db = new sqlite3.Database('./users.db');
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT
  )`);
});

// Google Auth
const googleClient = new OAuth2Client(CLIENT_ID);

// Middleware para verificar JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Endpoint de login con Google
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Token requerido' });
  let ticket, payload;
  try {
    ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,
    });
    payload = ticket.getPayload();
  } catch (err) {
    return res.status(401).json({ error: 'Token de Google inválido' });
  }
  // Guardar usuario en la base si no existe
  db.run(
    `INSERT OR IGNORE INTO users (id, email, name) VALUES (?, ?, ?)`,
    [payload.sub, payload.email, payload.name || ''],
    err => {
      if (err) return res.status(500).json({ error: 'DB error' });
      // Crear JWT propio
      const user = { id: payload.sub, email: payload.email, name: payload.name };
      const ourToken = jwt.sign(user, JWT_SECRET, { expiresIn: '1d' });
      res.json({ token: ourToken, user });
    }
  );
});

// Endpoint para obtener usuario actual
app.get('/api/me', authenticateToken, (req, res) => {
  db.get('SELECT id, email, name FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err || !row) return res.sendStatus(404);
    res.json(row);
  });
});

app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
}); 