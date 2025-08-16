"use client";

import { useState, useEffect, useCallback } from 'react';
import { Post, User } from '@/types';
import { likePost, unlikePost, addComment, getComments, isPostLikedByUser } from '@/services/posts';
import { getUser } from '@/services/user';
import { useAuthStore } from '@/stores/authStore';
import { formatDistanceToNow } from '@/lib/utils';

interface PostCardProps {
  post: Post;
  onUpdate?: (updatedPost: Post) => void;
}

interface Comment {
  _id: string;
  content: string;
  authorId: string;
  createdAt: string;
}

export default function PostCard({ post }: PostCardProps) {
  const { user } = useAuthStore(); // Get current user
  const [author, setAuthor] = useState<User | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [commentCount, setCommentCount] = useState(post.commentCount);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  const loadAuthor = useCallback(async () => {
    try {
      const authorData = await getUser(post.authorId);
      setAuthor(authorData);
    } catch (error) {
      console.error('Failed to load author:', error);
    }
  }, [post.authorId]);

  useEffect(() => {
    loadAuthor();
    if (user) {
      checkLikeStatus();
    }
  }, [loadAuthor, post._id, user]); // Include user as dependency

  const checkLikeStatus = async () => {
    try {
      const { isLiked: liked } = await isPostLikedByUser(post._id, user?._id);
      setIsLiked(liked);
    } catch (error) {
      console.error('Failed to check like status:', error);
      // If API fails, assume not liked
      setIsLiked(false);
    }
  };

  const loadComments = async () => {
    if (isLoadingComments) return;
    setIsLoadingComments(true);
    try {
      const commentsData = await getComments(post._id);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLike = async () => {
    try {
      if (isLiked) {
        await unlikePost(post._id);
        setIsLiked(false);
        setLikeCount(prev => prev - 1);
      } else {
        await likePost(post._id);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim() || isSubmittingComment) return;
    
    setIsSubmittingComment(true);
    try {
      const comment = await addComment(post._id, newComment);
      setComments(prev => [...prev, comment]);
      setCommentCount(prev => prev + 1);
      setNewComment('');
      if (!showComments) {
        setShowComments(true);
      }
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      loadComments();
    }
    setShowComments(!showComments);
  };

  const authorInitial = (author?.displayName || author?.username || 'U')[0].toUpperCase();

  return (
    <article className="post-card">
      {/* Post Header */}
      <header className="post-header">
        <div className="author-info">
          {author?.avatarUrl ? (
            <img
              src={author.avatarUrl}
              alt={`${author.username}'s avatar`}
              className="author-avatar"
            />
          ) : (
            <div className="author-placeholder">
              {authorInitial}
            </div>
          )}
          <div className="author-details">
            <h3 className="author-name">
              {author?.displayName || author?.username}
            </h3>
            <time className="post-time">
              {formatDistanceToNow(post.createdAt)}
            </time>
          </div>
        </div>
        <button className="post-menu">⋯</button>
      </header>

      {/* Post Content */}
      <div className="post-content">
        <p className="post-caption">{post.caption}</p>
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div className="post-media">
            {post.mediaUrls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Post media ${index + 1}`}
                className="post-image"
              />
            ))}
          </div>
        )}
      </div>

      {/* Post Actions */}
      <div className="post-actions">
        <button
          className={`action-btn ${isLiked ? 'liked' : ''}`}
          onClick={handleLike}
        >
          <span className="action-icon">{isLiked ? '❤️' : '🤍'}</span>
          <span className="action-count">{likeCount}</span>
        </button>
        
        <button className="action-btn" onClick={toggleComments}>
          <span className="action-icon">💬</span>
          <span className="action-count">{commentCount}</span>
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="comments-section">
          <div className="add-comment">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              className="comment-input"
            />
            <button
              onClick={handleComment}
              disabled={!newComment.trim() || isSubmittingComment}
              className="comment-submit"
            >
              {isSubmittingComment ? '...' : 'Post'}
            </button>
          </div>

          {isLoadingComments ? (
            <div className="comments-loading">Loading comments...</div>
          ) : (
            <div className="comments-list">
              {comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <span className="comment-author">@{comment.authorId}</span>
                  <span className="comment-text">{comment.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .post-card {
          background: var(--bg-elevated);
          border-radius: var(--card-radius);
          margin-bottom: 24px;
          overflow: hidden;
          box-shadow: var(--shadow-soft);
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
        }

        .author-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--fw-bold);
          color: var(--text-default);
        }

        .author-name {
          margin: 0;
          font-size: var(--fs-body-15);
          font-weight: var(--fw-demi);
        }

        .post-time {
          font-size: var(--fs-body-12);
          color: var(--text-muted);
        }

        .post-menu {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 18px;
          color: var(--text-muted);
          padding: 8px;
          border-radius: 50%;
        }

        .post-menu:hover {
          background: var(--surface);
        }

        .post-content {
          padding: 0 16px;
        }

        .post-caption {
          margin: 0 0 16px 0;
          line-height: var(--lh-body-15);
        }

        .post-media {
          margin-bottom: 16px;
        }

        .post-image {
          width: 100%;
          max-height: 400px;
          object-fit: cover;
          border-radius: 8px;
        }

        .post-actions {
          display: flex;
          gap: 16px;
          padding: 16px;
          border-top: 1px solid var(--surface);
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: none;
          border: none;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
          color: var(--text-default);
        }

        .action-btn:hover {
          background: var(--surface);
        }

        .action-btn.liked {
          color: var(--color-error-red);
        }

        .action-icon {
          font-size: 18px;
        }

        .action-count {
          font-size: var(--fs-body-15);
          font-weight: var(--fw-demi);
        }

        .comments-section {
          border-top: 1px solid var(--surface);
          padding: 16px;
        }

        .add-comment {
          display: flex;
          gap: 12px;
          margin-bottom: 16px;
        }

        .comment-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid var(--surface);
          border-radius: 20px;
          background: var(--surface);
          font-size: var(--fs-body-15);
        }

        .comment-submit {
          padding: 8px 16px;
          background: var(--brand-primary);
          color: white;
          border: none;
          border-radius: 20px;
          cursor: pointer;
          font-weight: var(--fw-demi);
        }

        .comment-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .comments-loading {
          color: var(--text-muted);
          text-align: center;
          padding: 16px;
        }

        .comment {
          margin-bottom: 8px;
          padding: 8px 0;
        }

        .comment-author {
          font-weight: var(--fw-demi);
          color: var(--brand-primary);
          margin-right: 8px;
        }

        .comment-text {
          color: var(--text-default);
        }
      `}</style>
    </article>
  );
}
