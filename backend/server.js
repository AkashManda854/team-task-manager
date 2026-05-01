const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Try to connect to database (optional for demo mode)
const connectDB = require('./config/db');
const startServer = async () => {
  try {
    await connectDB();
    global.demoMode = false;
  } catch (error) {
    console.log('⚠️  Running in DEMO MODE - Using in-memory storage');
    global.demoMode = true;
  }

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

const app = express();
// Initialize in-memory database for demo mode
require('./config/inMemoryDB');
global.demoMode = true; // Enable demo mode immediately

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

startServer();

module.exports = app;
