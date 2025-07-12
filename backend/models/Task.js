const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  dueDate: Date,
  status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  comments: [String],
});
module.exports = mongoose.model('Task', TaskSchema);