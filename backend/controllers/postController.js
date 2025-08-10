import Post from '../models/Post.js';
import Like from '../models/Like.js';
import Comment from '../models/Comment.js';
import Report from '../models/Report.js';

export const createPost = async (req, res) => {
  const { caption, mediaUrls } = req.body || {};
  if (!caption) return res.status(400).json({ error: 'Caption required.' });
  try {
    const post = await Post.create({ authorId: req.userId, caption, mediaUrls: mediaUrls || [] });
    return res.status(201).json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post.authorId.toString() !== req.userId) return res.status(401).json({ error: 'Not authenticated.' });
    await Post.deleteOne({ _id: post._id });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const editPost = async (req, res) => {
  const { caption } = req.body || {};
  if (caption === undefined) return res.status(400).json({ error: 'Invalid input.' });
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found.' });
    if (post.authorId.toString() !== req.userId) return res.status(401).json({ error: 'Not authenticated.' });
    post.caption = caption;
    await post.save();
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    try {
      await Like.create({ userId: req.userId, postId: req.params.postId });
    } catch (e) {
      return res.status(400).json({ error: 'Post already liked.' });
    }
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { likeCount: 1 } });
    return res.status(200).json({ message: 'Post liked.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const unlikePost = async (req, res) => {
  try {
    const result = await Like.findOneAndDelete({ userId: req.userId, postId: req.params.postId });
    if (!result) return res.status(400).json({ error: 'Post not liked.' });
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { likeCount: -1 } });
    return res.status(200).json({ message: 'Post unliked.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getPostLikes = async (req, res) => {
  try {
    const likes = await Like.find({ postId: req.params.postId }).populate('userId', '-password');
    const users = likes.map(l => l.userId);
    return res.status(200).json(users);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  const { content } = req.body || {};
  if (!content) return res.status(400).json({ error: 'Content required.' });
  try {
    const comment = await Comment.create({ postId: req.params.postId, authorId: req.userId, content });
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { commentCount: 1 } });
    return res.status(201).json(comment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({ createdAt: 1 });
    return res.status(200).json(comments);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });
    if (comment.authorId.toString() !== req.userId) return res.status(401).json({ error: 'Not authenticated.' });
    await Comment.deleteOne({ _id: comment._id });
    await Post.findByIdAndUpdate(comment.postId, { $inc: { commentCount: -1 } });
    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const editComment = async (req, res) => {
  const { content } = req.body || {};
  if (content === undefined) return res.status(400).json({ error: 'Invalid input.' });
  try {
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Comment not found.' });
    if (comment.authorId.toString() !== req.userId) return res.status(401).json({ error: 'Not authenticated.' });
    comment.content = content;
    await comment.save();
    return res.status(200).json(comment);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export const reportPost = async (req, res) => {
  const reason = (req.body?.reason ?? '').toString().trim();
  if (!reason) return res.status(400).json({ error: 'Reason required.' });
  try {
    try {
      await Report.create({ userId: req.userId, postId: req.params.postId, reason });
    } catch (e) {
      return res.status(400).json({ error: 'Post already reported.' });
    }
    await Post.findByIdAndUpdate(req.params.postId, { $inc: { reportsCount: 1 } });
    return res.status(200).json({ message: 'Post reported.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};


