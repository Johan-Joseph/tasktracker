const express = require('express');
const router = express.Router();

const Project = require('../models/Project');
const Task = require('../models/Task');
const TeamMember = require('../models/TeamMember');

router.get('/', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  console.log("🔍 Search query received:", query);

  try {
    const projects = await Project.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });

    const tasks = await Task.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { status: { $regex: query, $options: 'i' } }
      ]
    }).populate('assignedTo project');

    const members = await TeamMember.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    });

    // Add assigned tasks to each member
    const enrichedMembers = await Promise.all(members.map(async (member) => {
      const assignedTasks = await Task.find({ assignedTo: member._id }).populate('project');
      return { ...member.toObject(), assignedTasks };
    }));

    res.json({ projects, tasks, members: enrichedMembers });
  } catch (err) {
    console.error("❌ Search backend error:", err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
