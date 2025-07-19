import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskManager = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: '',
    project: ''
  });

  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [t, m, p] = await Promise.all([
        axios.get('http://localhost:4000/api/tasks'),
        axios.get('http://localhost:4000/api/team'),
        axios.get('http://localhost:4000/api/projects')
      ]);

      setTasks(Array.isArray(t.data) ? t.data : []);
      setMembers(Array.isArray(m.data) ? m.data : []);
      setProjects(Array.isArray(p.data) ? p.data : []);
    } catch (err) {
      console.error('Error fetching tasks/members/projects:', err);
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post('http://localhost:4000/api/tasks', form);
      setForm({ title: '', description: '', dueDate: '', priority: 'Medium', assignedTo: '', project: '' });
      fetchAll();
    } catch (err) {
      console.error('Error assigning task:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/tasks/${id}`);
      fetchAll();
    } catch (err) {
      console.error('Error deleting task:', err);
    }
  };

  const getMemberName = (id) => {
    const member = members.find((m) => m._id === id);
    return member ? member.name : 'Unknown';
  };

  const getProjectTitle = (id) => {
    const project = projects.find((p) => p._id === id);
    return project ? project.title : 'Unknown';
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-secondary text-white">Task Management</div>
      <div className="card-body">
        {/* Form to assign a task */}
        <div className="mb-4">
          <input
            className="form-control mb-2"
            placeholder="Task Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Task Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            className="form-control mb-2"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />

          <select
            className="form-select mb-2"
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value })}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
            <option value="Critical">Critical Priority</option>
          </select>
          <select
            className="form-select mb-2"
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
          >
            <option value="">Select Team Member</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            className="form-select mb-2"
            value={form.project}
            onChange={(e) => setForm({ ...form, project: e.target.value })}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title}
              </option>
            ))}
          </select>

          <button className="btn btn-success" onClick={handleSubmit}>
            ➕ Assign Task
          </button>
        </div>

        {/* Task List */}
        {tasks.length > 0 ? (
          <ul className="list-group">
            {tasks.map((t) => (
              <li
                key={t._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{t.title}</strong> – <em>{t.status || 'To Do'}</em>
                  <span className={`badge ms-2 ${
                    t.priority === 'Critical' ? 'bg-danger' :
                    t.priority === 'High' ? 'bg-warning' :
                    t.priority === 'Medium' ? 'bg-info' : 'bg-secondary'
                  }`}>
                    {t.priority}
                  </span><br />
                  <small>Project: {getProjectTitle(t.project)}</small><br />
                  <small>Assigned To: {getMemberName(t.assignedTo)}</small>
                </div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDelete(t._id)}
                >
                  🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No tasks found.</p>
        )}
      </div>
    </div>
  );
};

export default TaskManager;
