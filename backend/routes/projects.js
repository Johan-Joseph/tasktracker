const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save project' });
  }
});

router.get('/', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});
// backend/routes/projects.js
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
