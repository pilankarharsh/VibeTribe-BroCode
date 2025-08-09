import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const changePassword = async (req, res) => {
  const { old_password, new_password } = req.body || {};
  if (!old_password || !new_password) return res.status(400).json({ error: 'Invalid input.' });
  try {
    const user = await User.findById(req.userId);
    const ok = await bcrypt.compare(old_password, user.password);
    if (!ok) return res.status(400).json({ error: 'Incorrect old password.' });
    user.password = await bcrypt.hash(new_password, 10);
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


