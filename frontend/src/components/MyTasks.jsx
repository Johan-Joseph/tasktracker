import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyTasks = ({ userId }) => {
  const [tasks, setTasks] = useState([]);
  const [commentInput, setCommentInput] = useState({}); // track comment input per task

  useEffect(() => {
    if (userId) fetchTasks();
  }, [userId]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/api/tasks/user/${userId}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:4000/api/tasks/${id}`, { status });
      fetchTasks();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const addComment = async (id) => {
    const comment = commentInput[id];
    if (!comment?.trim()) return;

    try {
      const task = tasks.find(t => t._id === id);
      const updatedComments = [...(task.comments || []), comment];

      await axios.put(`http://localhost:4000/api/tasks/${id}`, { comments: updatedComments });
      setCommentInput(prev => ({ ...prev, [id]: '' }));
      fetchTasks();
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-info text-white">My Tasks</div>
      <div className="card-body">
        {tasks.length > 0 ? (
          <ul className="list-group">
            {tasks.map(task => (
              <li key={task._id} className="list-group-item">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <strong>{task.title}</strong>
                  <span className={`badge ${
                    task.priority === 'Critical' ? 'bg-danger' :
                    task.priority === 'High' ? 'bg-warning' :
                    task.priority === 'Medium' ? 'bg-info' : 'bg-secondary'
                  }`}>
                    {task.priority}
                  </span>
                </div>
                {task.project?.title && <small className="text-muted">Project: {task.project.title}</small>}<br />
                Due: {task.dueDate?.slice(0, 10)}<br />

                <label className="form-label mt-2">Status</label>
                <select
                  className="form-select mb-2"
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Done</option>
                </select>

                <div>
                  <strong>Comments:</strong>
                  <ul className="mb-2">
                    {(task.comments || []).map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>

                  <input
                    className="form-control"
                    type="text"
                    placeholder="Add a comment and press Enter"
                    value={commentInput[task._id] || ''}
                    onChange={(e) => setCommentInput(prev => ({ ...prev, [task._id]: e.target.value }))}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') addComment(task._id);
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No tasks assigned.</p>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
