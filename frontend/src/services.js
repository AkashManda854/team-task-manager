import api from './api';

// Auth services
export const authService = {
  signup: async (name, email, password, role = 'Member') => {
    const response = await api.post('/auth/signup', { name, email, password, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem('user'));
  },

  searchUsers: async (query) => {
    const response = await api.get(`/auth/search?query=${encodeURIComponent(query)}`);
    return response.data;
  },
};

// Project services
export const projectService = {
  createProject: async (name, description) => {
    const response = await api.post('/projects', { name, description });
    return response.data;
  },

  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },

  getProjectById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  editProject: async (id, name, description) => {
    const response = await api.put(`/projects/${id}`, { name, description });
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  addMember: async (projectId, memberEmail) => {
    const response = await api.put('/projects/add-member', { projectId, memberEmail });
    return response.data;
  },

  removeMember: async (projectId, memberId) => {
    const response = await api.put('/projects/remove-member', { projectId, memberId });
    return response.data;
  },
};

// Task services
export const taskService = {
  createTask: async (title, description, assignedTo, projectId, dueDate) => {
    const response = await api.post('/tasks', {
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
    });
    return response.data;
  },

  getTasks: async (projectId = null, status = null) => {
    let url = '/tasks';
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId);
    if (status) params.append('status', status);
    if (params.toString()) url += '?' + params.toString();
    const response = await api.get(url);
    return response.data;
  },

  updateTask: async (id, status, description, dueDate) => {
    const response = await api.put(`/tasks/${id}`, { status, description, dueDate });
    return response.data;
  },

  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
};
