/**
 * backend/server.js
 * 🟢 UPDATED: Includes Database Setup Route (Safe Version)
 */
const express = require('express');
const cors = require('cors'); 
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

// 🟢 Import Database Connection
const db = require('./config/db'); 

const app = express();

// 🟢 Enable CORS for Vercel/Frontend
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(bodyParser.json());

// 🟢 1. SERVE IMAGES (Public Uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- EXISTING ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/recycling', require('./routes/recyclingRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Try/Catch for Marketplace to prevent crashing if file missing
try { 
    app.use('/api/marketplace', require('./routes/marketplaceRoutes')); 
} catch(e) { console.log("Marketplace route skipped"); }


// ========================================================
// 🟢 THE "MAGIC" SETUP ROUTE (Safe Version)
// ========================================================
app.get('/setup-db', async (req, res) => {
    try {
        console.log("🛠️ Starting Database Setup via Server...");
        
        const tableQueries = [
            `CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                role ENUM('Junior', 'Senior', 'Alumni') DEFAULT 'Junior',
                avatar VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS jobs (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                type VARCHAR(50),
                location VARCHAR(255),
                stipend VARCHAR(100),
                description TEXT,
                skills VARCHAR(255),
                posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS projects (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                tech_stack VARCHAR(255),
                team_size INT,
                current_members INT DEFAULT 1,
                status VARCHAR(50) DEFAULT 'Open',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
             `CREATE TABLE IF NOT EXISTS applications (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                job_id INT,
                name VARCHAR(255),
                email VARCHAR(255),
                age INT,
                phone VARCHAR(20),
                status VARCHAR(50) DEFAULT 'Applied',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS events (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                organizer VARCHAR(255),
                event_date DATE,
                location VARCHAR(255),
                type VARCHAR(50),
                description TEXT,
                registration_link VARCHAR(255)
            )`,
            `CREATE TABLE IF NOT EXISTS recycling (
                id INT AUTO_INCREMENT PRIMARY KEY,
                donor_id INT,
                item_name VARCHAR(255),
                category VARCHAR(100),
                description TEXT,
                pickup_location VARCHAR(255),
                condition_text VARCHAR(100),
                contact_phone VARCHAR(20),
                eco_points INT DEFAULT 0,
                status VARCHAR(50) DEFAULT 'Available'
            )`,
             `CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                title VARCHAR(255) NOT NULL,
                price DECIMAL(10,2),
                category VARCHAR(100),
                description TEXT,
                contact_phone VARCHAR(20),
                image_url VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS subscriptions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                owner_id INT,
                name VARCHAR(255),
                cost INT,
                cycle VARCHAR(50),
                max_slots INT,
                current_slots INT DEFAULT 1,
                description TEXT
            )`,
            `CREATE TABLE IF NOT EXISTS messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                sender_id INT NOT NULL,
                receiver_id INT NOT NULL,
                message TEXT NOT NULL,
                is_anonymous TINYINT(1) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS reports (
                id INT AUTO_INCREMENT PRIMARY KEY,
                reporter_id INT NOT NULL,
                message_id INT NOT NULL,
                reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        for (const query of tableQueries) {
            await db.execute(query);
        }

        res.send(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ SUCCESS: All Tables Created!</h1>
                <p>The Database is now ready.</p>
            </div>
        `);
    } catch (error) {
        console.error(error);
        res.status(500).send(`<h1>❌ Database Error</h1><p>${error.message}</p>`);
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});