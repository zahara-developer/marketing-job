import jwt from 'jsonwebtoken';
import Connection from '../models/Connection.js';
import User from '../models/User.js';

const selectProfileFields = '_id fullName email roleInterested experienceLevel bio location currentCompany';

const serializeMiniProfile = (user, options = {}) => ({
  _id: user._id,
  fullName: user.fullName || 'Community member',
  roleInterested: user.roleInterested || '',
  experienceLevel: user.experienceLevel || '',
  bio: user.bio || '',
  location: user.location || '',
  currentCompany: user.currentCompany || '',
  initials: (user.fullName || 'User')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join(''),
  isCurrentUser: Boolean(options.isCurrentUser),
  connected: Boolean(options.connected)
});

const getOptionalUserId = (req) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return '';
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'marketing-sales-secret');
    return decoded.id || '';
  } catch (_error) {
    return '';
  }
};

const findConnection = (currentUserId, targetUserId) =>
  Connection.findOne({
    $or: [
      { requester: currentUserId, target: targetUserId },
      { requester: targetUserId, target: currentUserId }
    ]
  });

export const getCommunityUserProfile = async (req, res) => {
  try {
    const viewerId = getOptionalUserId(req);
    const user = await User.findById(req.params.userId).select(selectProfileFields);

    if (!user) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    const isCurrentUser = viewerId && viewerId === user._id.toString();
    const connection = viewerId && !isCurrentUser
      ? await findConnection(viewerId, user._id)
      : null;

    return res.status(200).json({
      profile: serializeMiniProfile(user, {
        isCurrentUser,
        connected: Boolean(connection)
      })
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to load this profile right now.' });
  }
};

export const connectToUser = async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.userId) {
      return res.status(400).json({ message: 'You are already connected to yourself.' });
    }

    const targetUser = await User.findById(req.params.userId).select(selectProfileFields);

    if (!targetUser) {
      return res.status(404).json({ message: 'User profile not found.' });
    }

    const existingConnection = await findConnection(req.user._id, targetUser._id);

    if (existingConnection) {
      return res.status(200).json({
        message: 'You are already connected with this user.',
        connection: {
          status: existingConnection.status,
          target: serializeMiniProfile(targetUser, { connected: true })
        }
      });
    }

    await Connection.create({
      requester: req.user._id,
      target: targetUser._id,
      status: 'connected'
    });

    return res.status(201).json({
      message: `You are now connected with ${targetUser.fullName}.`,
      connection: {
        status: 'connected',
        target: serializeMiniProfile(targetUser, { connected: true })
      }
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to connect right now.' });
  }
};

export const getMyConnections = async (req, res) => {
  try {
    const connections = await Connection.find({
      $or: [{ requester: req.user._id }, { target: req.user._id }]
    })
      .populate('requester', selectProfileFields)
      .populate('target', selectProfileFields)
      .sort({ updatedAt: -1 });

    const people = connections
      .map((connection) => {
        const otherUser =
          connection.requester?._id?.toString() === req.user._id.toString()
            ? connection.target
            : connection.requester;

        if (!otherUser) {
          return null;
        }

        return serializeMiniProfile(otherUser, { connected: true });
      })
      .filter(Boolean);

    return res.status(200).json({ connections: people });
  } catch (_error) {
    return res.status(500).json({ message: 'Unable to load your connections right now.' });
  }
};
