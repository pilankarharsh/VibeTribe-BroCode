"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { register, checkUsername, checkEmail } from "@/services/register";

type Step = 1 | 2 | 3 | 4;

export default function RegisterForm() {
  const router = useRouter();
  const setLoading = useAuthStore((s) => s.setLoading);
  const setOnboarded = useAuthStore((s) => s.setOnboarded);
  const [step, setStep] = useState<Step>(1);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [hasInvite, setHasInvite] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const isStrongPassword = (pwd: string) =>
    /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd) && pwd.length >= 8;

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
    } catch (err: any) {
      setError(err?.message || "Failed to check username");
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
    } catch (err: any) {
      setError(err?.message || "Failed to check email");
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
    } catch (err: any) {
      setError(err?.message || "Password Failed");
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await register({ username, email, password, inviteCode });
      setOnboarded(false);
      router.replace("/splash");
    } catch (err: any) {
      setError(err?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const joinWaitlist = async () => {
    setError("");
    setLoading(true);
    try {
      await register({ username, email, password, inviteCode: "" });
      setOnboarded(false);
      router.replace("/splash");
    } catch (err: any) {
      setError(err?.message || "Failed to join waitlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <h2 className="h2" style={{ fontWeight: "var(--fw-bold)" }}>Join VibeTribe</h2>
        <p className="body" style={{ color: "var(--color-muted-text)", marginTop: "6px" }}>
          Create your account to start vibing.
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={submitUsername} style={{ width: 360, margin: "16px auto 0" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <label className="body auth-input-lable" style={{ textAlign: "start" }}>Username</label>
            <input className="auth-input" value={username} onChange={(e) => setUsername(e.target.value)} required />
            {error && <p className="body" style={{ color: "var(--color-error-red)" }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ height: 48 }}>Continue</button>
            <p className="body" style={{ color: "var(--color-muted-text)" }}>
              Already in the tribe? <a className="body" style={{ color: "var(--color-info-blue)" }} href="/login">Login now</a>
            </p>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={submitEmail} style={{ width: 360, margin: "16px auto 0" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <label className="body auth-input-lable" style={{ textAlign: "start" }}>Email</label>
            <input className="auth-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            {error && <p className="body" style={{ color: "var(--color-error-red)" }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ height: 48 }}>Continue</button>
            <p className="body" style={{ color: "var(--color-muted-text)" }}>
              Already in the tribe? <a className="body" style={{ color: "var(--color-info-blue)" }} href="/login">Login now</a>
            </p>
          </div>
        </form>
      )}
      {step === 3 && (
        <form onSubmit={submitPassword} style={{ width: 360, margin: "16px auto 0" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <label className="body auth-input-lable" style={{ textAlign: "start" }}>Password</label>
            <input className="auth-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <label className="body auth-input-lable" style={{ textAlign: "start" }}>Confirm Password</label>
            <input className="auth-input" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            {error && <p className="body" style={{ color: "var(--color-error-red)" }}>{error}</p>}
            <button type="submit" className="btn btn-primary" style={{ height: 48 }}>Continue</button>
          </div>
        </form>
      )}
      {step === 4 && (
        <form onSubmit={onRegister} style={{ width: 360, margin: "16px auto 0" }}>
          <div style={{ display: "grid", gap: 12, justifyContent:"center" }}>
            <p className="body" style={{ textAlign: "start", color: "var(--text-muted)" }}>
              You need an invite to join. Do you have it?
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent:"center" }}>
              <button type="button" className="btn btn-primary" onClick={joinWaitlist}>join waitlist</button>
              <button type="button" className="btn btn-secondary" onClick={() => setHasInvite(true)}>Yes, I have a code</button>
            </div>
            {hasInvite && (
              <>
                <label className="body auth-input-lable" style={{ textAlign: "start" }}>Invite code</label>
                <input className="auth-input" value={inviteCode} onChange={(e) => setInviteCode(e.target.value)} required />
              </>
            )}
            {error && <p className="body" style={{ color: "var(--color-error-red)" }}>{error}</p>}
            {hasInvite && (
              <button type="submit" className="btn btn-primary" style={{ height: 48 }}>
                Create account
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}



