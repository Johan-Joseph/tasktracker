const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const { Server } = require('socket.io');

const io = new Server(http, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB Error:', err));

// ✅ Import Routes
const projectRoutes = require('./routes/projects');
const searchRoutes = require('./routes/search');
const teamRoutes = require('./routes/team');
const taskRoutes = require('./routes/tasks');
const authRoutes = require('./routes/auth');
const uploadRoutes = require('./routes/uploadRoutes');
const messageRoutes = require('./routes/messageRoutes'); // ✅ only once
const { router: notificationRoutes } = require('./routes/notifications');

// ✅ Use Routes
app.use('/api/projects', projectRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/messages', messageRoutes); // ✅ used once
app.use('/api/notifications', notificationRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ Socket.IO Chat
/* const Message = require('./models/Message');
io.on('connection', (socket) => {
  console.log(`👥 User connected: ${socket.id}`);

  socket.on('send_message', async (data) => {
    try {
      const newMsg = new Message({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.message,
        timestamp: data.timestamp
      });
      await newMsg.save();
      io.emit('receive_message', newMsg);
    } catch (error) {
      console.error("❌ Error saving message:", error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.id}`);
  });
});
 */
// ✅ Start Server
const PORT = process.env.PORT || 4000;
http.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
