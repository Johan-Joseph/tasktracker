import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import planoraLogo from '../assets/image1.png'; // Optional: your logo

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:4000/api/team')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Error fetching users:', err));
  }, []);

  const handleLogin = () => {
    const trimmedEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === trimmedEmail);

    if (user) {
      onLogin(user);
      localStorage.setItem('user', JSON.stringify(user));

      const role = user.role?.toLowerCase();

      if (role === 'admin' || role === 'project_manager') {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    } else {
      alert('Invalid email. Please try again.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="login-page d-flex justify-content-center align-items-center vh-100">
      <div className="card login-card p-5 shadow-lg">
        <div className="text-center mb-4">
          <img src={planoraLogo} alt="Planora Logo" height="60" className="mb-3" />
          <h2 className="fw-bold text-primary">Welcome back to Planora</h2>
          <p className="text-muted mb-4">Streamline. Plan. Succeed.</p>
        </div>
        <div className="form-group mb-3">
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
          Login
        </button>
        <div className="text-center">
          <span className="text-muted">Not registered?</span>
          <button
            className="btn btn-link p-0 ms-2"
            onClick={handleRegisterRedirect}
            style={{ fontSize: '0.95rem' }}
          >
            Create an account
          </button>
        </div>
      </div>

      <style jsx="true">{`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  

  .login-card {
    width: 100%;
    max-width: 400px;
    border-radius: 1rem;
    background-color: white;
    backdrop-filter: blur(10px);
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .form-control {
    padding: 12px;
    font-size: 1rem;
    border-radius: 0.5rem;
  }

  .btn-primary {
    font-weight: 500;
    font-size: 1rem;
  }

  .btn-link {
    text-decoration: none;
    color: #0d6efd;
  }

  .btn-link:hover {
    text-decoration: underline;
  }
`}</style>
    </div>
  );
};

export default LoginPage;
