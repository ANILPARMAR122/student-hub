const db = require('../config/db');

// 1. Get All Available Items
exports.getAllItems = async (req, res) => {
    try {
        // 🟢 Uses 'item_name', 'pickup_location'
        const [items] = await db.execute('SELECT * FROM recycling WHERE status = "Available" ORDER BY created_at DESC');
        res.json({ success: true, data: items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Donate Item
exports.donateItem = async (req, res) => {
    try {
        // 🟢 Matches your DB columns: item_name, donor_id, pickup_location
        const { userId, title, category, description, location, condition, contact } = req.body;
        
        // Calculate Points
        let points = 10;
        if(category === 'E-Waste') points = 50;
        if(category === 'Books') points = 20;

        const sql = `INSERT INTO recycling (donor_id, item_name, category, description, pickup_location, condition_text, contact_phone, eco_points, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Available')`;
        
        await db.execute(sql, [userId, title, category, description, location, condition, contact, points]);

        res.status(201).json({ success: true, message: `Item listed! You earned ${points} Eco Points 🌱` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};