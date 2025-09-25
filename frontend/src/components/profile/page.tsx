"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../stores/authStore';
import { updateProfile } from '../../services/user';
import AvatarUploader from '../auth/avatarUploader';
import { processAndUploadAvatar } from '../../lib/uploads';
import './ProfileLayout.css';

export default function ProfilePage() {
  const router = useRouter();
  const { user, token, setLoading, updateUser } = useAuthStore();
  
  // Form state
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [gender, setGender] = useState<"" | "male" | "female" | "other" | "prefer-not-to-say">(user?.gender || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  // Update local state when user data changes
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setUsername(user.username || "");
      // Convert DOB from Date object to YYYY-MM-DD format for date input
      const dobValue = user.dob ? new Date(user.dob).toISOString().split('T')[0] : "";
      setDob(dobValue);
      setGender(user.gender || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  // Input validation functions
  const validateUsername = (input: string): string => {
    // Only allow lowercase letters, numbers, and underscores
    return input.toLowerCase().replace(/[^a-z0-9_]/g, '');
  };

  const validateEmail = (input: string): string => {
    // Only allow lowercase letters, numbers, @, and dots
    return input.toLowerCase().replace(/[^a-z0-9@.]/g, '');
  };

  // Check if any form fields have changed
  const hasChanges = () => {
    if (!user) return false;
    const originalDob = user.dob ? new Date(user.dob).toISOString().split('T')[0] : "";
    return (
      displayName !== (user.displayName || "") ||
      email !== (user.email || "") ||
      username !== (user.username || "") ||
      dob !== originalDob ||
      gender !== (user.gender || "") ||
      avatarFile !== null // Avatar file selection counts as a change
    );
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    
    if (isEditing) {
      // Reset to original values when canceling
      setDisplayName(user?.displayName || "");
      setEmail(user?.email || "");
      setUsername(user?.username || "");
      // Convert DOB from Date object to YYYY-MM-DD format for date input
      const dobValue = user?.dob ? new Date(user.dob).toISOString().split('T')[0] : "";
      setDob(dobValue);
      setGender(user?.gender || "");
      setAvatarUrl(user?.avatarUrl || "");
      setAvatarFile(null);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setError("");
    setSuccess("");
    setIsUploading(true);
    setLoading(true);

    try {
      let finalAvatarUrl = avatarUrl;

      // Upload new avatar if selected
      if (avatarFile) {
        try {
          finalAvatarUrl = await processAndUploadAvatar(avatarFile, user._id);
          setAvatarUrl(finalAvatarUrl);
        } catch (err) {
          console.error("Avatar upload failed:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
          setError(errorMessage);
          return;
        }
      }

      // Update profile
      const payload = {
        displayName: displayName || undefined,
        email: email || undefined,
        username: username || undefined,
        dob: dob || undefined,
        gender: gender || undefined,
        avatarUrl: finalAvatarUrl || undefined,
      };

      await updateProfile(payload, user._id);
      
      // Update local auth store with validated payload
      const updatedUser = {
        ...user,
        displayName: payload.displayName || user.displayName,
        email: payload.email || user.email,
        username: payload.username || user.username,
        dob: payload.dob || user.dob,
        gender: payload.gender || user.gender,
        avatarUrl: payload.avatarUrl || user.avatarUrl,
      };
      updateUser(updatedUser);

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      setAvatarFile(null);
    } catch (err) {
      console.error("Profile update failed:", err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  // Handle authentication redirect in useEffect to avoid render-time navigation
  useEffect(() => {
    if (!user || !token) {
      router.push("/login");
    }
  }, [user, token, router]);

  if (!user || !token) {
    return null;
  }

  return (
    <div className="profile-layout">
      {/* Sidebar */}
      <div className="profile-sidebar">
        {/* Profile Info */}
        <div className="profile-info">
          <div className="profile-avatar-container">
            <img
              src={avatarUrl || "/default-avatar.png"}
              alt="Profile"
              className="profile-avatar"
            />
            {isEditing && !isCropping && (
              <div className="avatar-upload-overlay">
                <AvatarUploader
                  userId={user._id}
                  onFileSelect={(file) => {
                    setAvatarFile(file);
                    const previewUrl = URL.createObjectURL(file);
                    setAvatarUrl(previewUrl);
                    setError("");
                  }}
                  onError={(msg) => setError(msg)}
                  onCroppingStateChange={setIsCropping}
                />
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <h2 className="profile-name">{user.displayName || user.username}</h2>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-bio">✏️ Add your bio here...</p>
          </div>

          {/* Stats */}
          <div className="profile-stats">
            <div className="stat">
              <span className="stat-number">{user.followersCount || 0}</span>
              <span className="stat-label">followers</span>
            </div>
            <div className="stat">
              <span className="stat-number">{user.followingCount || 0}</span>
              <span className="stat-label">following</span>
            </div>
            <div className="stat">
              <span className="stat-number">0</span>
              <span className="stat-label">posts</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-buttons">
            {!isEditing ? (
              <button className="edit-profile-btn" onClick={handleEditToggle}>
                Edit Profile
              </button>
            ) : (
              <div className="edit-buttons">
                <button 
                  className="save-btn"
                  onClick={handleSave}
                  disabled={isUploading || isCropping || !hasChanges()}
                >
                  {isUploading ? "Saving..." : "Save Changes"}
                </button>
                <button 
                  className="cancel-btn"
                  onClick={handleEditToggle}
                  disabled={isUploading || isCropping}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="profile-nav">
          <div className="nav-item active">
            <span className="nav-icon">👥</span>
            <span className="nav-text">Friends feed</span>
          </div>
          <div className="nav-item">
            <span className="nav-icon">⭐</span>
            <span className="nav-text">Featured Feed</span>
          </div>
          <div className="nav-item logout">
            <span className="nav-icon">🚪</span>
            <span className="nav-text">Logout</span>
          </div>
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <p>Made with love and late nights in Goa</p>
          <p>Version 1.0 (2025)</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="profile-main">
        {isEditing ? (
          <div className="edit-form">
            <h1>Edit Profile</h1>
            
            {/* Form Fields */}
            <form onSubmit={handleSave}>
              <div className="form-grid">
                <div className="field">
                  <label>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Your display name"
                  />
                </div>
                <div className="field">
                  <label>Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(validateUsername(e.target.value))}
                    placeholder="Only lowercase letters, numbers, underscores"
                  />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(validateEmail(e.target.value))}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="field">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as "" | "male" | "female" | "other" | "prefer-not-to-say")}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              {/* Status Messages */}
              {error && <p className="error-message">{error}</p>}
              {success && <p className="success-message">{success}</p>}
            </form>
          </div>
        ) : (
          <div className="feed-content">
            <div className="feed-header">
              <h1>Friends only feed</h1>
              <div className="vibe-logo">
                <span className="logo-icon">🤟</span>
                <span className="logo-text">vibetribe</span>
              </div>
            </div>
            
            <div className="feed-placeholder">
              <p>Something is cooking...👀</p>
              <div className="cooking-animation">
                <span className="hand-icon">🤟</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
