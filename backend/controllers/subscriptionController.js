const db = require('../config/db');

// 1. Get All Groups
exports.getAllGroups = async (req, res) => {
    try {
        const [groups] = await db.execute('SELECT * FROM subscriptions WHERE current_slots < max_slots ORDER BY created_at DESC');
        res.json({ success: true, data: groups });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Create Group
exports.createGroup = async (req, res) => {
    try {
        const { userId, name, cost, cycle, slots, description } = req.body;
        
        const [result] = await db.execute(
            `INSERT INTO subscriptions (owner_id, name, cost, cycle, max_slots, current_slots, description) VALUES (?, ?, ?, ?, ?, 1, ?)`,
            [userId, name, cost, cycle, slots, description]
        );

        // Add owner as first member
        await db.execute(`INSERT INTO subscription_members (subscription_id, user_id) VALUES (?, ?)`, [result.insertId, userId]);

        res.status(201).json({ success: true, message: "Group Created Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 3. Join Group
exports.joinGroup = async (req, res) => {
    try {
        const { groupId, userId } = req.body;

        const [existing] = await db.execute('SELECT * FROM subscription_members WHERE subscription_id = ? AND user_id = ?', [groupId, userId]);
        if(existing.length > 0) return res.json({ success: false, message: "Already joined!" });

        await db.execute(`INSERT INTO subscription_members (subscription_id, user_id) VALUES (?, ?)`, [groupId, userId]);
        await db.execute(`UPDATE subscriptions SET current_slots = current_slots + 1 WHERE id = ?`, [groupId]);

        res.json({ success: true, message: "Joined Group Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};