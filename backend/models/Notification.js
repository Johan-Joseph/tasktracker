const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TeamMember', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['task_assigned', 'task_updated', 'task_completed', 'comment_added', 'due_date_reminder'],
    default: 'task_assigned'
  },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notification', notificationSchema);