const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { createNotification } = require('./notifications');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo project');
    res.json(tasks); // ✅ return array
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
});

// GET tasks for Kanban board
router.get('/kanban', async (req, res) => {
  try {
    const tasks = await Task.find().populate('assignedTo project');
    const kanbanData = {
      'To Do': tasks.filter(task => task.status === 'To Do'),
      'In Progress': tasks.filter(task => task.status === 'In Progress'),
      'Done': tasks.filter(task => task.status === 'Done')
    };
    res.json(kanbanData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch kanban data' });
  }
});
// GET tasks by user ID
router.get('/user/:id', async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.params.id }).populate('project assignedTo');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tasks for user' });
  }
});
// POST new task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    
    // Create notification for assigned user
    if (saved.assignedTo) {
      await createNotification(
        saved.assignedTo,
        'New Task Assigned',
        `You have been assigned a new task: ${saved.title}`,
        'task_assigned',
        saved._id,
        saved.project
      );
    }
    
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// PUT update task status/comments
router.put('/:id', async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    
    // Create notification for status changes
    if (oldTask && oldTask.status !== updated.status && updated.assignedTo) {
      let notificationType = 'task_updated';
      let message = `Task "${updated.title}" status changed to ${updated.status}`;
      
      if (updated.status === 'Done') {
        notificationType = 'task_completed';
        message = `Task "${updated.title}" has been completed`;
      }
      
      await createNotification(
        updated.assignedTo,
        'Task Updated',
        message,
        notificationType,
        updated._id,
        updated.project
      );
    }
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = router;
