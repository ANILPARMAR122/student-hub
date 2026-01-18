const db = require('../config/db');

class Job {
    static async getAll() {
        const sql = 'SELECT * FROM jobs ORDER BY created_at DESC';
        const [rows] = await db.execute(sql);
        return rows;
    }

    // 🟢 NEW: Save to DB
    static async create(job) {
        const sql = `
            INSERT INTO jobs (title, company, type, location, stipend, description, skills) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        return db.execute(sql, [
            job.title, 
            job.company, 
            job.type, 
            job.location, 
            job.stipend || 'Unpaid', 
            job.description, 
            job.skills || ''
        ]);
    }
}
module.exports = Job;