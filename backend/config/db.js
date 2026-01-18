const mysql = require('mysql2');
require('dotenv').config();

// 🟢 NEW APPROACH: Reconstruct the URL manually to strip invisible characters
// We take the parts, clean them, and build a single strong connection string.
const host = (process.env.DB_HOST || '').trim();
const user = (process.env.DB_USER || '').trim();
const pass = (process.env.DB_PASSWORD || '').trim();
const port = (process.env.DB_PORT || '28878').trim();
const name = (process.env.DB_NAME || 'defaultdb').trim();

console.log(`🔌 Connecting to Host: ${host} on Port: ${port}`);

const pool = mysql.createPool({
    host: host,
    user: user,
    password: pass,
    database: name,
    port: port,
    ssl: { rejectUnauthorized: false },
    waitForConnections: true,
    connectionLimit: 5
});

module.exports = pool.promise();