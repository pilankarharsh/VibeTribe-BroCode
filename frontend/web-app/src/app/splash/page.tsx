"use client";

import { useEffect, useState, type ReactElement } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
type StoreWithPersist = typeof useAuthStore & {
  persist?: {
    onFinishHydration: (callback: () => void) => () => void;
    hasHydrated: () => boolean;
  };
};


export default function SplashPage() {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    const store = useAuthStore as StoreWithPersist;
    const unsubscribe = store.persist?.onFinishHydration(() => {
      setHasHydrated(true);
    });

    if (store.persist?.hasHydrated()) {
      setHasHydrated(true);
    }

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const { token, isOnboarded, setLoading } = useAuthStore.getState();
    setLoading(false);

    const nextPath = !token ? "/login" : isOnboarded ? "/home" : "/onboarding";
    router.replace(nextPath);
  
}, [hasHydrated, router]);

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


