const db = require('../config/db');

// 1. Apply for a Job
exports.applyForJob = async (req, res) => {
    try {
        const { jobId, userId, name, email, phone, age } = req.body;

        if(!jobId || !userId || !name) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if already applied
        const [existing] = await db.execute('SELECT * FROM applications WHERE job_id = ? AND user_id = ?', [jobId, userId]);
        if(existing.length > 0) {
            return res.status(400).json({ success: false, message: "You have already applied for this job!" });
        }

        const sql = `INSERT INTO applications (job_id, user_id, name, email, phone, age) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.execute(sql, [jobId, userId, name, email, phone, age]);

        res.status(201).json({ success: true, message: "Application Submitted Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Get My Applications (For the Student)
exports.getMyApplications = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Join with JOBS table to get the Job Title and Company Name
        const sql = `
            SELECT apps.*, jobs.title as job_title, jobs.company 
            FROM applications apps
            JOIN jobs ON apps.job_id = jobs.id
            WHERE apps.user_id = ?
            ORDER BY apps.applied_at DESC
        `;
        
        const [rows] = await db.execute(sql, [userId]);
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ... existing code ...

// 🟢 3. Cancel Application (Delete from DB)
exports.cancelApplication = async (req, res) => {
    try {
        const appId = req.params.id;
        
        // Execute Delete
        await db.execute('DELETE FROM applications WHERE id = ?', [appId]);
        
        res.json({ success: true, message: "Application withdrawn successfully." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};