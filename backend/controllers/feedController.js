import Post from '../models/Post.js';
import Follow from '../models/Follow.js';

export const getHomeFeed = async (req, res) => {
  try {
    const following = await Follow.find({ followerId: req.userId }).select('followedId');
    const ids = following.map(f => f.followedId);
    // Demote posts with higher reportsCount by sorting with a penalty
    const posts = await Post.find({ authorId: { $in: ids } })
      .sort({ reportsCount: 1, createdAt: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getExploreFeed = async (_req, res) => {
  try {
    const posts = await Post.find().sort({ reportsCount: 1, likeCount: -1, createdAt: -1 }).limit(50);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


