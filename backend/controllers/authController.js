// backend/controllers/authController.js
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already registered' });
        }

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Generate Avatar (using UI Avatars like you did in frontend)
        const avatar = `https://ui-avatars.com/api/?name=${name.replace(' ', '+')}&background=random&color=fff`;

        // 4. Save to DB
        await User.create(name, email, hashedPassword, role, avatar);

        res.status(201).json({ success: true, message: 'User registered successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find User
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // 2. Check Password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        }

        // 3. Success (Send user data back, exclude password)
        const userData = {
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role,
            avatar: user.avatar
        };

        res.json({ success: true, user: userData });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};