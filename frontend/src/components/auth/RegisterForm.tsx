"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { register, checkUsername, checkEmail } from "@/services/register";

type Step = 1 | 2 | 3 | 4;

export default function RegisterForm() {
  const router = useRouter();
  const { setLoading } = useAuthStore();
  const [step, setStep] = useState<Step>(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [hasInvite, setHasInvite] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Input validation functions
  const validateUsername = (input: string): string => {
    // Only allow lowercase letters, numbers, and underscores
    return input.toLowerCase().replace(/[^a-z0-9_]/g, '');
  };

  const validateEmail = (input: string): string => {
    // Only allow lowercase letters, numbers, @, and dots
    return input.toLowerCase().replace(/[^a-z0-9@.]/g, '');
  };

  const isStrongPassword = (pwd: string) : boolean => {
    // At least 8 characters
    if (pwd.length <= 8) return false;
    
    return true;
  };

  const submitUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username) return;
    setLoading(true);
    try {
      const exists = await checkUsername(username);
      if (exists) {
        setError("Username already taken");
        return;
      }
      setStep(2);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check username';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return setError("Email is required");
    setLoading(true);
    try {
      const emailTaken = await checkEmail(email);
      if (emailTaken) {
        setError("Email already exists");
        return;
      }
      setStep(3);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check email';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (password !== confirmPassword) return setError("Passwords do not match");
      if (!isStrongPassword(password)) return setError("Use at least 8 chars with upper, lower, number, and symbol");
      setStep(4);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password Failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register({ username, email, password, inviteCode });
      
      // After registration, user will always need to complete onboarding
      // since they're newly registered
      router.replace("/onboarding");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const joinWaitlist = async () => {
    setError("");
    setLoading(true);
    try {
      await register({ username, email, password, inviteCode: "" });
      // Waitlist join might return different response, handle accordingly
      // Usually waitlist means the user isn't fully registered yet
      router.replace("/waitlist");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join waitlist';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-copy">
        <h1 className="h1 auth-title">You have been <br/>invited 🎉</h1>
        <p className="body auth-subtitle">
          Member of tribe has invited you to join 
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={submitUsername} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">Username</label>
            <input 
              className="auth-input" 
              value={username} 
              onChange={(e) => setUsername(validateUsername(e.target.value))} 
              placeholder="Only lowercase letters, numbers, and underscores"
              required 
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary auth-button">
              Continue
            </button>
            <p className="auth-link">
              Already in the tribe? <a href="/login">Login now</a>
            </p>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitEmail} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">Email</label>
            <input 
              className="auth-input" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(validateEmail(e.target.value))} 
              placeholder="Only lowercase letters, numbers, @ and dots"
              required 
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary auth-button">
              Continue
            </button>
            <button 
              type="button" 
              className="btn btn-secondary auth-button-secondary" 
              onClick={() => setStep(1)}
            >
              Back
            </button>
            <p className="auth-link">
              Already in the tribe? <a href="/login">Login now</a>
            </p>
          </div>
        </form>
      )}
      
      {step === 3 && (
        <form onSubmit={submitPassword} className="auth-form">
          <div className="form-fields">
            <label className="auth-input-lable">Password</label>
            <input 
              className="auth-input" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <label className="auth-input-lable">Confirm Password</label>
            <input 
              className="auth-input" 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="btn btn-primary auth-button">
              Join VibeTribe
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
      
      {step === 4 && (
        <form onSubmit={onRegister} className="auth-form">
          <div className="form-fields">
            <p className="auth-description">
              You need an invite to join. Do you have it?
            </p>
            <div className="button-group">
              <button type="button" className="btn btn-primary" onClick={joinWaitlist}>
                Join waitlist
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setHasInvite(true)}>
                Yes, I have a code
              </button>
            </div>
            {hasInvite && (
              <>
                <label className="auth-input-lable">Invite code</label>
                <input 
                  className="auth-input" 
                  value={inviteCode} 
                  onChange={(e) => setInviteCode(e.target.value)} 
                  required 
                />
                <button type="submit" className="btn btn-primary auth-button">
                  Create account
                </button>
              </>
            )}
            {error && <p className="auth-error">{error}</p>}
            <button 
              type="button" 
              className="btn btn-secondary auth-button-secondary" 
              onClick={() => {
                setStep(3);
                setHasInvite(false);
              }}
            >
              Back
            </button>
          </div>
        </form>
      )}
    </div>
  );
}



