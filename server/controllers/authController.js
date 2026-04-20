import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import jwt from 'jsonwebtoken';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';
import Application from '../models/Application.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsRoot = path.resolve(__dirname, '..', 'uploads', 'resumes');

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET || 'marketing-sales-secret', {
    expiresIn: '7d'
  });

const buildResumeResponse = (resume = {}) => ({
  filename: resume.filename || '',
  originalName: resume.originalName || '',
  filepath: resume.filepath || '',
  mimetype: resume.mimetype || '',
  size: resume.size || 0,
  uploadDate: resume.uploadDate || null
});

const sanitizeUser = (user) => ({
  _id: user._id,
  fullName: user.fullName,
  email: user.email,
  roleInterested: user.roleInterested || '',
  phone: user.phone || '',
  location: user.location || '',
  preferredLocation: user.preferredLocation || '',
  experienceLevel: user.experienceLevel || '',
  currentCompany: user.currentCompany || '',
  bio: user.bio || '',
  skills: Array.isArray(user.skills) ? user.skills : [],
  education: Array.isArray(user.education) ? user.education : [],
  resume: buildResumeResponse(user.resume),
  loginCount: user.loginCount || 0,
  lastLoginAt: user.lastLoginAt || null,
  createdAt: user.createdAt
});

const buildResumePayload = (file) => {
  if (!file) {
    return {
      filename: '',
      originalName: '',
      filepath: '',
      mimetype: '',
      size: 0,
      uploadDate: null
    };
  }

  return {
    filename: file.filename,
    originalName: file.originalname,
    filepath: `/uploads/resumes/${file.filename}`,
    mimetype: file.mimetype,
    size: file.size,
    uploadDate: new Date()
  };
};

const deleteStoredResume = async (resume = {}) => {
  if (!resume?.filename) {
    return;
  }

  const absolutePath = path.resolve(uploadsRoot, resume.filename);

  try {
    await fs.unlink(absolutePath);
  } catch (_error) {
    // Ignore missing files so user updates do not fail on stale paths.
  }
};

export const registerUser = async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message: 'Database connection is not configured. Add MONGODB_URI to enable registration.'
      });
    }

    const { fullName, email, password, roleInterested, experienceLevel } = req.body;

    if (!fullName?.trim() || !email?.trim() || !password?.trim()) {
      await deleteStoredResume(buildResumePayload(req.file));
      return res.status(400).json({ message: 'Full name, email, and password are required.' });
    }

    if (!emailPattern.test(email.trim())) {
      await deleteStoredResume(buildResumePayload(req.file));
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (password.trim().length < 6) {
      await deleteStoredResume(buildResumePayload(req.file));
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const existingUser = await User.findOne({ email: email.trim().toLowerCase() });

    if (existingUser) {
      await deleteStoredResume(buildResumePayload(req.file));
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password.trim(), 10);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      roleInterested: roleInterested?.trim() || '',
      experienceLevel: experienceLevel?.trim() || '',
      resume: buildResumePayload(req.file)
    });

    return res.status(201).json({
      message: 'Registration successful.',
      token: createToken(user._id),
      user: sanitizeUser(user)
    });
  } catch (error) {
    await deleteStoredResume(buildResumePayload(req.file));
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

    const { email, password } = req.body || {};

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
    console.error('loginUser error:', error);
    return res.status(500).json({ message: 'Unable to log in right now.' });
  }
};

export const updateResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please choose a resume file to upload.' });
    }

    await deleteStoredResume(req.user.resume);

    req.user.resume = buildResumePayload(req.file);
    await req.user.save();
    const appliedJobsCount = await Application.countDocuments({ appliedBy: req.user._id });

    return res.status(200).json({
      message: 'Resume uploaded successfully.',
      user: {
        ...sanitizeUser(req.user),
        appliedJobsCount
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to upload resume right now.' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const {
      fullName,
      roleInterested,
      phone,
      location,
      preferredLocation,
      experienceLevel,
      currentCompany,
      bio,
      skills,
      education
    } = req.body || {};

    if (!fullName?.trim()) {
      return res.status(400).json({ message: 'Full name is required.' });
    }

    req.user.fullName = fullName.trim();
    req.user.roleInterested = roleInterested?.trim() || '';
    req.user.phone = phone?.trim() || '';
    req.user.location = location?.trim() || '';
    req.user.preferredLocation = preferredLocation?.trim() || '';
    req.user.experienceLevel = experienceLevel?.trim() || '';
    req.user.currentCompany = currentCompany?.trim() || '';
    req.user.bio = bio?.trim() || '';
    req.user.skills = Array.isArray(skills)
      ? skills.map((skill) => `${skill}`.trim()).filter(Boolean)
      : `${skills || ''}`
          .split(',')
          .map((skill) => skill.trim())
          .filter(Boolean);
    req.user.education = Array.isArray(education)
      ? education
          .map((item) => ({
            degree: item?.degree?.trim?.() || '',
            institution: item?.institution?.trim?.() || '',
            year: item?.year?.trim?.() || '',
            field: item?.field?.trim?.() || '',
            grade: item?.grade?.trim?.() || ''
          }))
          .filter((item) => item.degree || item.institution || item.year || item.field || item.grade)
      : [];

    await req.user.save();
    const appliedJobsCount = await Application.countDocuments({ appliedBy: req.user._id });

    return res.status(200).json({
      message: 'Profile updated successfully.',
      user: {
        ...sanitizeUser(req.user),
        appliedJobsCount
      }
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to update profile right now.' });
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
