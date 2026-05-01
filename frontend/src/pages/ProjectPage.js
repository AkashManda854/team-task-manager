import React, { useState, useEffect } from 'react';
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
  const [memberEmail, setMemberEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
    } else {
      setUser(currentUser);
      fetchProjectData();
    }
  }, [projectId, navigate]);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const projectRes = await projectService.getProjectById(projectId);
      setProject(projectRes.project);

      const tasksRes = await taskService.getTasks(projectId);
      setTasks(tasksRes.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await projectService.addMember(projectId, memberEmail);
      setMemberEmail('');
      fetchProjectData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
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
      </header>

      <main className="project-main">
        {error && <div className="error-message">{error}</div>}

        <div className="project-controls">
          <div className="members-section">
            <h3>Project Members ({project.members.length})</h3>
            <div className="members-list">
              {project.members.map((member) => (
                <div key={member._id} className="member-badge">
                  {member.name}
                </div>
              ))}
            </div>

            {isCreator && (
              <form onSubmit={handleAddMember} className="add-member-form">
                <input
                  type="email"
                  placeholder="Add member by email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  required
                />
                <button type="submit">Add Member</button>
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
