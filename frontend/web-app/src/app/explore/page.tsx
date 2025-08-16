"use client";

import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PostCard from '@/components/posts/PostCard';
import { getExploreFeed } from '@/services/feed';
import { searchUsers } from '@/services/social';
import { Post, User } from '@/types';
import { useCallback } from 'react';

export default function ExplorePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadExploreFeed();
  }, []);

  const loadExploreFeed = async () => {
    try {
      setIsLoadingPosts(true);
      const feedPosts = await getExploreFeed();
      setPosts(feedPosts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load explore feed';
      setError(errorMessage);
    } finally {
      setIsLoadingPosts(false);
    }
  };

  const searchUsersAsync = useCallback(async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setIsLoadingUsers(true);
      const searchResults = await searchUsers(query);
      setUsers(searchResults);
    } catch (err) {
      console.error('Search failed:', err);
      setUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  }, []);

  // Create a debounced version using useCallback and setTimeout
  const debouncedSearch = useCallback((() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => searchUsersAsync(query), 500);
    };
  })(), [searchUsersAsync]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (activeTab === 'users') {
      debouncedSearch(query);
    }
  };

  const handleTabChange = (tab: 'posts' | 'users') => {
    setActiveTab(tab);
    if (tab === 'users' && searchQuery) {
      debouncedSearch(searchQuery);
    } else if (tab === 'posts') {
      setUsers([]);
    }
  };

  const handlePostUpdate = (updatedPost: Post) => {
    setPosts(prev => prev.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  return (
    <AppLayout>
      <div className="explore-page">
        <div className="container">
          <div className="explore-container">
            {/* Header */}
            <header className="page-header">
              <h1 className="h2">Explore</h1>
              <p className="body" style={{ color: 'var(--text-muted)' }}>
                Discover trending content and new people
              </p>
            </header>

            {/* Search Bar */}
            <div className="search-section">
              <div className="search-input-container">
                <input
                  type="text"
                  placeholder="Search for users or content..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="search-input"
                />
                <span className="search-icon">🔍</span>
              </div>
            </div>

            {/* Tabs */}
            <div className="tabs-container">
              <button
                className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => handleTabChange('posts')}
              >
                <span className="tab-icon">📝</span>
                Posts
              </button>
              <button
                className={`tab ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => handleTabChange('users')}
              >
                <span className="tab-icon">👥</span>
                People
              </button>
            </div>

            {/* Content */}
            <div className="content-area">
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div className="posts-section">
                  {isLoadingPosts ? (
                    <div className="loading-state">
                      <div className="loading-spinner">Loading trending posts...</div>
                    </div>
                  ) : error ? (
                    <div className="error-state">
                      <p style={{ color: 'var(--color-error-red)' }}>{error}</p>
                      <button 
                        className="btn btn-secondary" 
                        onClick={loadExploreFeed}
                        style={{ marginTop: '12px' }}
                      >
                        Try again
                      </button>
                    </div>
                  ) : posts.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-content">
                        <h3 className="h3">No posts yet</h3>
                        <p className="body" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                          Be the first to create amazing content!
                        </p>
                      </div>
                    </div>
                  ) : (
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
              )}

              {/* Users Tab */}
              {activeTab === 'users' && (
                <div className="users-section">
                  {!searchQuery ? (
                    <div className="search-prompt">
                      <div className="search-prompt-content">
                        <h3 className="h3">Find people to follow</h3>
                        <p className="body" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                          Type in the search box above to find users by name or username
                        </p>
                      </div>
                    </div>
                  ) : isLoadingUsers ? (
                    <div className="loading-state">
                      <div className="loading-spinner">Searching users...</div>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-content">
                        <h3 className="h3">No users found</h3>
                        <p className="body" style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
                          Try searching with different keywords
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="users-grid">
                      {users.map((user) => (
                        <UserCard key={user._id} user={user} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .explore-page {
          padding: 24px 0;
        }

        .explore-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .page-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .page-header h1 {
          margin: 0;
        }

        .search-section {
          margin-bottom: 24px;
        }

        .search-input-container {
          position: relative;
          max-width: 400px;
          margin: 0 auto;
        }

        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 2px solid var(--surface);
          border-radius: 24px;
          background: var(--bg-elevated);
          font-size: var(--fs-body-15);
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          border-color: var(--brand-primary);
        }

        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 18px;
          color: var(--text-muted);
        }

        .tabs-container {
          display: flex;
          justify-content: center;
          gap: 8px;
          margin-bottom: 32px;
          padding: 0 16px;
        }

        .tab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 24px;
          border: none;
          background: var(--surface);
          color: var(--text-default);
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: var(--font-sans);
          font-weight: var(--fw-demi);
        }

        .tab:hover {
          background: var(--brand-primary);
          color: white;
        }

        .tab.active {
          background: var(--brand-primary);
          color: white;
        }

        .tab-icon {
          font-size: 16px;
        }

        .content-area {
          max-width: 600px;
          margin: 0 auto;
        }

        .loading-state,
        .error-state,
        .empty-state,
        .search-prompt {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 300px;
          text-align: center;
        }

        .empty-content,
        .search-prompt-content {
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

        .users-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
          padding: 0 16px;
        }

        @media (max-width: 768px) {
          .explore-page {
            padding: 16px 0;
          }
          
          .explore-container {
            padding: 0 16px;
          }

          .users-grid {
            grid-template-columns: 1fr;
            padding: 0;
          }

          .tabs-container {
            padding: 0;
          }
        }
      `}</style>
    </AppLayout>
  );
}

function UserCard({ user }: { user: User }) {
  const userInitial = (user.displayName || user.username || 'U')[0].toUpperCase();

  return (
    <div className="user-card">
      <div className="user-avatar-container">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={`${user.username}'s avatar`}
            className="user-avatar"
          />
        ) : (
          <div className="user-avatar-placeholder">
            {userInitial}
          </div>
        )}
      </div>
      
      <div className="user-info">
        <h3 className="user-name">{user.displayName || user.username}</h3>
        <p className="user-handle">@{user.username}</p>
        {user.bio && (
          <p className="user-bio">{user.bio}</p>
        )}
        <div className="user-stats">
          <span>{user.followersCount} followers</span>
          <span>•</span>
          <span>{user.followingCount} following</span>
        </div>
      </div>

      <button className="follow-btn btn btn-primary">
        Follow
      </button>

      <style jsx>{`
        .user-card {
          background: var(--bg-elevated);
          border-radius: var(--card-radius);
          padding: 20px;
          box-shadow: var(--shadow-soft);
          text-align: center;
          transition: transform 0.2s ease;
        }

        .user-card:hover {
          transform: translateY(-2px);
        }

        .user-avatar-container {
          margin-bottom: 16px;
        }

        .user-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
        }

        .user-avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--surface);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--fw-bold);
          font-size: 24px;
          color: var(--text-default);
        }

        .user-name {
          margin: 0 0 4px 0;
          font-size: var(--fs-body-15);
          font-weight: var(--fw-demi);
        }

        .user-handle {
          margin: 0 0 8px 0;
          color: var(--text-muted);
          font-size: var(--fs-body-12);
        }

        .user-bio {
          margin: 0 0 16px 0;
          color: var(--text-default);
          font-size: var(--fs-body-12);
          line-height: 1.4;
        }

        .user-stats {
          margin-bottom: 16px;
          font-size: var(--fs-body-12);
          color: var(--text-muted);
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
        }

        .follow-btn {
          width: 100%;
        }
      `}</style>
    </div>
  );
}
