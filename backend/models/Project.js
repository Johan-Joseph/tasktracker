const mongoose = require('mongoose');
const ProjectSchema = new mongoose.Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date,
});
module.exports = mongoose.model('Project', ProjectSchema);