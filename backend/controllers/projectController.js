const Project = require('../models/Project');
const User = require('../models/User');

const createProject = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Please provide a project name' });
    }

    // Demo mode
    if (global.demoMode) {
      const project = global.db.createProject({
        name,
        description,
        createdBy: req.user.id,
        members: [req.user.id],
      });

      return res.status(201).json({
        message: 'Project created successfully (Demo Mode)',
        project: {
          _id: project._id,
          name: project.name,
          description: project.description,
          createdBy: {
            _id: req.user.id,
            name: req.user.name,
          },
          members: [
            {
              _id: req.user.id,
              name: req.user.name,
            },
          ],
        },
      });
    }

    const project = new Project({
      name,
      description,
      createdBy: req.user.id,
      members: [req.user.id],
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project: await project.populate(['createdBy', 'members']),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    // Demo mode
    if (global.demoMode) {
      const projects = global.db.findProjectsByMember(req.user.id);
      
      return res.status(200).json({
        message: 'Projects retrieved successfully (Demo Mode)',
        projects: projects.map((p) => ({
          _id: p._id,
          name: p.name,
          description: p.description,
          createdBy: {
            _id: p.createdBy,
            name: 'Admin User',
          },
          members: p.members.map((m) => ({
            _id: m,
            name: 'Team Member',
          })),
        })),
      });
    }

    const projects = await Project.find({
      members: req.user.id,
    }).populate(['createdBy', 'members']);

    res.status(200).json({
      message: 'Projects retrieved successfully',
      projects,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    // Demo mode
    if (global.demoMode) {
      const project = global.db.findProjectById(req.params.id);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (!project.members.includes(req.user.id) && project.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Access denied' });
      }

      return res.status(200).json({
        message: 'Project retrieved successfully (Demo Mode)',
        project: {
          _id: project._id,
          name: project.name,
          description: project.description,
          createdBy: {
            _id: project.createdBy,
            name: 'Admin User',
            _id: project.createdBy,
          },
          members: project.members.map((m) => ({
            _id: m,
            name: 'Team Member',
          })),
        },
      });
    }

    const project = await Project.findById(req.params.id).populate(['createdBy', 'members']);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (!project.members.some((m) => m._id.toString() === req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.status(200).json({
      message: 'Project retrieved successfully',
      project,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addMember = async (req, res) => {
  try {
    const { projectId, memberEmail } = req.body;

    if (!projectId || !memberEmail) {
      return res.status(400).json({ message: 'Please provide projectId and memberEmail' });
    }

    // Demo mode
    if (global.demoMode) {
      const project = global.db.findProjectById(projectId);

      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }

      if (project.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Only project creator can add members' });
      }

      if (project.members.includes(memberEmail)) {
        return res.status(400).json({ message: 'User is already a member' });
      }

      project.members.push(memberEmail);

      return res.status(200).json({
        message: 'Member added successfully (Demo Mode)',
        project: {
          _id: project._id,
          name: project.name,
          description: project.description,
          createdBy: {
            _id: project.createdBy,
            name: 'Admin User',
          },
          members: project.members.map((m) => ({
            _id: m,
            name: 'Team Member',
          })),
        },
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project creator can add members' });
    }

    const member = await User.findOne({ email: memberEmail });

    if (!member) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (project.members.includes(member._id)) {
      return res.status(400).json({ message: 'User is already a member' });
    }

    project.members.push(member._id);
    await project.save();

    res.status(200).json({
      message: 'Member added successfully',
      project: await project.populate(['createdBy', 'members']),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const removeMember = async (req, res) => {
  try {
    const { projectId, memberId } = req.body;

    if (!projectId || !memberId) {
      return res.status(400).json({ message: 'Please provide projectId and memberId' });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only project creator can remove members' });
    }

    project.members = project.members.filter((m) => m.toString() !== memberId);
    await project.save();

    res.status(200).json({
      message: 'Member removed successfully',
      project: await project.populate(['createdBy', 'members']),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createProject, getProjects, getProjectById, addMember, removeMember };
