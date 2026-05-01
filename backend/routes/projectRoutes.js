const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  createProject,
  getProjects,
  getProjectById,
  addMember,
  removeMember,
} = require('../controllers/projectController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Non-parameterized routes must come before /:id routes
router.post('/', roleMiddleware('Admin'), createProject);
router.get('/', getProjects);
router.put('/add-member', roleMiddleware('Admin'), addMember);
router.put('/remove-member', roleMiddleware('Admin'), removeMember);

// Parameterized routes
router.get('/:id', getProjectById);

module.exports = router;
