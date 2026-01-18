const db = require('../config/db');

// 1. Get List of Seniors (Users)
exports.getContacts = async (req, res) => {
    try {
        const { currentUserId } = req.query;
        // Fetch all users except self
        const [users] = await db.execute('SELECT id, name, email FROM users WHERE id != ?', [currentUserId]);
        res.json({ success: true, data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Get Messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { userId1, userId2 } = req.query;
        
        const [messages] = await db.execute(
            `SELECT m.*, u.name as sender_name 
             FROM messages m 
             JOIN users u ON m.sender_id = u.id 
             WHERE (m.sender_id = ? AND m.receiver_id = ?) 
                OR (m.sender_id = ? AND m.receiver_id = ?) 
             ORDER BY m.created_at ASC`,
            [userId1, userId2, userId2, userId1]
        );

        // 🔒 PRIVACY LOGIC: If anonymous, mask the name
        const processedMessages = messages.map(msg => {
            if (msg.is_anonymous === 1 && msg.sender_id != userId1) {
                msg.sender_name = "Anonymous Student 🕵️"; // Hide Name
            }
            return msg;
        });

        res.json({ success: true, data: processedMessages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 3. Send Message
exports.sendMessage = async (req, res) => {
    try {
        const { senderId, receiverId, message, isAnonymous } = req.body;
        
        await db.execute(
            `INSERT INTO messages (sender_id, receiver_id, message, is_anonymous) VALUES (?, ?, ?, ?)`,
            [senderId, receiverId, message, isAnonymous ? 1 : 0]
        );

        res.json({ success: true, message: "Sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 4. Report Message
exports.reportMessage = async (req, res) => {
    try {
        const { reporterId, messageId, reason } = req.body;
        
        await db.execute(
            `INSERT INTO reports (reporter_id, message_id, reason) VALUES (?, ?, ?)`,
            [reporterId, messageId, reason]
        );

        res.json({ success: true, message: "Message reported to admin." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};