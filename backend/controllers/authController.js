const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '7d',
  });
};

const normalizeRole = (role) => (role === 'Admin' ? 'Admin' : 'Member');

const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userRole = normalizeRole(role);

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email, and password' });
    }

    // Demo mode: use in-memory database
    if (global.demoMode) {
      const existingUser = global.db.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = global.db.createUser({
        name,
        email,
        password: hashedPassword,
        role: userRole,
      });

      const token = generateToken(user._id, user.role);

      return res.status(201).json({
        message: 'User created successfully (Demo Mode)',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // MongoDB mode
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role: userRole,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Demo mode: use in-memory database
    if (global.demoMode) {
      const user = global.db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = generateToken(user._id, user.role);

      return res.status(200).json({
        message: 'Login successful (Demo Mode)',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    // MongoDB mode
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: 'Please provide a search query' });
    }

    // Demo mode
    if (global.demoMode) {
      const users = global.db.users.filter(
        (u) =>
          u.email.toLowerCase().includes(query.toLowerCase()) ||
          u.name.toLowerCase().includes(query.toLowerCase())
      );

      return res.status(200).json({
        message: 'Users found (Demo Mode)',
        users: users
          .filter((u) => u._id !== req.user.id)
          .map((u) => ({
            _id: u._id,
            name: u.name,
            email: u.email,
            role: u.role,
          })),
      });
    }

    // MongoDB mode
    const users = await User.find({
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } },
      ],
      _id: { $ne: req.user.id },
    }).select('_id name email role');

    res.status(200).json({
      message: 'Users found',
      users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login, searchUsers };
