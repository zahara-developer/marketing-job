import Role from '../models/Role.js';

export const getRoles = async (_req, res) => {
  try {
    const roles = await Role.find().sort({ createdAt: 1 });
    res.status(200).json(roles);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch roles.' });
  }
};
