const db = require('../config/db');

exports.getAllEvents = async (req, res) => {
    try {
        // 🟢 Uses 'event_date' column
        const [events] = await db.execute('SELECT * FROM events ORDER BY event_date ASC');
        res.json({ success: true, data: events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

exports.createEvent = async (req, res) => {
    try {
        // 🟢 Uses 'event_date', 'type', 'registration_link'
        const { title, organizer, event_date, location, type, description, registration_link } = req.body;
        
        const sql = `INSERT INTO events (title, organizer, event_date, location, type, description, registration_link) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        await db.execute(sql, [title, organizer, event_date, location, type, description, registration_link]);

        res.status(201).json({ success: true, message: "Event Created Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};