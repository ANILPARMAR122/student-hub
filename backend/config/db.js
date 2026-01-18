const mysql = require('mysql2');
require('dotenv').config();

// 🟢 Helper to clean hidden spaces
const clean = (str) => str ? str.trim() : '';

const pool = mysql.createPool({
    host: clean(process.env.DB_HOST),
    user: clean(process.env.DB_USER),
    password: clean(process.env.DB_PASSWORD),
    database: clean(process.env.DB_NAME),
    port: clean(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: { rejectUnauthorized: false }
});

module.exports = pool.promise();