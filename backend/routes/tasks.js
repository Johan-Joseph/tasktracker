const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks); // ✅ return array
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
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
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// PUT update task status/comments
router.put('/:id', async (req, res) => {
  try {
    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
