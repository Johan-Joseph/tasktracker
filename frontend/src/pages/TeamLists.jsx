import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';

const TeamList = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/team')
      .then(res => setTeam(res.data))
      .catch(err => console.error('Error fetching team:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">👥 Team Members</h3>
      {team.map((member, idx) => (
        <Card key={idx} className="mb-3 p-3 shadow-sm">
          <h5>{member.name}</h5>
          <p className="mb-1"><strong>Email:</strong> {member.email}</p>
          <p className="text-muted"><strong>Role:</strong> {member.role}</p>
        </Card>
      ))}
    </Container>
  );
};

export default TeamList;
