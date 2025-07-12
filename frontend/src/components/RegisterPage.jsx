import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterPage = ({ onRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', role: 'Team Member' });
  const navigate = useNavigate(); // ✅ Must be inside component

  const handleLogin = () => {
    navigate('/login'); // ✅ This will navigate properly
  };

  const handleRegister = async () => {
    const { name, email, role } = form;

    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    if (role === 'Admin') {
      if (email === 'admin@admin.com') {
        onRegister({ role: 'Admin', _id: 'admin-id', email });
      } else {
        alert("Only 'admin@admin.com' is allowed as admin");
      }
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/team', form);
      onRegister(res.data);
      navigate('/dashboard'); // Optional: Auto-redirect after successful register
    } catch (err) {
      console.error("Error registering:", err);
      alert("Registration failed. Email might already be used.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill" style={{ fontSize: '3rem', color: '#198754' }}></i>
          <h3 className="mt-2">Create Account</h3>
          <p className="text-muted">Register</p>
        </div>

        <div className="form-group mb-3">
          <input
            className="form-control"
            type="text"
            placeholder="Enter your full name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group mb-3">
          <input
            className="form-control"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group mb-4">
          <select
            className="form-select"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
          >
            <option>Team Member</option>
          </select>
        </div>

        <button className="btn btn-success w-100 mb-3" onClick={handleRegister}>
          Register
        </button>

        <div className="text-center">
          <span className="text-muted">Already registered?</span>
          <button
            className="btn btn-link p-0 ms-2"
            onClick={handleLogin}
            style={{ fontSize: '0.95rem' }}
          >
            Login here
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
