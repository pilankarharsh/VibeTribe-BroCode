"use client";

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/posts/PostCard';
import { getHomeFeed, getUserPosts } from '@/services/feed';
import { Post } from '@/types';
import { useAuthStore } from '@/stores/authStore';

export default function HomePage() {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadFeed();
  }, [user]); // Re-run when user changes

  const loadFeed = async () => {
    try {
      setIsLoading(true);
      
      // Load both home feed and user's own posts
      const [feedPosts, userPosts] = await Promise.all([
        getHomeFeed(),
        user ? getUserPosts(user._id) : Promise.resolve([])
      ]);
      
      // Combine and sort by creation date (newest first)
      const allPosts = [...feedPosts, ...userPosts]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        // Remove duplicates in case user's posts are already in feed
        .filter((post, index, self) => index === self.findIndex(p => p._id === post._id));
      
      setPosts(allPosts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load feed';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <AppLayout>
      <div className="home-page">
        <div className="container">
          <div className="feed-container">
            {/* Header */}
            <header className="page-header">
              <h1 className="h2">Home Feed</h1>
              <p className="body" style={{ color: 'var(--text-muted)' }}>Latest posts from you and people you follow</p>
            </header>

            {/* Loading State */}
            {isLoading && (
              <div className="loading-state">
                <div className="loading-spinner">Loading your feed...</div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="error-state">
                <p style={{ color: 'var(--color-error-red)' }}>{error}</p>
                <button 
                  className="btn btn-secondary" 
                  onClick={loadFeed}
                  style={{ marginTop: '12px' }}
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && posts.length === 0 && (
              <div className="empty-state">
                <div className="empty-content">
                  <h3 className="h3">Your feed is empty</h3>
                  <p className="body" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                    Start following people to see their posts here!
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => window.location.href = '/explore'}
                    style={{ marginTop: '16px' }}
                  >
                    Explore VibeTribe
                  </button>
                </div>
              </div>
            )}

            {/* Posts Feed */}
            {!isLoading && posts.length > 0 && (
              <div className="posts-feed">
                {posts.map((post) => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    onUpdate={handlePostUpdate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .home-page {
          padding: 24px 0;
        }

        .feed-container {
          max-width: 600px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .page-header h1 {
          margin: 0;
        }

        .loading-state,
        .error-state,
        .empty-state {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          text-align: center;
        }

        .empty-content {
          padding: 32px;
          background: var(--bg-elevated);
          border-radius: var(--card-radius);
          box-shadow: var(--shadow-soft);
        }

        .loading-spinner {
          font-size: var(--fs-body-18);
          color: var(--text-muted);
        }

        .posts-feed {
          display: flex;
          flex-direction: column;
        }

        @media (max-width: 768px) {
          .home-page {
            padding: 16px 0;
          }
          
          .feed-container {
            padding: 0 16px;
          }
        }
      `}</style>
    </AppLayout>
  );
}
