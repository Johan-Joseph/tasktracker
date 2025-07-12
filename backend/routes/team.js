const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember'); // ✅ Correct model

// ✅ Get all team members
router.get('/', async (req, res) => {
  try {
    const members = await TeamMember.find();
    res.json(members);
  } catch (err) {
    console.error('❌ Error fetching team members:', err);
    res.status(500).json([]);
  }
});

// ✅ Add a new team member
router.post('/', async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMember = new TeamMember({ name, email, role });
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('❌ Error adding member:', err);
    res.status(500).json({ error: 'Failed to add member.' });
  }
});

// ✅ Delete a team member by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await TeamMember.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Member not found.' });
    }
    res.json({ message: 'Member deleted successfully.' });
  } catch (err) {
    console.error('❌ Error deleting member:', err);
    res.status(500).json({ error: 'Failed to delete member.' });
  }
});

// ✅ Promote team member to Project Manager
router.put('/promote/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'User not found' });
    }

    member.role = 'project_manager';
    await member.save();

    res.status(200).json({ message: 'User promoted to Project Manager successfully' });
  } catch (err) {
    console.error('❌ Error promoting user:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// ✅ Demote Project Manager to Member
router.put('/demote/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const member = await TeamMember.findById(id);

    if (!member) {
      return res.status(404).json({ message: 'User not found' });
    }

    member.role = 'member'; // Default role
    await member.save();

    res.status(200).json({ message: 'User demoted to Member successfully' });
  } catch (err) {
    console.error('❌ Error demoting user:', err.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;
