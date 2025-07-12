import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import ProjectLists from './pages/ProjectLists';
import TeamLists from './pages/TeamLists';
import CompletedTaskList from './pages/CompletedTaskList';
import SearchResults from './components/SearchResults';
import AdminHome from './components/AdminHome';
import AdminDashboard from './components/AdminDashboard';
import MemberDashboard from './components/MemberDashboard';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Navbar from './components/Navbar';
import ProjectList from './components/ProjectList';
import TaskManager from './components/TaskManager';
import TeamList from './components/TeamList';
import TaskCalendar from './components/TaskCalendar';
import TaskAnalytics from './components/TaskAnalytics';
import AllUploads from './components/AllUploads';
import MemberHome from './components/MemberHome';
import TaskProgressPage from './components/TaskProgressPage';

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdminOrPM =
    user?.role?.toLowerCase() === 'admin' ||
    user?.role?.toLowerCase() === 'project_manager';

  const isMember =
    user && user.role?.toLowerCase() !== 'admin' && user.role?.toLowerCase() !== 'project_manager';

  return (
    <>
      {user && <Navbar onLogout={handleLogout} user={user} />}

      <div className="container mt-4">
        <Routes>
          {/* ✅ Auth Routes */}
          <Route
            path="/login"
            element={
              <LoginPage
                onLogin={(loggedUser) => {
                  setUser(loggedUser);
                  localStorage.setItem('user', JSON.stringify(loggedUser));
                }}
              />
            }
          />

          <Route
            path="/register"
            element={
              <RegisterPage
                onRegister={(registeredUser) => {
                  setUser(registeredUser);
                  localStorage.setItem('user', JSON.stringify(registeredUser));
                }}
              />
            }
          />

          {/* ✅ Member Progress Page (passing userId from logged in user) */}
         <Route path="/progress" element={user ? <TaskProgressPage /> : <Navigate to="/login" />} />


          {/* ✅ Member Home */}
          <Route
            path="/member"
            element={isMember ? <MemberHome /> : <Navigate to="/login" />}
          />

          {/* ✅ Search Results */}
          <Route
            path="/search-results"
            element={user ? <SearchResults /> : <Navigate to="/login" />}
          />
          <Route path="/project-list" element={<ProjectLists />} />
          <Route path="/team-list" element={<TeamLists />} />
          <Route path="/completed-task-list" element={<CompletedTaskList />} />
          {/* ✅ Uploads */}
          <Route
            path="/uploads"
            element={user ? <AllUploads /> : <Navigate to="/login" />}
          />

          {/* ✅ Admin Tools */}
          <Route
            path="/admin"
            element={isAdminOrPM ? <AdminHome /> : <Navigate to="/login" />}
          />

          <Route
            path="/admin/dashboard"
            element={user ? <AdminDashboard user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/projects"
            element={isAdminOrPM? <ProjectList /> : <Navigate to="/login" />}
          />

          <Route
            path="/tasks"
            element={isAdminOrPM? <TaskManager /> : <Navigate to="/login" />}
          />

          <Route
            path="/team"
            element={isAdminOrPM? <TeamList /> : <Navigate to="/login" />}
          />

          <Route
            path="/analytics"
            element={isAdminOrPM? <TaskAnalytics /> : <Navigate to="/login" />}
          />

          <Route
            path="/calendar"
            element={isAdminOrPM? <TaskCalendar /> : <Navigate to="/login" />}
          />

          {/* ✅ Dashboard Route Based on Role */}
          <Route
            path="/dashboard"
            element={
              user ? (
                isAdminOrPM ? <Navigate to="/admin/dashboard" /> : <Navigate to="/mytasks" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* ✅ My Tasks (Member Dashboard) */}
          <Route
            path="/mytasks"
            element={user ? <MemberDashboard userId={user._id} /> : <Navigate to="/login" />}
          />

          {/* ✅ Catch-all Redirect */}
          <Route
            path="*"
            element={<Navigate to={user ? '/dashboard' : '/login'} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
