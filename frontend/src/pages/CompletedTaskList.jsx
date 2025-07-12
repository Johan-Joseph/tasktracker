import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Card, Spinner } from 'react-bootstrap';

const CompletedTaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:4000/api/tasks')
      .then(res => {
        const completed = res.data.filter(task => task.status === 'Done');
        setTasks(completed);
      })
      .catch(err => console.error('Error fetching tasks:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center mt-5"><Spinner animation="border" /></div>;

  return (
    <Container className="mt-4">
      <h3 className="text-center mb-4">✅ Completed Tasks</h3>
      {tasks.map((task, idx) => (
        <Card key={idx} className="mb-3 p-3 shadow-sm">
          <h5>{task.title}</h5>
          <p className="mb-1"><strong>Assigned To:</strong> {task.assignedTo?.name || 'N/A'}</p>
          <p className="text-muted">{task.description}</p>
        </Card>
      ))}
    </Container>
  );
};

export default CompletedTaskList;
