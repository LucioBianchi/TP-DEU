require('dotenv').config();

console.log('=== DEBUG ENV VARIABLES ===');
console.log('process.env.JWT_SECRET:', process.env.JWT_SECRET ? 'SÍ está definida' : 'NO está definida');
console.log('process.env.GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID ? 'SÍ está definido' : 'NO está definido');
console.log('process.env.NODE_ENV:', process.env.NODE_ENV);
console.log('==========================');

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

module.exports = {
    JWT_SECRET,
    GOOGLE_CLIENT_ID
  };