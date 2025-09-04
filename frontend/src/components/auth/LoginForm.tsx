"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { login } from "@/services/login";

export default function LoginForm() {
  const router = useRouter();
  const { setLoading } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>("");

  const onContinue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return;
    setStep(2);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier || !password) return;
    setError("");
    setLoading(true);
    try {
      const result = await login({ identifier, password });
      
      // Check if user has completed onboarding
      const user = result.user;
      const isOnboarded = user?.displayName && user?.dob && user?.gender;
      
      // Set loading to false before redirecting to avoid the infinite loading state
      setLoading(false);
      
      if (isOnboarded) {
        router.replace("/home"); // Go to home if onboarding is complete
      } else {
        router.replace("/onboarding"); // Go to onboarding if incomplete
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-copy">
        <h2 className="h2 auth-title">Welcome Back to VibeTribe 👋</h2>
        <p className="body auth-subtitle">
          Your tribe is waiting to vibe.
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={onContinue} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">Username or email address</label>
            <input
              className="auth-input"
              type="text"
              pattern="[a-z0-9@*"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary auth-button" disabled={!identifier}>
              Sign In
            </button>
            <p className="auth-link">
              New here? <a href="/register">Create account</a>
            </p>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onSubmit} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="auth-error">{error}</p>}
            <p className="auth-link">
              <a href="#">Forgot your password?</a> Don’t worry, it happens.
            </p>
            <button type="submit" className="btn btn-primary auth-button" disabled={!password}>
              Login
            </button>
            <button 
              type="button" 
              className="btn btn-secondary auth-button-secondary" 
              onClick={() => setStep(1)}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}


