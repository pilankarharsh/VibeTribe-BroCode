"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import { createPost } from '@/services/posts';
import { useAuthStore } from '@/stores/authStore';

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [caption, setCaption] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleMediaUrlChange = (index: number, value: string) => {
    const newMediaUrls = [...mediaUrls];
    newMediaUrls[index] = value;
    setMediaUrls(newMediaUrls);
  };

  const addMediaUrl = () => {
    setMediaUrls([...mediaUrls, '']);
  };

  const removeMediaUrl = (index: number) => {
    const newMediaUrls = mediaUrls.filter((_, i) => i !== index);
    setMediaUrls(newMediaUrls.length === 0 ? [''] : newMediaUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!caption.trim()) {
      setError('Caption is required');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const filteredMediaUrls = mediaUrls.filter(url => url.trim() !== '');
      
      await createPost({
        caption: caption.trim(),
        mediaUrls: filteredMediaUrls
      });

      // Redirect to home feed after successful post creation
      router.push('/home');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create post';
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const userInitial = (user?.displayName || user?.username || 'U')[0].toUpperCase();

  return (
    <AppLayout>
      <div className="create-page">
        <div className="container">
          <div className="create-container">
            {/* Header */}
            <header className="page-header">
              <h1 className="h2">Create Post</h1>
              <p className="body" style={{ color: 'var(--text-muted)' }}>
                Share your thoughts with the VibeTribe community
              </p>
            </header>

            {/* Form */}
            <form onSubmit={handleSubmit} className="create-form">
              <div className="form-card">
                {/* Author Preview */}
                <div className="author-preview">
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="Your avatar"
                      className="author-avatar"
                    />
                  ) : (
                    <div className="author-placeholder">
                      {userInitial}
                    </div>
                  )}
                  <div className="author-info">
                    <span className="author-name">
                      {user?.displayName || user?.username}
                    </span>
                    <span className="posting-as">Posting as @{user?.username}</span>
                  </div>
                </div>

                {/* Caption Input */}
                <div className="form-group">
                  <label htmlFor="caption" className="form-label">
                    What&apos;s on your mind? *
                  </label>
                  <textarea
                    id="caption"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Share your thoughts, experiences, or moments..."
                    className="caption-input"
                    rows={6}
                    maxLength={2000}
                    required
                  />
                  <div className="character-count">
                    {caption.length}/2000 characters
                  </div>
                </div>

                {/* Media URLs */}
                <div className="form-group">
                  <label className="form-label">
                    Media (Optional)
                  </label>
                  <p className="form-help">
                    Add image URLs to include photos in your post
                  </p>
                  
                  {mediaUrls.map((url, index) => (
                    <div key={index} className="media-input-row">
                      <input
                        type="url"
                        placeholder="https://example.com/image.jpg"
                        value={url}
                        onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                        className="media-input"
                      />
                      {mediaUrls.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMediaUrl(index)}
                          className="remove-media-btn"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                  
                  {mediaUrls.length < 5 && (
                    <button
                      type="button"
                      onClick={addMediaUrl}
                      className="add-media-btn"
                    >
                      ➕ Add another image
                    </button>
                  )}
                </div>

                {/* Preview */}
                {(caption.trim() || mediaUrls.some(url => url.trim())) && (
                  <div className="preview-section">
                    <h3 className="preview-title">Preview</h3>
                    <div className="post-preview">
                      <div className="preview-header">
                        {user?.avatarUrl ? (
                          <img
                            src={user.avatarUrl}
                            alt="Your avatar"
                            className="preview-avatar"
                          />
                        ) : (
                          <div className="preview-placeholder">
                            {userInitial}
                          </div>
                        )}
                        <div>
                          <div className="preview-name">
                            {user?.displayName || user?.username}
                          </div>
                          <div className="preview-time">Just now</div>
                        </div>
                      </div>
                      
                      {caption.trim() && (
                        <p className="preview-caption">{caption}</p>
                      )}
                      
                      {mediaUrls.filter(url => url.trim()).length > 0 && (
                        <div className="preview-media">
                          {mediaUrls
                            .filter(url => url.trim())
                            .map((url, index) => (
                              <img
                                key={index}
                                src={url}
                                alt={`Preview ${index + 1}`}
                                className="preview-image"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <div className="error-message">
                    <p style={{ color: 'var(--color-error-red)' }}>{error}</p>
                  </div>
                )}

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => router.back()}
                    className="btn btn-secondary"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={!caption.trim() || isSubmitting}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish Post'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .create-page {
          padding: 24px 0;
        }

        .create-container {
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

        .create-form {
          width: 100%;
        }

        .form-card {
          background: var(--bg-elevated);
          border-radius: var(--card-radius);
          padding: 24px;
          box-shadow: var(--shadow-soft);
        }

        .author-preview {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--surface);
        }

        .author-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
        }

        .author-placeholder {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--fw-bold);
          color: var(--text-default);
        }

        .author-name {
          display: block;
          font-weight: var(--fw-demi);
          color: var(--text-default);
        }

        .posting-as {
          display: block;
          font-size: var(--fs-body-12);
          color: var(--text-muted);
          margin-top: 2px;
        }

        .form-group {
          margin-bottom: 24px;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          font-weight: var(--fw-demi);
          color: var(--text-default);
        }

        .form-help {
          margin: 0 0 12px 0;
          font-size: var(--fs-body-12);
          color: var(--text-muted);
        }

        .caption-input {
          width: 100%;
          padding: 16px;
          border: 2px solid var(--surface);
          border-radius: 12px;
          background: var(--bg-default);
          font-size: var(--fs-body-15);
          line-height: 1.5;
          resize: vertical;
          min-height: 120px;
          font-family: var(--font-sans);
        }

        .caption-input:focus {
          border-color: var(--brand-primary);
          outline: none;
        }

        .character-count {
          text-align: right;
          font-size: var(--fs-body-12);
          color: var(--text-muted);
          margin-top: 8px;
        }

        .media-input-row {
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
        }

        .media-input {
          flex: 1;
          padding: 12px;
          border: 1px solid var(--surface);
          border-radius: 8px;
          background: var(--bg-default);
          font-size: var(--fs-body-15);
        }

        .media-input:focus {
          border-color: var(--brand-primary);
          outline: none;
        }

        .remove-media-btn {
          background: var(--color-error-red);
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        .remove-media-btn:hover {
          background: #c41e3a;
        }

        .add-media-btn {
          background: var(--surface);
          color: var(--text-default);
          border: 1px dashed var(--text-muted);
          border-radius: 8px;
          padding: 12px 16px;
          cursor: pointer;
          font-size: var(--fs-body-15);
          transition: all 0.2s ease;
          width: 100%;
          margin-top: 8px;
        }

        .add-media-btn:hover {
          border-color: var(--brand-primary);
          color: var(--brand-primary);
        }

        .preview-section {
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--surface);
        }

        .preview-title {
          margin: 0 0 16px 0;
          font-size: var(--fs-body-15);
          font-weight: var(--fw-demi);
          color: var(--text-default);
        }

        .post-preview {
          border: 1px solid var(--surface);
          border-radius: 12px;
          padding: 16px;
          background: var(--bg-default);
        }

        .preview-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .preview-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }

        .preview-placeholder {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--surface);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: var(--fw-bold);
          font-size: 12px;
          color: var(--text-default);
        }

        .preview-name {
          font-weight: var(--fw-demi);
          font-size: var(--fs-body-15);
        }

        .preview-time {
          font-size: var(--fs-body-12);
          color: var(--text-muted);
        }

        .preview-caption {
          margin: 0 0 12px 0;
          line-height: 1.5;
        }

        .preview-media {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .preview-image {
          max-width: 100%;
          max-height: 200px;
          border-radius: 8px;
          object-fit: cover;
        }

        .error-message {
          margin: 16px 0;
          padding: 12px;
          background: rgba(224, 36, 36, 0.1);
          border-radius: 8px;
          border: 1px solid var(--color-error-red);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid var(--surface);
        }

        @media (max-width: 768px) {
          .create-page {
            padding: 16px 0;
          }
          
          .create-container {
            padding: 0 16px;
          }

          .form-card {
            padding: 16px;
          }

          .form-actions {
            flex-direction: column-reverse;
          }

          .form-actions button {
            width: 100%;
          }
        }
      `}</style>
    </AppLayout>
  );
}
