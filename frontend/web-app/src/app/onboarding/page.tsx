"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/services/login";

export default function OnboardingPage() {
  const router = useRouter();
  const setOnboarded = useAuthStore((s) => s.setOnboarded);

  const completeOnboarding = () => {
    setOnboarded(true);
    router.replace("/splash");
  };

  const tempLogout = async () => {
    try {
      await logout();
    } catch (_) {}
    router.replace("/splash");
  };

  return (
    <main className="flex-center" style={{ minHeight: "100vh", padding: 24 }}>
      <div className="card" style={{ width: 420 }}>
        <h1 className="h2" style={{ marginBottom: 12 }}>Onboarding</h1>
        <p className="body" style={{ marginBottom: 16, color: "var(--text-muted)" }}>
          Placeholder onboarding screen. Click continue to mark onboarding complete.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          <button className="btn btn-primary" onClick={completeOnboarding}>Continue</button>
          <button className="btn btn-secondary" onClick={tempLogout}>Temp logout</button>
        </div>
      </div>
    </main>
  );
}


