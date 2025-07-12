const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ['member', 'project_manager', 'admin'], // ✅ Added 'project_manager'
    default: 'member'
  }
});

module.exports = mongoose.model('TeamMember', teamSchema); // ✅ Also renamed for clarity
