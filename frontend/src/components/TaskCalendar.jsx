// components/TaskCalendar.jsx
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import { ListGroup, Badge, Card } from 'react-bootstrap';

const TaskCalendar = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredTasks, setFilteredTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const filtered = tasks.filter(task => task.dueDate?.slice(0, 10) === dateStr);
    setFilteredTasks(filtered);
  }, [selectedDate, tasks]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const getTileClassName = ({ date }) => {
    const dateStr = date.toISOString().split('T')[0];
    const hasTask = tasks.some(task => task.dueDate?.slice(0, 10) === dateStr);
    return hasTask ? 'highlight' : null;
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4 text-primary">📅 Task Calendar</h3>
      <div className="row">
        {/* Calendar Card */}
        <div className="col-md-6 mb-4">
          <Card className="shadow">
            <Card.Body>
              <Calendar
                onChange={setSelectedDate}
                value={selectedDate}
                tileClassName={getTileClassName}
              />
            </Card.Body>
          </Card>
        </div>

        {/* Task List Card */}
        <div className="col-md-6 mb-4">
          <Card className="shadow">
            <Card.Body>
              <h5 className="mb-3 text-primary">
                Tasks on {selectedDate.toDateString()}
              </h5>
              <ListGroup variant="flush">
                {filteredTasks.length > 0 ? (
                  filteredTasks.map(task => (
                    <ListGroup.Item key={task._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{task.title}</strong>
                          <div className="text-muted small">
                            Project: {task.project?.title || 'N/A'}
                          </div>
                        </div>
                        <Badge bg={
                          task.status === 'Done' ? 'success' :
                          task.status === 'In Progress' ? 'warning' :
                          'secondary'
                        }>
                          {task.status}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))
                ) : (
                  <ListGroup.Item>No tasks for this date.</ListGroup.Item>
                )}
              </ListGroup>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Inline styles for calendar task highlight */}
      <style>{`
        .react-calendar .highlight {
          background-color: #198754 !important;
          color: white;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default TaskCalendar;
