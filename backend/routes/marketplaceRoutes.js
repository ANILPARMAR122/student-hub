const express = require('express');
const router = express.Router();
const marketplaceController = require('../controllers/marketplaceController');
const multer = require('multer');
const path = require('path');

// 🛠️ CONFIGURING IMAGE STORAGE
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save images in 'uploads' folder
    },
    filename: (req, file, cb) => {
        // Rename file to: timestamp-filename.jpg (Unique Name)
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// --- ROUTES ---
router.get('/', marketplaceController.getAllProducts);

// 🟢 The 'upload.single' middleware handles the image upload magic
router.post('/add', upload.single('image'), marketplaceController.addProduct);

module.exports = router;