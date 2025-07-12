const express = require('express');
const router = express.Router();
const TeamMember = require('../models/TeamMember');

// Login Route
router.post('/login', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  // Admin login (only this email is allowed)
  if (email === 'admin@admin.com') {
    return res.json({ name: 'Admin', email, role: 'Admin', _id: 'admin-id' });
  }

  // Otherwise, check if user is a registered team member
  try {
    const member = await TeamMember.findOne({ email });
    if (!member) return res.status(404).json({ error: 'User not found' });

    res.json(member);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Registration route – only for team members
router.post('/register', async (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // ❌ Prevent anyone from registering as admin
  if (email === 'admin@admin.com' || role === 'Admin') {
    return res.status(403).json({ error: 'Cannot register as admin' });
  }

  try {
    const exists = await TeamMember.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email already registered' });

    const newMember = new TeamMember({ name, email, role });
    const saved = await newMember.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
