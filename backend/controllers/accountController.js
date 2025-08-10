import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body || {};
  if (!oldPassword || !newPassword) return res.status(400).json({ error: 'Invalid input.' });
  try {
    const user = await User.findById(req.userId);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) return res.status(400).json({ error: 'Incorrect old password.' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).json({ message: 'Password changed.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.deleteOne({ _id: req.userId });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


