import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, taskService, authService } from '../services';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import '../styles/projectpage.css';

const ProjectPage = () => {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const fetchProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const projectRes = await projectService.getProjectById(projectId);
      setProject(projectRes.project);
      setEditName(projectRes.project.name);
      setEditDescription(projectRes.project.description || '');

      const tasksRes = await taskService.getTasks(projectId);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      fetchProjectData();
    }
  }, [fetchProjectData, navigate]);

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectService.addMember(projectId, memberEmail);
      setMemberEmail('');
      setSearchQuery('');
      setSearchResults([]);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleSearchUsers = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const result = await authService.searchUsers(query);
      setSearchResults(result.users || []);
    } catch (err) {
      console.error('Failed to search users');
    } finally {
      setSearching(false);
    }
  };

  const handleSelectUser = (userEmail) => {
    setMemberEmail(userEmail);
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await projectService.removeMember(projectId, memberId);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove member');
    }
  };

  const handleEditProject = async (e) => {
    e.preventDefault();
    try {
      await projectService.editProject(projectId, editName, editDescription);
      setShowEditForm(false);
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update project');
    }
  };

  const handleDeleteProject = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
    try {
      await projectService.deleteProject(projectId);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete project');
    }
  };

  const handleTaskCreated = () => {
    setShowTaskForm(false);
    fetchProjectData();
  };

  const handleTaskUpdated = () => {
    fetchProjectData();
  };

  if (!user || loading) return <div className="loading">Loading...</div>;
  if (!project) return <div className="error-message">Project not found</div>;

  const isCreator = project.createdBy._id === user.id;

  return (
    <div className="project-page">
      <header className="project-header">
        <button onClick={() => navigate('/dashboard')} className="back-btn">
          ← Back to Dashboard
        </button>
        <div className="project-info">
          <h1>{project.name}</h1>
          {project.description && <p>{project.description}</p>}
        </div>
        {isCreator && (
          <div className="project-actions">
            <button
              className="edit-btn"
              onClick={() => setShowEditForm(!showEditForm)}
            >
              ✏️ Edit
            </button>
            <button
              className="delete-btn"
              onClick={handleDeleteProject}
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </header>

      {showEditForm && isCreator && (
        <div className="edit-project-form">
          <h3>Edit Project</h3>
          <form onSubmit={handleEditProject}>
            <input
              type="text"
              placeholder="Project Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
            />
            <textarea
              placeholder="Project Description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setShowEditForm(false)}>Cancel</button>
          </form>
        </div>
      )}

      <main className="project-main">
        {error && <div className="error-message">{error}</div>}

        <div className="project-controls">
          <div className="members-section">
            <h3>Project Members ({project.members.length})</h3>
            <div className="members-list">
              {project.members.map((member) => (
                <div key={member._id} className="member-badge">
                  <span>{member.name}</span>
                  {isCreator && member._id !== project.createdBy._id && (
                    <button
                      className="remove-member-btn"
                      onClick={() => handleRemoveMember(member._id)}
                      title="Remove member"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isCreator && (
              <form onSubmit={handleAddMember} className="add-member-form">
                <div className="search-container">
                  <input
                    type="text"
                    placeholder="Search and add members..."
                    value={searchQuery || memberEmail}
                    onChange={(e) => handleSearchUsers(e.target.value)}
                    required={!memberEmail}
                  />
                  {searchResults.length > 0 && (
                    <div className="search-results">
                      {searchResults.map((u) => (
                        <div
                          key={u._id}
                          className="search-result"
                          onClick={() => handleSelectUser(u.email)}
                        >
                          <strong>{u.name}</strong>
                          <span>{u.email}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {memberEmail && (
                  <button type="submit">Add Member</button>
                )}
              </form>
            )}
          </div>

          {isCreator && (
            <button
              className="create-task-btn"
              onClick={() => setShowTaskForm(!showTaskForm)}
            >
              {showTaskForm ? '✕ Close' : '+ Create Task'}
            </button>
          )}
        </div>

        {showTaskForm && isCreator && (
          <TaskForm
            projectId={projectId}
            projectMembers={project.members}
            onTaskCreated={handleTaskCreated}
          />
        )}

        <TaskList tasks={tasks} user={user} onTaskUpdated={handleTaskUpdated} />
      </main>
    </div>
  );
};

export default ProjectPage;
