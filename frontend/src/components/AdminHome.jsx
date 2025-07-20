import React, { useEffect, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Spinner,
  ListGroup
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import img6 from '../assets/image6.png';
import ChatWidget from './ChatWidget'; // ✅ ChatWidget added
import taskcomplete from '../assets/image2.png';
import projectt from '../assets/image3.png';
import teamm from '../assets/image4.png';
import calendarimg from '../assets/calender1.png';
import analytics from '../assets/image5.png';

const AdminHome = () => {
  const [stats, setStats] = useState({
    projects: 0,
    team: 0,
    completedTasks: 0,
  });
  const [loading, setLoading] = useState(true);
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectRes, teamRes, taskRes, uploadRes] = await Promise.all([
          axios.get('http://localhost:4000/api/projects'),
          axios.get('http://localhost:4000/api/team'),
          axios.get('http://localhost:4000/api/tasks'),
          axios.get('http://localhost:4000/api/uploads/recent'),
        ]);

        const completedTasks = taskRes.data.filter(
          task => task.status === 'Done'
        ).length;

        setStats({
          projects: projectRes.data.length,
          team: teamRes.data.length,
          completedTasks,
        });
        setUploads(uploadRes.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-5 text-center text-primary fw-bold">Welcome Admin 👋</h2>

      <Row className="g-4 justify-content-center">
        <Col md={3}>
  <Card
    className="shadow-lg border-0 h-100"
    style={{ cursor: 'pointer' }}
    onClick={() => navigate('/project-list')}
  >
    <Card.Img variant="top" src={projectt} style={{ objectFit: 'cover', height: '220px' }} />
    <Card.Body className="text-center">
      <Card.Title className="fs-4">Total Projects</Card.Title>
      <h2 className="text-info fw-bold">{stats.projects}</h2>
      <Card.Text>Manage all active and archived projects.</Card.Text>
    </Card.Body>
  </Card>
</Col>

<Col md={3}>
  <Card
    className="shadow-lg border-0 h-100"
    style={{ cursor: 'pointer' }}
    onClick={() => navigate('/team-list')}
  >
    <Card.Img variant="top" src={teamm} style={{ objectFit: 'cover', height: '220px' }} />
    <Card.Body className="text-center">
      <Card.Title className="fs-4">Team Members</Card.Title>
      <h2 className="text-success fw-bold">{stats.team}</h2>
      <Card.Text>Oversee your entire team in one place.</Card.Text>
    </Card.Body>
  </Card>
</Col>

<Col md={3}>
  <Card
    className="shadow-lg border-0 h-100"
    style={{ cursor: 'pointer' }}
    onClick={() => navigate('/completed-task-list')}
  >
    <Card.Img variant="top" src={taskcomplete} style={{ objectFit: 'cover', height: '220px' }} />
    <Card.Body className="text-center">
      <Card.Title className="fs-4">Tasks Completed</Card.Title>
      <h2 className="text-secondary fw-bold">{stats.completedTasks}</h2>
      <Card.Text>Track how many tasks your team has finished.</Card.Text>
    </Card.Body>
  </Card>
</Col>


        <Col md={3}>
          <Card
            className="shadow-lg border-0 h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/calendar')}
          >
            <Card.Img variant="top" src={calendarimg} style={{ objectFit: 'cover', height: '220px' }} />
            <Card.Body className="text-center">
              <Card.Title className="fs-4">Task Calendar</Card.Title>
              <br />
              <Card.Text>Visualize due dates for all tasks.</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-lg border-0 h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/analytics')}
          >
            <Card.Img variant="top" src={analytics} style={{ objectFit: 'cover', height: '220px' }} />
            <Card.Body className="text-center">
              <Card.Title className="fs-4">Task Analytics</Card.Title>
              <h2 className="text-warning fw-bold">📊</h2>
              <Card.Text>Visualize task distribution by status.</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card
            className="shadow-lg border-0 h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/kanban')}
          >
            <Card.Img variant="top" src={analytics} style={{ objectFit: 'cover', height: '220px' }} />
            <Card.Body className="text-center">
              <Card.Title className="fs-4">Board</Card.Title>
              <h2 className="text-primary fw-bold">📋</h2>
              <Card.Text>Task management board view.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card
            className="shadow-lg border-0 h-100"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/uploads')}
          >
            <Card.Img variant="top" src={img6} style={{ objectFit: 'cover', height: '220px' }} />
            <Card.Body className="text-center">
              <Card.Title className="fs-4">📎 Recent Uploads</Card.Title>
              <br />
              <br />
              <Card.Text>Click to view uploaded task files.</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* ✅ Floating Chat Widget */}
      <ChatWidget userId="admin123" role="admin"  />

    </Container>
  );
};

export default AdminHome;
