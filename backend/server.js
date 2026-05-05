const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize in-memory DB (for demo fallback)
require('./config/inMemoryDB');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Server is running' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error', error: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// DB connection + server start
const connectDB = require('./config/db');

const startServer = async () => {
  try {
    const isConnected = await connectDB();
    global.demoMode = !isConnected;

    if (isConnected) {
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('⚠️ Running in DEMO MODE');
    }
  } catch (error) {
    console.log('⚠️ Running in DEMO MODE');
    global.demoMode = true;
  }

  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();

module.exports = app;