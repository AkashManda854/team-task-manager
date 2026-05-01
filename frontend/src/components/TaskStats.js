import React from 'react';
import '../styles/taskstats.css';

const TaskStats = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'Completed').length;
  const pendingTasks = tasks.filter((t) => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter((t) => t.status === 'In Progress').length;
  const overdueTasks = tasks.filter((t) => {
    if (t.status === 'Completed') return false;
    if (!t.dueDate) return false;
    return new Date(t.dueDate) < new Date();
  }).length;

  return (
    <div className="task-stats">
      <div className="stat-card">
        <div className="stat-number">{totalTasks}</div>
        <div className="stat-label">Total Tasks</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{completedTasks}</div>
        <div className="stat-label">Completed</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{pendingTasks}</div>
        <div className="stat-label">Pending</div>
      </div>
      <div className="stat-card">
        <div className="stat-number">{inProgressTasks}</div>
        <div className="stat-label">In Progress</div>
      </div>
      <div className="stat-card warning">
        <div className="stat-number">{overdueTasks}</div>
        <div className="stat-label">Overdue</div>
      </div>
    </div>
  );
};

export default TaskStats;
