const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.get('/:senderId/:receiverId', async (req, res) => {
  try {
    const { senderId, receiverId } = req.params;
    const messages = await Message.find({
      $or: [
        { senderId: senderId, receiverId: receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('❌ Error fetching messages:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
module.exports = router;