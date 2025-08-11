"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { login } from "@/services/login";

export default function LoginForm() {
  const router = useRouter();
  const setLoading = useAuthStore((s) => s.setLoading);
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
      await login({ identifier, password });
      router.replace("/splash");
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div>
        <h2 className="h2" style={{ fontWeight: "var(--fw-bold)" }}>Welcome Back to VibeTribe</h2>
        <p className="body" style={{ color: "var(--color-muted-text)", marginTop: "6px" }}>
          ✨ Feel the vibe. 📱 Scroll with your tribe.
        </p>
      </div>

      {step === 1 && (
        <form onSubmit={onContinue} style={{ width: 360, margin: "16px auto 0" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <label className="body auth-input-lable" style={{ textAlign: "start" }}>Username or email address</label>
            <input
              className="auth-input"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={!identifier} style={{ height: "48px" }}>Continue</button>
            <p className="body" color="var(--color-muted-text)">its your first time to the tribe? <a className="body" style={{ color: "var(--color-info-blue)" }} href="/register">Create account</a></p>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={onSubmit} style={{ width: 360, margin: "16px auto 0" }}>
          <div style={{ display: "grid", gap: 12 }}>
            <label className="body auth-input-lable" style={{ textAlign: "start" }}>Password</label>
            <input
              className="auth-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="body" style={{ color: "var(--color-error-red)" }}>{error}</p>}
            <p className="body" color="var(--color-muted-text)"><a className="body" style={{ color: "var(--color-info-blue)" }} href="#">Forgot your password ?</a> No worries</p>
            <button type="submit" className="btn btn-primary" disabled={!password} style={{ height: "48px" }}>Login</button>
            <button type="button" className="btn btn-secondary" onClick={() => setStep(1)} style={{ height: "40px" }}>Back</button>

          </div>
        </form>
      )}
    </div>
  );
}


