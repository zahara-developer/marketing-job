import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Application from '../models/Application.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'marketing-sales-secret', {
    expiresIn: '7d'
  });

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  roleInterested: user.roleInterested || '',
  experienceLevel: user.experienceLevel || '',
  loginCount: user.loginCount || 0,
  lastLoginAt: user.lastLoginAt || null,
  createdAt: user.createdAt
});

export const registerUser = async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message: 'Database connection is not configured. Add MONGODB_URI to enable registration.'
      });
    }

    const { fullName, email, password, roleInterested, experienceLevel } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      roleInterested: roleInterested?.trim() || '',
      experienceLevel: experienceLevel?.trim() || ''
    });

    return res.status(201).json({
      message: 'Registration successful.',
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to register user right now.' });
  }
};

export const loginUser = async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message: 'Database connection is not configured. Add MONGODB_URI to enable login.'
      });
    }

    const { email, password } = req.body;

    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const passwordMatches = await bcrypt.compare(password.trim(), user.password);

    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    user.loginCount = (user.loginCount || 0) + 1;
    user.lastLoginAt = new Date();
    await user.save();

    return res.status(200).json({
      message: 'Login successful.',
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
};

export const getCurrentUser = async (req, res) => {
  const totalApplications = await Application.countDocuments({ appliedBy: req.user._id });

  return res.status(200).json({
    user: {
      ...sanitizeUser(req.user),
      appliedJobsCount: totalApplications
    }
  });
};

export const getDashboardStats = async (req, res) => {
  try {
    const [aggregateResult, totalUsers] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            totalLoginActivity: { $sum: { $ifNull: ['$loginCount', 0] } }
          }
        }
      ]),
      User.countDocuments()
    ]);

    const totalLoginActivity = aggregateResult[0]?.totalLoginActivity || 0;

    return res.status(200).json({
      stats: {
        totalLoginActivity,
        totalUsers
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to load dashboard stats right now.' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message: 'Database connection is not configured. Add MONGODB_URI to enable password reset.'
      });
    }

    const { email, newPassword } = req.body;

    if (!email?.trim() || !newPassword?.trim()) {
      return res.status(400).json({ message: 'Email and new password are required.' });
    }

    if (!emailPattern.test(email.trim())) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (newPassword.trim().length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: 'No account was found with that email address.' });
    }

    user.password = await bcrypt.hash(newPassword.trim(), 10);
    await user.save();

    return res.status(200).json({ message: 'Password updated successfully. You can log in now.' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to reset password right now.' });
  }
};
