import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Table } from 'react-bootstrap';
import ChatWidget from './ChatWidget';
import axios from 'axios';
import { toast } from 'react-toastify';

const AdminDashboard = ({ user }) => {
  const navigate = useNavigate();
  const [teamMembers, setTeamMembers] = useState([]);

  // 🔁 Fetch team members
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/team');
        setTeamMembers(res.data);
      } catch (err) {
        console.error('❌ Error fetching team members:', err);
        toast.error('Failed to load team members');
      }
    };

    fetchTeam();
  }, []);

  const promoteToProjectManager = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/team/promote/${id}`);
      toast.success('✅ Successfully promoted to Project Manager');
      refreshTeam();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error promoting user');
    }
  };

  const demoteFromProjectManager = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/team/demote/${id}`);
      toast.info('🟠 User demoted to Member');
      refreshTeam();
    } catch (err) {
      console.error(err);
      toast.error('❌ Error demoting user');
    }
  };

  const refreshTeam = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/team');
      setTeamMembers(res.data);
    } catch (err) {
      console.error('❌ Error refreshing team list:', err);
    }
  };

  const cards = [
    {
      title: 'Projects',
      image: 'https://cdn-icons-png.flaticon.com/512/1904/1904425.png',
      path: '/projects',
    },
    {
      title: 'Tasks',
      image: 'https://cdn-icons-png.flaticon.com/512/906/906343.png',
      path: '/tasks',
    },
    {
      title: 'Team Members',
      image: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
      path: '/team',
    },
  ];

  return (
    <div>
      <h3 className="mb-4 text-center">📊 Admin Dashboard</h3>

      <div className="row justify-content-center">
        {cards.map((card, index) => (
          <div key={index} className="col-md-4 mb-4">
            <Card
              onClick={() => navigate(card.path)}
              className="h-100 shadow-lg card-hover"
              style={{ cursor: 'pointer', borderRadius: '1rem' }}
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
              <Card.Body className="d-flex flex-column justify-content-between text-center">
                <Card.Title className="mb-3 fs-4">{card.title}</Card.Title>
                <Button variant="primary" onClick={() => navigate(card.path)}>
                  Go to {card.title}
                </Button>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      {/* ✅ Only Admin can see Promote/Demote Table */}
      {user?.role === 'admin' && (
        <div className="mt-5 px-3">
          <h5>👥 Manage Project Manager Roles</h5>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Current Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member._id}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.role}</td>
                  <td>
                    {member.role === 'admin' ? (
                      <span className="text-muted">Admin</span>
                    ) : member.role === 'project_manager' ? (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => demoteFromProjectManager(member._id)}
                      >
                        Demote to Member
                      </Button>
                    ) : (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => promoteToProjectManager(member._id)}
                      >
                        Promote to Project Manager
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      <ChatWidget userId={user?._id || 'admin'} role={user?.role} />

      <style jsx="true">{`
        .card-hover:hover {
          transform: translateY(-5px);
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
