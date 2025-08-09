import Post from '../models/Post.js';
import Follow from '../models/Follow.js';

export const getHomeFeed = async (req, res) => {
  try {
    const following = await Follow.find({ follower_id: req.userId }).select('followed_id');
    const ids = following.map(f => f.followed_id);
    // Demote posts with higher reports_count by sorting with a penalty
    const posts = await Post.find({ author_id: { $in: ids } })
      .sort({ reports_count: 1, created_at: -1 });
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getExploreFeed = async (_req, res) => {
  try {
    const posts = await Post.find().sort({ reports_count: 1, like_count: -1, created_at: -1 }).limit(50);
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


