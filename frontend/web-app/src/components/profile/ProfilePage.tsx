"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile } from "@/services/user";
import AppLayout from "@/components/layout/AppLayout";
import AvatarUploader from "@/components/auth/avatarUploader";
import { processAndUploadAvatar } from "@/lib/uploads";

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
      setDob(user.dob || "");
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

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setError("");
    setSuccess("");
    
    if (isEditing) {
      // Reset to original values when canceling
      setDisplayName(user?.displayName || "");
      setEmail(user?.email || "");
      setUsername(user?.username || "");
      setDob(user?.dob || "");
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

  if (!user || !token) {
    // Redirect to login if not authenticated
    router.push("/login");
    return null;
  }

  return (
    <AppLayout>
      <div className="profile-page">
        <div className="container">
          <div className="profile-container">
            {/* Header */}
            <header className="profile-header">
              <h1 className="h2">My Profile</h1>
              <p className="body" style={{ color: 'var(--text-muted)' }}>
                Manage your VibeTribe profile information
              </p>
            </header>

            {/* Profile Card */}
            <div className="profile-card card">
              <form onSubmit={handleSave}>
                <div className="profile-form">
                  {/* Avatar Section */}
                  <div className="avatar-section">
                    <div className="current-avatar">
                      <img
                        src={avatarUrl || "/default-avatar.png"}
                        alt="Profile"
                        className="profile-avatar"
                      />
                    </div>
                    {isEditing && !isCropping && (
                      <div className="avatar-upload">
                        <AvatarUploader
                          userId={user._id}
                          onFileSelect={(file) => {
                            setAvatarFile(file);
                            setError("");
                          }}
                          onError={(msg) => setError(msg)}
                          onCroppingStateChange={setIsCropping}
                        />
                      </div>
                    )}
                  </div>

                  {/* Form Fields */}
                  <div className="form-fields">
                    <div className="field-row">
                      <div className="field">
                        <label className="auth-input-lable">Display Name</label>
                        <input
                          className="auth-input"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          disabled={!isEditing}
                          placeholder="Your display name"
                        />
                      </div>
                      <div className="field">
                        <label className="auth-input-lable">Username</label>
                        <input
                          className="auth-input"
                          value={username}
                          onChange={(e) => setUsername(validateUsername(e.target.value))}
                          disabled={!isEditing}
                          placeholder="Only lowercase letters, numbers, underscores"
                        />
                      </div>
                    </div>

                    <div className="field">
                      <label className="auth-input-lable">Email</label>
                      <input
                        className="auth-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(validateEmail(e.target.value))}
                        disabled={!isEditing}
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="field-row">
                      <div className="field">
                        <label className="auth-input-lable">Date of Birth</label>
                        <input
                          className="auth-input"
                          type="date"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="field">
                        <label className="auth-input-lable">Gender</label>
                        <select
                          className="auth-input"
                          value={gender}
                          onChange={(e) => setGender(e.target.value as "" | "male" | "female" | "other" | "prefer-not-to-say")}
                          disabled={!isEditing}
                        >
                          <option value="">Select gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                          <option value="prefer-not-to-say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Status Messages */}
                  {error && <p className="auth-error">{error}</p>}
                  {success && <p className="success-message">{success}</p>}

                  {/* Action Buttons */}
                  <div className="profile-actions">
                    {!isEditing ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleEditToggle}
                      >
                        Edit Profile
                      </button>
                    ) : (
                      <div className="edit-actions">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isUploading || isCropping}
                        >
                          {isUploading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={handleEditToggle}
                          disabled={isUploading || isCropping}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .profile-page {
          padding: 2rem 0;
          min-height: 100vh;
        }

        .profile-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .profile-header h1 {
          margin-bottom: 0.5rem;
        }

        .profile-card {
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .profile-form {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .current-avatar {
          position: relative;
        }

        .profile-avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid var(--color-border);
          transition: border-color 0.2s ease;
        }

        .profile-avatar:hover {
          border-color: var(--brand-primary);
        }

        .avatar-upload {
          width: 100%;
          max-width: 300px;
        }

        .form-fields {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .field-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .success-message {
          color: var(--color-success-green);
          font-size: var(--fs-body-15);
          margin: 0.5rem 0 0;
          text-align: center;
          padding: 0.75rem;
          background: rgba(46, 204, 113, 0.1);
          border: 1px solid var(--color-success-green);
          border-radius: var(--input-radius);
        }

        .profile-actions {
          display: flex;
          justify-content: center;
          margin-top: 1rem;
        }

        .edit-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .edit-actions .btn {
          min-width: 120px;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .profile-page {
            padding: 1rem 0;
          }

          .profile-card {
            padding: 1.5rem;
            margin: 0 1rem;
          }

          .field-row {
            grid-template-columns: 1fr;
          }

          .edit-actions {
            flex-direction: column;
            width: 100%;
          }

          .edit-actions .btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .profile-header {
            text-align: center;
            padding: 0 1rem;
          }

          .profile-card {
            margin: 0 0.5rem;
            padding: 1rem;
          }

          .profile-avatar {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </AppLayout>
  );
}
