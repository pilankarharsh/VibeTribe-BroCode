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

    const { displayName, bio, avatarUrl, dob, gender } = req.body || {};
    if (displayName === undefined && bio === undefined && avatarUrl === undefined && dob === undefined && gender === undefined) {
      return res.status(400).json({ error: 'Invalid input.' });
    }

    // Build update object with only defined fields
    const updateFields = {};
    if (displayName !== undefined) updateFields.displayName = displayName;
    if (bio !== undefined) updateFields.bio = bio;
    if (avatarUrl !== undefined) updateFields.avatarUrl = avatarUrl;
    if (dob !== undefined) updateFields.dob = dob;
    if (gender !== undefined) updateFields.gender = gender;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
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
      await Follow.create({ followerId: req.userId, followedId: targetId });
    } catch (e) {
      return res.status(400).json({ error: 'Already following.' });
    }
    await User.findByIdAndUpdate(targetId, { $inc: { followersCount: 1 } });
    await User.findByIdAndUpdate(req.userId, { $inc: { followingCount: 1 } });
    return res.status(200).json({ message: 'Now following user.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const targetId = req.params.userId;
    const result = await Follow.findOneAndDelete({ followerId: req.userId, followedId: targetId });
    if (!result) return res.status(400).json({ error: 'Not following user.' });
    await User.findByIdAndUpdate(targetId, { $inc: { followersCount: -1 } });
    await User.findByIdAndUpdate(req.userId, { $inc: { followingCount: -1 } });
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
    const followers = await Follow.find({ followedId: userId }).populate('followerId', '-password');
    const users = followers.map(f => f.followerId);
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
    const followings = await Follow.find({ followerId: userId }).populate('followedId', '-password');
    const users = followings.map(f => f.followedId);
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
    const users = await User.find({ $or: [{ username: regex }, { displayName: regex }] }).select('-password');
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

export const checkEmailExists = async (req, res) => {
  const email = (req.query.email || '').toString().trim();
  if (!email) return res.status(400).json({ error: 'Invalid input.' });
  try {
    const exists = await User.exists({ email });
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
    const posts = await Post.find({ authorId: userId }).sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


