// backend/models/userModel.js
const db = require('../config/db');

class User {
    static async create(fullName, email, password, role, avatar) {
        const sql = 'INSERT INTO users (full_name, email, password, role, avatar) VALUES (?, ?, ?, ?, ?)';
        return db.execute(sql, [fullName, email, password, role, avatar]);
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }
}

module.exports = User;