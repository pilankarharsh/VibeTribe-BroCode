"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function SplashPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const maxTimeoutId = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    const quickCheckId = setTimeout(() => {
      const { token, user, setLoading } = useAuthStore.getState();
      
      setLoading(false);
      
      // Clear the max timeout since we're handling routing now
      clearTimeout(maxTimeoutId);
      
      let nextPath: string;
      
      if (!token) {
        nextPath = "/register";
      } else if (!user) {
        nextPath = "/register"; 
      } else {
        const hasDisplayName = !!user.displayName;
        const hasDob = !!user.dob;
        const hasGender = !!user.gender;
        const isOnboarded = hasDisplayName && hasDob && hasGender;
        
        if (isOnboarded) {
          nextPath = "/home";
        } else {
          nextPath = "/onboarding";
        }
      }
      
      router.replace(nextPath);
    }, 1000); // 1 second delay

    return () => {
      clearTimeout(maxTimeoutId);
      clearTimeout(quickCheckId);
    };
  }, [router]);

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <main
        className="flex-center"
        style={{
          flex: 1,
          flexDirection: "column",
          gap: "12px",
          padding: "24px",
        }}
      >
        <img src="/logo.svg" alt="Vibe Tribe" style={{ width: "100px" }} />
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span className="h1">Vibe</span>
          <span className="h1">Tribe</span>
        </div>
        <svg
          width="44"
          height="44"
          viewBox="0 0 50 50"
          role="img"
          aria-label="Loading"
          style={{ marginTop: 8 }}
        >
          <circle
            cx="25"
            cy="25"
            r="20"
            fill="none"
            stroke="var(--brand-primary)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray="31.415, 31.415"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="1s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </main>
      <footer
        style={{
          textAlign: "center",
          marginBottom: "60px",
        }}
      >
        <p className="caption"
        style={{
            color: "var(--text-muted)",
            fontSize: "1rem",
          }}>By Team BroCode</p> 
      </footer>
    </div>
  );
}


