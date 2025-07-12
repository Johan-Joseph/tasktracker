import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img7 from '../assets/img7.png'
import img8 from '../assets/img8.png'
import img9 from '../assets/img9.png'

const MemberHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [taskStats, setTaskStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser || {});

    const fetchTasks = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/tasks/user/${storedUser._id}`);
        const tasks = res.data;
        const completed = tasks.filter((t) => t.status === 'Completed').length;
        const pending = tasks.filter((t) => t.status !== 'Completed').length;
        setTaskStats({ total: tasks.length, completed, pending });
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    if (storedUser?._id) fetchTasks();
  }, []);

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const cards = [
    {
      title: 'My Tasks',
      image: img7,
      path: '/mytasks',
    },
    {
      title: 'Uploads',
      image: img9,
      path: '/uploads',
    },
    {
      title: 'Task Progress',
      image: img8,
      path: '/progress',
    },
  ];

  return (
    <div>
      <h3 className="text-center mb-3">👋 Welcome, {user.name || 'Team Member'}!</h3>
      <p className="text-center text-muted">{today}</p>

      {/* 📊 Task Summary */}
      <Row className="mb-4 text-center">
        <Col md={4}>
          <Alert variant="primary">
            <strong>{taskStats.total}</strong> Total Tasks
          </Alert>
        </Col>
        <Col md={4}>
          <Alert variant="success">
            <strong>{taskStats.completed}</strong> Completed
          </Alert>
        </Col>
        <Col md={4}>
          <Alert variant="warning">
            <strong>{taskStats.pending}</strong> Pending
          </Alert>
        </Col>
      </Row>

      {/* 🔗 Quick Links */}
      <h5 className="text-center mb-3">Quick Access</h5>
      <Row className="justify-content-center">
        {cards.map((card, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card
              className="h-100 shadow card-hover"
              style={{ cursor: 'pointer', borderRadius: '1rem' }}
              onClick={() => navigate(card.path)}
            >
              <Card.Img
                variant="top"
                src={card.image}
                style={{
                  height: '250px',
                  objectFit: 'contain',
                  padding: '1.5rem',
                }}
              />
              <Card.Body className="text-center">
                <Card.Title className="mb-3 fs-4">{card.title}</Card.Title>
                <Button variant="primary">Go to {card.title}</Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✨ Motivational Quote */}
      <div className="text-center mt-5">
        <blockquote className="blockquote">
          <p className="mb-0">
            "Productivity is never an accident. It is always the result of commitment, planning, and focused effort."
          </p>
          <footer className="blockquote-footer mt-2">Paul J. Meyer</footer>
        </blockquote>
      </div>

      <style jsx="true">{`
        .card-hover:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default MemberHome;
