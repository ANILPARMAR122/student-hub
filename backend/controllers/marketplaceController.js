const db = require('../config/db');

// 1. Get All Products
exports.getAllProducts = async (req, res) => {
    try {
        const [products] = await db.execute('SELECT * FROM products ORDER BY created_at DESC');
        res.json({ success: true, data: products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// 2. Add New Product (With Image)
exports.addProduct = async (req, res) => {
    try {
        const { title, price, category, description, phone, userId } = req.body;
        
        // 📸 Get the Image Filename (if uploaded)
        const image_url = req.file ? req.file.filename : null;

        if (!title || !price || !phone) {
            return res.status(400).json({ success: false, message: "Title, Price, and Contact are required." });
        }

        const sql = `
            INSERT INTO products (user_id, title, price, category, description, image_url, contact_phone)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        
        await db.execute(sql, [userId, title, price, category, description, image_url, phone]);

        res.status(201).json({ success: true, message: "Product Listed Successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};