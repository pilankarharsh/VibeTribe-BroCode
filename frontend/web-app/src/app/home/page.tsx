"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace("/splash");
    }
  }, [token, router]);

  return (
    <main className="flex-center" style={{ minHeight: "100vh", padding: 24 }}>
      <div className="card" style={{ width: 520 }}>
        <h1 className="h2" style={{ marginBottom: 12 }}>Home</h1>
        <p className="body">Welcome {user?.email || "friend"}!</p>
      </div>
    </main>
  );
}
