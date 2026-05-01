import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService, authService } from '../services';
import '../styles/projectlist.css';

const ProjectList = ({ projects, user, onRefresh }) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await projectService.createProject(projectName, projectDescription);
      setProjectName('');
      setProjectDescription('');
      setShowCreateForm(false);
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div className="projects-section">
      <div className="projects-header">
        <h2>Your Projects</h2>
        <button
          className="create-project-btn"
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? '✕ Close' : '+ New Project'}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateForm && (
        <form onSubmit={handleCreateProject} className="create-project-form">
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
          />
          <textarea
            placeholder="Project Description (optional)"
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
          />
          <button type="submit">Create Project</button>
        </form>
      )}

      <div className="projects-list">
        {projects.length === 0 ? (
          <p className="no-projects">
            No projects yet. Create one to get started!
          </p>
        ) : (
          projects.map((project) => (
            <div
              key={project._id}
              className="project-card"
              onClick={() => handleProjectClick(project._id)}
            >
              <h3>{project.name}</h3>
              {project.description && <p>{project.description}</p>}
              <div className="project-meta">
                <span className="members-count">{project.members.length} members</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProjectList;
