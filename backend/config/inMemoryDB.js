// In-Memory Database for Demo Mode
// This is used when MongoDB is not available

class InMemoryDB {
  constructor() {
    this.users = [];
    this.projects = [];
    this.tasks = [];
    this.nextUserId = 1;
    this.nextProjectId = 1;
    this.nextTaskId = 1;
  }

  // User methods
  createUser(userData) {
    const user = {
      _id: this.nextUserId.toString(),
      ...userData,
      password: userData.password, // In real app, this would be hashed
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    this.nextUserId++;
    return user;
  }

  findUserByEmail(email) {
    return this.users.find((u) => u.email === email);
  }

  findUserById(id) {
    return this.users.find((u) => u._id === id);
  }

  // Project methods
  createProject(projectData) {
    const project = {
      _id: this.nextProjectId.toString(),
      ...projectData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.projects.push(project);
    this.nextProjectId++;
    return project;
  }

  findProjectById(id) {
    return this.projects.find((p) => p._id === id);
  }

  findProjectsByMember(userId) {
    return this.projects.filter((p) =>
      p.members.includes(userId) || p.createdBy === userId
    );
  }

  updateProject(id, updates) {
    const project = this.findProjectById(id);
    if (project) {
      Object.assign(project, updates, { updatedAt: new Date() });
    }
    return project;
  }

  // Task methods
  createTask(taskData) {
    const task = {
      _id: this.nextTaskId.toString(),
      ...taskData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tasks.push(task);
    this.nextTaskId++;
    return task;
  }

  findTaskById(id) {
    return this.tasks.find((t) => t._id === id);
  }

  findTasksByProject(projectId) {
    return this.tasks.filter((t) => t.projectId === projectId);
  }

  findTasksByUser(userId) {
    return this.tasks.filter((t) => t.assignedTo === userId);
  }

  updateTask(id, updates) {
    const task = this.findTaskById(id);
    if (task) {
      Object.assign(task, updates, { updatedAt: new Date() });
    }
    return task;
  }

  deleteTask(id) {
    const index = this.tasks.findIndex((t) => t._id === id);
    if (index > -1) {
      this.tasks.splice(index, 1);
      return true;
    }
    return false;
  }

  deleteProject(id) {
    const index = this.projects.findIndex((p) => p._id === id);
    if (index > -1) {
      this.projects.splice(index, 1);
      // Also delete associated tasks
      this.tasks = this.tasks.filter((t) => t.projectId !== id);
      return true;
    }
    return false;
  }
}

// Global database instance
global.db = new InMemoryDB();

console.log('✅ In-Memory Database initialized for DEMO MODE');

module.exports = global.db;
