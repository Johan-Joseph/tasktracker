import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: ''
  });

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  // GET: Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/projects');
      console.log("API Response (projects):", res.data);

      if (Array.isArray(res.data)) {
        setProjects(res.data);
      } else {
        console.error("Expected array but got:", typeof res.data);
        setProjects([]);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setProjects([]); // fallback on error
    }
  };

  // POST: Add a new project
  const handleSubmit = async () => {
  if (!form.title || !form.description || !form.startDate || !form.endDate) {
    alert("Please fill all fields.");
    return;
  }

  try {
    console.log("Submitting project:", form); // Debug

    const res = await axios.post('http://localhost:4000/api/projects', form);

    console.log("Project added:", res.data); // Debug

    setForm({ title: '', description: '', startDate: '', endDate: '' });
    fetchProjects(); // Refresh list
  } catch (err) {
    console.error("Error adding project:", err);
    alert("Error adding project. See console.");
  }
};


  // DELETE: Remove a project
  const handleDelete = async (id) => {
  try {
    console.log("Deleting project with ID:", id);
    const res = await axios.delete(`http://localhost:4000/api/projects/${id}`);
    console.log("Deleted response:", res.data);
    fetchProjects();
  } catch (err) {
    console.error("Error deleting project:", err.response?.data || err.message);
  }
};

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">Project Management</div>
      <div className="card-body">
        {/* Project Form */}
        <div className="mb-4">
          <input
            className="form-control mb-2"
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="row">
            <div className="col">
              <label className="form-label">Start Date</label>
              <input
                className="form-control"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div className="col">
              <label className="form-label">End Date</label>
              <input
                className="form-control"
                type="date"
                value={form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>
          <button className="btn btn-success mt-3" onClick={handleSubmit}>
            ➕ Add Project
          </button>
        </div>

        {/* Project List */}
        {projects.length > 0 ? (
          <ul className="list-group">
            {projects.map((p) => (
              <li
                key={p._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <h6 className="mb-1">{p.title}</h6>
                  <small>{p.description}</small><br />
                  <small className="text-muted">
                    {p.startDate?.slice(0, 10)} ➝ {p.endDate?.slice(0, 10)}
                  </small>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(p._id)}
                >
                  🗑 Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
