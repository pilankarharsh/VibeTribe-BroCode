import User from '../models/User.js';
import Follow from '../models/Follow.js';
import Post from '../models/Post.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.userId !== userId) return res.status(401).json({ error: 'Not authenticated.' });

    const { display_name, bio, avatar_url } = req.body || {};
    if (display_name === undefined && bio === undefined && avatar_url === undefined) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { display_name, bio, avatar_url } },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found.' });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const followUser = async (req, res) => {
  try {
    const targetId = req.params.userId;
    if (req.userId === targetId) return res.status(400).json({ error: 'Invalid input.' });
    try {
      await Follow.create({ follower_id: req.userId, followed_id: targetId });
    } catch (e) {
      return res.status(400).json({ error: 'Already following.' });
    }
    await User.findByIdAndUpdate(targetId, { $inc: { followers_count: 1 } });
    await User.findByIdAndUpdate(req.userId, { $inc: { following_count: 1 } });
    return res.status(200).json({ message: 'Now following user.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.userId;
    const result = await Follow.findOneAndDelete({ follower_id: req.userId, followed_id: targetId });
    if (!result) return res.status(400).json({ error: 'Not following user.' });
    await User.findByIdAndUpdate(targetId, { $inc: { followers_count: -1 } });
    await User.findByIdAndUpdate(req.userId, { $inc: { following_count: -1 } });
    return res.status(200).json({ message: 'Unfollowed user.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const exists = await User.exists({ _id: userId });
    if (!exists) return res.status(404).json({ error: 'User not found.' });
    const followers = await Follow.find({ followed_id: userId }).populate('follower_id', '-password');
    const users = followers.map(f => f.follower_id);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const exists = await User.exists({ _id: userId });
    if (!exists) return res.status(404).json({ error: 'User not found.' });
    const followings = await Follow.find({ follower_id: userId }).populate('followed_id', '-password');
    const users = followings.map(f => f.followed_id);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const searchUsers = async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.status(400).json({ error: 'Query required.' });
  try {
    const regex = new RegExp(q, 'i');
    const users = await User.find({ $or: [{ username: regex }, { display_name: regex }] }).select('-password');
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const checkUsernameExists = async (req, res) => {
  const username = (req.query.username || '').toString().trim();
  if (!username) return res.status(400).json({ error: 'Invalid input.' });
  try {
    const exists = await User.exists({ username });
    return res.status(200).json({ exists: Boolean(exists) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const exists = await User.exists({ _id: userId });
    if (!exists) return res.status(404).json({ error: 'User not found.' });
    const posts = await Post.find({ author_id: userId }).sort({ created_at: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


