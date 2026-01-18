const db = require('../config/db');

// 1. Get All Open Projects
exports.getAllProjects = async (req, res) => {
    try {
        const [projects] = await db.execute('SELECT * FROM projects WHERE status = "Open" ORDER BY created_at DESC');
        res.json({ success: true, data: projects });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Create New Project
exports.createProject = async (req, res) => {
    try {
        const { userId, title, description, tech_stack, team_size } = req.body;
        const sql = `INSERT INTO projects (user_id, title, description, tech_stack, team_size) VALUES (?, ?, ?, ?, ?)`;
        await db.execute(sql, [userId, title, description, tech_stack, team_size]);
        res.status(201).json({ success: true, message: "Project Posted!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 🟢 3. Join Request (UPDATED TO SAVE CLASS INFO)
exports.joinProject = async (req, res) => {
    try {
        // 🟢 We now extract 'message' from the request body
        const { projectId, userId, message } = req.body;
        
        // Check if already applied
        const [existing] = await db.execute('SELECT * FROM project_requests WHERE project_id = ? AND user_id = ?', [projectId, userId]);
        if(existing.length > 0) {
            return res.json({ success: false, message: "Request already sent!" });
        }

        // 🟢 Insert with 'message' column
        await db.execute('INSERT INTO project_requests (project_id, user_id, message) VALUES (?, ?, ?)', [projectId, userId, message]);
        
        res.json({ success: true, message: "Request Sent!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 🟢 4. Get My Projects
exports.getMyProjects = async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Projects I Lead
        const [ledProjects] = await db.execute('SELECT *, "Leader" as role, "Active" as request_status FROM projects WHERE user_id = ?', [userId]);

        // 2. Projects I Joined
        const sql = `
            SELECT p.*, r.status as request_status, "Member" as role 
            FROM projects p 
            JOIN project_requests r ON p.id = r.project_id 
            WHERE r.user_id = ?`;
        const [joinedProjects] = await db.execute(sql, [userId]);

        res.json({ success: true, data: [...ledProjects, ...joinedProjects] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// ... existing code ...

// 🟢 5. Edit Project Details
exports.updateProject = async (req, res) => {
    try {
        const { projectId, title, description, tech_stack, status } = req.body;
        
        // Update query
        const sql = `UPDATE projects SET title=?, description=?, tech_stack=?, status=? WHERE id=?`;
        await db.execute(sql, [title, description, tech_stack, status, projectId]);

        res.json({ success: true, message: "Project Updated Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// ... existing code ...

// 🟢 6. Leave Project (Resign)
exports.leaveProject = async (req, res) => {
    try {
        const { projectId, userId } = req.body;

        // Delete the entry from project_requests
        const sql = `DELETE FROM project_requests WHERE project_id = ? AND user_id = ?`;
        await db.execute(sql, [projectId, userId]);

        res.json({ success: true, message: "You have left the team." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};