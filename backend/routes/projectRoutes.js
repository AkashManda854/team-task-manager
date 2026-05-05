const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  removeMember,
  editProject,
  deleteProject,
} = require('../controllers/projectController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Non-parameterized routes must come before /:id routes
router.post('/', createProject);
router.get('/', getProjects);
router.put('/add-member', addMember);
router.put('/remove-member', removeMember);

// Parameterized routes
router.get('/:id', getProjectById);
router.put('/:id', editProject);
router.delete('/:id', deleteProject);

module.exports = router;
