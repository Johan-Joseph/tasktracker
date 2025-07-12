const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  fileName: String,
  fileUrl: String,
  uploadedBy: String,
  taskId: String,
  taskTitle: String,
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Upload', uploadSchema);
