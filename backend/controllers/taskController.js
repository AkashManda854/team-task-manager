const Task = require('../models/Task');
const Project = require('../models/Project');

const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, projectId, dueDate } = req.body;

    if (!title || !assignedTo || !projectId) {
      return res.status(400).json({ message: 'Please provide title, assignedTo, and projectId' });
    }

    // Demo mode
    if (global.demoMode) {
      const project = global.db.findProjectById(projectId);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.createdBy !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      const task = global.db.createTask({
        title,
        description,
        assignedTo,
        projectId,
        dueDate,
        createdBy: req.user.id,
        status: 'Pending',
      });

      return res.status(201).json({
        message: 'Task created successfully (Demo Mode)',
        task: {
          _id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          assignedTo: { _id: assignedTo, name: 'Team Member' },
          projectId: { _id: projectId, name: 'Project' },
          dueDate: task.dueDate,
          createdBy: { _id: req.user.id, name: req.user.name },
        },
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (!project.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'Assigned user must be a project member' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      projectId,
      dueDate,
      createdBy: req.user.id,
    });

    await task.save();
    await task.populate(['assignedTo', 'createdBy', 'projectId']);

    res.status(201).json({
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    // Demo mode
    if (global.demoMode) {
      let tasks = global.db.tasks;

      if (projectId) {
        tasks = tasks.filter((t) => t.projectId === projectId);
      }

      if (status) {
        tasks = tasks.filter((t) => t.status === status);
      }

      tasks = tasks.filter(
        (t) => t.assignedTo === req.user.id || t.createdBy === req.user.id
      );

      return res.status(200).json({
        message: 'Tasks retrieved successfully (Demo Mode)',
        tasks: tasks.map((t) => ({
          _id: t._id,
          title: t.title,
          description: t.description,
          status: t.status,
          assignedTo: { _id: t.assignedTo, name: 'Team Member' },
          projectId: { _id: t.projectId, name: 'Project' },
          dueDate: t.dueDate,
          createdBy: { _id: t.createdBy, name: 'Creator' },
        })),
      });
    }

    let filter = {};

    if (projectId) {
      filter.projectId = projectId;
    }

    if (status) {
      filter.status = status;
    }

    const projects = await Project.find({ members: req.user.id });
    const projectIds = projects.map((p) => p._id);

    filter.$or = [
      { assignedTo: req.user.id },
      { projectId: { $in: projectIds } },
    ];
    const tasks = await Task.find(filter)
      .populate(['assignedTo', 'createdBy', 'projectId'])
      .sort({ dueDate: 1 });

    res.status(200).json({
      message: 'Tasks retrieved successfully',
      tasks,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, description, dueDate } = req.body;

    // Demo mode
    if (global.demoMode) {
      const task = global.db.findTaskById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      const isCreator = task.createdBy === req.user.id;
      const isAssigned = task.assignedTo === req.user.id;

      if (!isCreator && !isAssigned && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      if (isAssigned && !isCreator && req.user.role !== 'Admin') {
        if (status) task.status = status;
      } else {
        if (status) task.status = status;
        if (description !== undefined) task.description = description;
        if (dueDate !== undefined) task.dueDate = dueDate;
      }

      return res.status(200).json({
        message: 'Task updated successfully (Demo Mode)',
        task: {
          _id: task._id,
          title: task.title,
          description: task.description,
          status: task.status,
          assignedTo: { _id: task.assignedTo, name: 'Team Member' },
          projectId: { _id: task.projectId, name: 'Project' },
          dueDate: task.dueDate,
          createdBy: { _id: task.createdBy, name: 'Creator' },
        },
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const project = await Project.findById(task.projectId);

    // Check if user can update this task
    const isCreator = task.createdBy.toString() === req.user.id;
    const isAssigned = task.assignedTo.toString() === req.user.id;
    const isProjectCreator = project.createdBy.toString() === req.user.id;

    if (!isCreator && !isAssigned && !isProjectCreator && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Members can only update task status
    if (isAssigned && !isCreator && !isProjectCreator && req.user.role !== 'Admin') {
      if (status) {
        task.status = status;
      }
    } else {
      // Creator/Admin can update all fields
      if (status) task.status = status;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
    }

    await task.save();
    await task.populate(['assignedTo', 'createdBy', 'projectId']);

    res.status(200).json({
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    // Demo mode
    if (global.demoMode) {
      const task = global.db.findTaskById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found' });
      }

      if (task.createdBy !== req.user.id && req.user.role !== 'Admin') {
        return res.status(403).json({ message: 'Access denied' });
      }

      global.db.deleteTask(id);

      return res.status(200).json({
        message: 'Task deleted successfully (Demo Mode)',
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Only creator or admin can delete
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Task.findByIdAndDelete(id);

    res.status(200).json({
      message: 'Task deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
