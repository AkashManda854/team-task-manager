import React, { useState } from 'react';
import { taskService } from '../services';
import '../styles/tasklist.css';

const TaskList = ({ tasks, user, onTaskUpdated }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [error, setError] = useState('');

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTask(taskId, newStatus, undefined, undefined);
      onTaskUpdated();
      setEditingTaskId(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(taskId);
        onTaskUpdated();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete task');
      }
    }
  };

  const isOverdue = (task) => {
    if (task.status === 'Completed') return false;
    if (!task.dueDate) return false;
    return new Date(task.dueDate) < new Date();
  };

  const formatDate = (date) => {
    if (!date) return 'No due date';
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="tasks-section">
      <h2>Tasks</h2>
      {error && <div className="error-message">{error}</div>}

      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks yet.</p>
      ) : (
        <div className="tasks-list">
          {tasks.map((task) => (
            <div
              key={task._id}
              className={`task-card ${task.status.toLowerCase().replace(' ', '-')} ${
                isOverdue(task) ? 'overdue' : ''
              }`}
            >
              <div className="task-header">
                <h3>{task.title}</h3>
                <span className={`status-badge ${task.status.toLowerCase().replace(' ', '-')}`}>
                  {task.status}
                </span>
              </div>

              {task.description && <p className="task-description">{task.description}</p>}

              <div className="task-meta">
                <span className="assigned-to">
                  Assigned to: {task.assignedTo.name}
                </span>
                <span
                  className={`due-date ${isOverdue(task) ? 'overdue' : ''}`}
                >
                  {formatDate(task.dueDate)}
                </span>
              </div>

              <div className="task-actions">
                {editingTaskId === task._id ? (
                  <div className="status-select">
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <button
                      className="save-btn"
                      onClick={() => handleStatusChange(task._id, editStatus)}
                    >
                      Save
                    </button>
                    <button
                      className="cancel-btn"
                      onClick={() => setEditingTaskId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingTaskId(task._id);
                        setEditStatus(task.status);
                      }}
                    >
                      Change Status
                    </button>
                    {(task.createdBy._id === user.id || user.role === 'Admin') && (
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
