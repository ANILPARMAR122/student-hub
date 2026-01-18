const Job = require('../models/jobModel');

exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.getAll();
        res.json({ success: true, data: jobs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// 🟢 NEW: Add this function to SAVE jobs
exports.createJob = async (req, res) => {
    try {
        const { title, company, type, location, stipend, description, skills } = req.body;

        // Basic Validation
        if(!title || !company || !location) {
            return res.status(400).json({ success: false, message: "Please fill all required fields." });
        }

        // Save to DB
        await Job.create({ title, company, type, location, stipend, description, skills });

        res.status(201).json({ success: true, message: "Job Posted Successfully!" });
    } catch (error) {
        console.error("Post Job Error:", error);
        res.status(500).json({ success: false, message: "Failed to post job." });
    }
};