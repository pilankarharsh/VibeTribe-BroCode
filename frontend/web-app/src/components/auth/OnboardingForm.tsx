"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { updateProfile } from "@/services/user";
import AvatarUploader from "./avatarUploader";
import { processAndUploadAvatar } from "@/lib/uploads";

type Step = 1 | 2 | 3;

export default function OnboardForm() {
  const router = useRouter();
  const { setLoading, setOnboarded, user, token } = useAuthStore();
  
  // Debug auth state
  console.log('🔐 Auth state:', {
    hasUser: !!user,
    userId: user?._id,
    hasToken: !!token,
    tokenLength: token?.length,
    tokenPreview: token ? `${token.substring(0, 20)}...` : null
  });

  const [step, setStep] = useState<Step>(1);
  const [displayName, setDisplayName] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // store raw file
  const [avatarUrl, setAvatarUrl] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState<"" | "male" | "female" | "other" | "prefer-not-to-say">("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isCropping, setIsCropping] = useState(false);

  const canContinueStep1 = useMemo(() => displayName.trim().length > 0, [displayName]);
  const canContinueStep2 = useMemo(() => !isCropping, [isCropping]);
  const canFinish = useMemo(() => {
    if (!dob || !gender) return false;
    
    // Check if user is at least 16 years old
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 16;
    }
    return age >= 16;
  }, [dob, gender]);

  const userIdFromToken = useMemo(() => {
    if (!token) {
      console.warn('⚠️ No token available for user ID extraction');
      return null;
    }
    try {
      const parts = token.split(".");
      console.log('🔍 Token parts:', parts.length);
      const part = parts[1];
      if (!part) {
        console.warn('⚠️ Token missing payload part');
        return null;
      }
      const json = JSON.parse(atob(part.replace(/-/g, "+").replace(/_/g, "/")));
      console.log('📝 Decoded token payload:', json);
      const userId = json?.id ?? null;
      console.log('🆔 Extracted userId:', userId);
      return userId;
    } catch (error) {
      console.error('❌ Token decoding failed:', error);
      return null;
    }
  }, [token]);

  const step2 = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!canContinueStep1) {
        setError("Please enter your fullname");
        return;
      }
      console.log("✅ Step 1 completed, moving to Step 2");
      setStep(2);
    },
    [canContinueStep1]
  );

  const step3 = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      
      // If user selected an avatar, upload it first
      if (avatarFile) {
        console.log("📤 Starting avatar upload...");
        try {
          setIsUploading(true);
          const id = user?._id || userIdFromToken;
          console.log("🆔 Uploading for userId:", id);

          const url = await processAndUploadAvatar(avatarFile, id);
          setAvatarUrl(url);
          console.log("✅ Avatar uploaded successfully:", url);
        } catch (err) {
          console.error("❌ Avatar upload failed:", err);
          const errorMessage = err instanceof Error ? err.message : 'Failed to upload avatar';
          setError(errorMessage);
          setIsUploading(false);
          return;
        } finally {
          setIsUploading(false);
        }
      }

      // Move to step 3
      setStep(3);
    },
    [avatarFile, user?._id, userIdFromToken]
  );
  const finish = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const id = user?._id || userIdFromToken;
      if (!id) return;
      
      // Check age validation
      if (!canFinish) {
        setError("You must be at least 16 years old to use this platform.");
        return;
      }
      
      setIsUploading(true);
      setLoading(true);
      setError("");
      console.log("💾 Saving onboarding details...");

      try {
        const payload = {
          displayName: displayName || undefined,
          avatarUrl: avatarUrl || undefined,
          dob,
          gender: gender || undefined,
        };
        console.log("📦 Payload:", payload);
        console.log("🆔 Using userId:", id);
        console.log("🌐 API URL:", `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/'}/api/users/${encodeURIComponent(id)}`);
        await updateProfile(payload, id);
        console.log("✅ Profile updated");
        setOnboarded(true);
        router.replace("/home");
      } catch (err) {
        console.error("❌ Failed to complete onboarding:", err);
        
        // Handle specific error cases
        if (err && typeof err === 'object' && 'response' in err) {
          const response = err.response as { status?: number; data?: { error?: string } };
          if (response?.status === 401) {
            setError("Authentication failed. Please login again.");
          } else if (response?.status === 404) {
            setError("User not found. Please contact support.");
          } else {
            setError(response?.data?.error || "Failed to complete onboarding");
          }
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Failed to complete onboarding';
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
        setIsUploading(false);
      }
    },
    [avatarUrl, displayName, dob, gender, canFinish, router, setLoading, setOnboarded, user?._id, userIdFromToken]
  );

  return (
    <div className="auth-container">
      <div className="auth-copy">
        <h2 className="h2 auth-title">
          Set up your profile
        </h2>
        <p className="body auth-subtitle">
          Tell the tribe a bit about you.
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={step2} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">
              Display name
            </label>
            <input
              className="auth-input"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (error) setError("");
              }}
              placeholder="Your display name for the tribe"
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <button disabled={!canContinueStep1} type="submit" className="btn btn-primary auth-button">
              Continue
            </button>
          </div>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={step3} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">
              Profile Picture (Optional)
            </label>
            {avatarUrl ? (
              <div style={{ textAlign: "center", margin: "1rem 0" }}>
                <img
                  src={avatarUrl}
                  alt="Profile"
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--color-border)"
                  }}
                />
              </div>
            ) : (
              <AvatarUploader
                userId={user?._id || userIdFromToken || "temp-user"}
                onFileSelect={(file) => {
                  console.log("📂 File selected:", file?.name);
                  setAvatarFile(file);
                  setError("");
                }}
                onError={(msg) => setError(msg)}
                onCroppingStateChange={setIsCropping}
              />
            )}
            {error && <p className="auth-error">{error}</p>}
            {!isCropping && (
              <>
                <button disabled={!canContinueStep2 || isUploading} type="submit" className="btn btn-primary auth-button">
                  {isUploading ? "Uploading..." : "Continue"}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary auth-button-secondary" 
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </>
            )}
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={finish} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">Date of birth</label>
            <input 
              className="auth-input" 
              type="date" 
              value={dob} 
              onChange={(e) => setDOB(e.target.value)}
              required
            />
            <label className="auth-input-lable">Gender</label>
            <select 
              className="auth-input" 
              value={gender} 
              onChange={(e) => setGender(e.target.value as "" | "male" | "female" | "other" | "prefer-not-to-say")}
              required
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {error && <p className="auth-error">{error}</p>}
            <button disabled={!canFinish || isUploading} type="submit" className="btn btn-primary auth-button">
              {isUploading ? "Saving..." : "Finish"}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary auth-button-secondary" 
              onClick={() => setStep(2)}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}