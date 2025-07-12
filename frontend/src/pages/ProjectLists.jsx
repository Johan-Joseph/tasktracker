import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/projects')
      .then(res => setProjects(res.data))
      .catch(err => console.error('Error fetching projects:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">📁 Project List</h3>
      {projects.map((project, idx) => (
        <Card key={idx} className="mb-3 p-3 shadow-sm">
          <h5>{project.title}</h5>
          <p className="mb-1"><strong>Status:</strong> {project.status}</p>
          <p className="text-muted">{project.description}</p>
        </Card>
      ))}
    </Container>
  );
};

export default ProjectList;
