import React, { useState } from 'react';
import {
  Navbar,
  Nav,
  Container,
  NavDropdown,
  Form,
  FormControl,
  Button,
  Modal,
  ListGroup,
} from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import logoimg from '../assets/image1.png';
import NotificationCenter from './NotificationCenter';

const AppNavbar = ({ onLogout, user }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:4000/api/search?q=${encodeURIComponent(search)}`);
      navigate('/search-results', { state: { results: res.data, query: search } });
    } catch (err) {
      console.error('Search error:', err);
      alert('Search failed. Please try again.');
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
        <Container fluid className="px-4">
          {/* Logo + Brand */}
          <Navbar.Brand
            className="d-flex align-items-center"
            onClick={() => navigate('/dashboard')}
            style={{ cursor: 'pointer' }}
          >
            <img
              alt="logo"
              src={logoimg}
              width="65"
              height="35"
              className="d-inline-block align-top me-2"
            />
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>
              PLANORA
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            {/* Search Bar */}
            {(user?.role === 'admin' || user?.role === 'project_manager') && (
  <Form className="d-flex me-3" onSubmit={handleSearch}>
    <FormControl
      type="search"
      placeholder="Search"
      className="me-2"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{ maxWidth: '200px' }}
    />
    <Button variant="outline-light" type="submit">🔍</Button>
  </Form>
)}

            {/* Navigation */}
            <Nav className="me-3">
  <Nav.Link
    onClick={() => {
      if (user?.role === 'admin' || user?.role === 'project_manager') {
        navigate('/admin');
      } else {
        navigate('/member');
      }
    }}
  >
    Home
  </Nav.Link>

  <Nav.Link onClick={() => navigate('/dashboard')}>Dashboard</Nav.Link>
  
  {(user?.role === 'admin' || user?.role === 'project_manager') && (
    <Nav.Link onClick={() => navigate('/kanban')}>Board</Nav.Link>
  )}
</Nav>

            {/* Notifications */}
            {user && (
              <div className="me-3">
                <NotificationCenter userId={user._id} />
              </div>
            )}

            {/* User Dropdown */}
            <Nav>
              <NavDropdown title={user?.email || 'User'} id="basic-nav-dropdown" align="end">
                {user?.role && (
                  <NavDropdown.Item disabled>
                    Role: <strong>{user.role}</strong>
                  </NavDropdown.Item>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={onLogout} className="text-danger">
                  🔓 Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* 🔍 Search Result Modal */}
      <Modal show={showResults} onHide={() => setShowResults(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Search Results for: "{search}"</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {results.length === 0 ? (
            <p>No results found.</p>
          ) : (
            results.map((item, idx) => (
              <div key={idx} className="mb-3">
                {item.type === 'Project' ? (
                  <>
                    <h5>📁 Project: {item.title}</h5>
                    <p><strong>Description:</strong> {item.description}</p>
                    <p><strong>Timeline:</strong> {item.startDate?.slice(0,10)} ➝ {item.endDate?.slice(0,10)}</p>
                    <h6 className="mt-2">Tasks:</h6>
                    <ListGroup>
                      {item.tasks.map((task, i) => (
                        <ListGroup.Item key={i}>
                          {task.title} ({task.status}) - Assigned to: {task.assignedTo?.name || 'N/A'}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </>
                ) : (
                  <>
                    <h5>👤 Team Member: {item.name}</h5>
                    <p><strong>Email:</strong> {item.email}</p>
                    <h6 className="mt-2">Assigned Tasks:</h6>
                    <ListGroup>
                      {item.tasks.map((task, i) => (
                        <ListGroup.Item key={i}>
                          {task.title} ({task.status}) - Project: {task.project?.title || 'N/A'}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </>
                )}
              </div>
            ))
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AppNavbar;
