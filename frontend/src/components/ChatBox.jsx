import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import './ChatBox.css';

const socket = io('http://localhost:4000');

const ChatBox = ({ userId, role, targetId }) => {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);
  const [targetName, setTargetName] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/messages/${userId}/${targetId}`);
        setChat(res.data);

        if (role === 'admin') {
          const nameRes = await axios.get(`http://localhost:4000/api/team/${targetId}`);
          setTargetName(nameRes.data.name || 'Team Member');
        } else {
          setTargetName('Admin');
        }
      } catch (err) {
        console.error('❌ Error fetching chat:', err);
      }
    };

    if (userId && targetId) {
      fetchData();
    }

    socket.on('receive_message', (data) => {
      if (
        (data.senderId === userId && data.receiverId === targetId) ||
        (data.senderId === targetId && data.receiverId === userId)
      ) {
        setChat((prev) => [...prev, data]);
      }
    });

    return () => socket.off('receive_message');
  }, [userId, targetId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      senderId: userId,
      receiverId: targetId,
      message,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', msgData);
    setMessage('');
  };

  return (
    <div className="chatbox-container shadow p-3 rounded bg-white" style={{ width: 350 }}>
      <h6 className="text-primary mb-2">💬 Chat with {targetName}</h6>

      <div className="chat-messages bg-light rounded p-2 mb-2 overflow-auto" style={{ maxHeight: 250 }}>
        {chat.map((msg, i) => (
          <div
            key={i}
            className={`message-bubble ${msg.senderId === userId ? 'sent' : 'received'}`}
          >
            <div>{msg.text}</div>
            <small className="text-muted d-block">{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="d-flex">
        <input
          className="form-control me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;