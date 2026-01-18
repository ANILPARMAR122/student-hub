const db = require('../config/db');

class Marketplace {
    static async getAll() {
        const sql = 'SELECT * FROM marketplace ORDER BY created_at DESC';
        const [rows] = await db.execute(sql);
        return rows;
    }
}
module.exports = Marketplace;