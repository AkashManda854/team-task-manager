import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService, projectService, taskService } from '../services';
import ProjectList from '../components/ProjectList';
import TaskStats from '../components/TaskStats';
import '../styles/dashboard.css';

const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsRes, tasksRes] = await Promise.all([
        projectService.getProjects(),
        taskService.getTasks(),
      ]);
      setProjects(projectsRes.projects || []);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Dashboard</h1>
          <div className="user-info">
            <span>Welcome, {user.name}</span>
            <span className="role-badge">{user.role}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="dashboard-main">
        {error && <div className="error-message">{error}</div>}

        <TaskStats tasks={tasks} />

        <div className="dashboard-content">
          <ProjectList projects={projects} user={user} onRefresh={fetchData} />
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
