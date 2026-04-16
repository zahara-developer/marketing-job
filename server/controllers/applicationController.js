import Application from '../models/Application.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fallbackApplications = [
  {
    fullName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 12345',
    roleInterested: 'Digital Marketing Specialist',
    experienceLevel: '1-3 Years',
    message: 'Interested in performance marketing and campaign strategy roles.'
  },
  {
    fullName: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+91 99876 45678',
    roleInterested: 'SEO Analyst',
    experienceLevel: 'Fresher',
    message: 'Looking for an entry-level SEO and content optimization opportunity.'
  },
  {
    fullName: 'Daniel Brooks',
    email: 'daniel.brooks@example.com',
    phone: '+91 90909 22334',
    roleInterested: 'Sales Executive',
    experienceLevel: '3-5 Years',
    message: 'Experienced in client acquisition, pipeline management, and closing.'
  }
];

export const getApplications = async (_req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(200).json(fallbackApplications);
    }

    const applications = await Application.find()
      .sort({ createdAt: -1 })
      .select('fullName email phone roleInterested experienceLevel message');

    return res.status(200).json(applications);
  } catch (error) {
    return res.status(200).json(fallbackApplications);
  }
};

export const createApplication = async (req, res) => {
  try {
    if (!process.env.MONGODB_URI) {
      return res.status(503).json({
        message: 'Database connection is not configured. Add MONGODB_URI to enable form submissions.'
      });
    }

    const {
      fullName,
      email,
      phone,
      roleInterested,
      experienceLevel,
      message
    } = req.body;

    if (
      !fullName?.trim() ||
      !email?.trim() ||
      !phone?.trim() ||
      !roleInterested?.trim() ||
      !experienceLevel?.trim() ||
      !message?.trim()
    ) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!emailPattern.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    let appliedBy = null;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'marketing-sales-secret');
        const user = await User.findById(decoded.id).select('_id');
        appliedBy = user?._id || null;
      } catch (_error) {
        appliedBy = null;
      }
    }

    const application = await Application.create({
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      roleInterested: roleInterested.trim(),
      experienceLevel: experienceLevel.trim(),
      message: message.trim(),
      appliedBy
    });

    return res.status(201).json({
      message: 'Application submitted successfully.',
      application
    });
  } catch (error) {
    return res.status(500).json({ message: 'Failed to submit application.' });
  }
};
