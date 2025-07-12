const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// Import the Upload model
const Upload = require('../models/Upload');

// Set up multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename
  },
});

const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
  const { taskTitle, uploadedBy } = req.body;
  const file = req.file;

  if (!file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const fileData = {
      fileName: file.originalname,
      fileUrl: `/uploads/${file.filename}`,
      uploadedBy: uploadedBy || 'Unknown',
      taskTitle: taskTitle || 'Untitled Task',
      uploadedAt: new Date(),
    };

    const newUpload = new Upload(fileData);
    await newUpload.save();

    res.status(200).json({
      message: 'File uploaded successfully',
      file: newUpload,
    });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Upload failed' });
  }
});

// Get recent uploads
router.get('/recent', async (req, res) => {
  try {
    const recentUploads = await Upload.find().sort({ uploadedAt: -1 }).limit(10);
    res.json(recentUploads);
  } catch (err) {
    console.error('Failed to fetch uploads:', err);
    res.status(500).json({ message: 'Error fetching uploads' });
  }
});

module.exports = router;
