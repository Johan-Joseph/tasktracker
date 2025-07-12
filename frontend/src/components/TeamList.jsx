import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeamList = () => {
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', role: '' });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/team');
      console.log('Team members response:', res.data);

      if (Array.isArray(res.data)) {
        setMembers(res.data);
      } else {
        console.error('Expected array but got:', typeof res.data);
        setMembers([]);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setMembers([]);
    }
  };

  const handleSubmit = async () => {
  if (!form.name || !form.email || !form.role) {
    alert("Please fill all fields.");
    return;
  }

  try {
    console.log("Submitting team member:", form);
    await axios.post('http://localhost:4000/api/team', form);
    setForm({ name: '', email: '', role: '' });
    fetchMembers();
  } catch (err) {
    console.error("Error adding member:", err.response?.data || err.message);
    alert("Error adding team member. See console.");
  }
};


  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/team/${id}`);
      fetchMembers();
    } catch (err) {
      console.error('Error deleting member:', err);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-dark text-white">Team Management</div>
      <div className="card-body">
        {/* Add Member Form */}
        <div className="mb-4">
          <input
            className="form-control mb-2"
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="form-control mb-2"
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleSubmit}>
            ➕ Add Member
          </button>
        </div>

        {/* Member List */}
        {members.length > 0 ? (
          <ul className="list-group">
            {members.map((m) => (
              <li
                key={m._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{m.name}</strong> <span className="text-muted">({m.role})</span><br />
                  <small className="text-muted">{m.email}</small>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(m._id)}
                >
                  🗑 Remove
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No team members found.</p>
        )}
      </div>
    </div>
  );
};

export default TeamList;
