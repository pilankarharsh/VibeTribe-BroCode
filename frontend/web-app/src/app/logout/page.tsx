  "use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { logout } from "@/services/login";


export default function Page() {
  const router = useRouter();
  const { clearAuth, setLoading } = useAuthStore();

  useEffect(() => {
    const performLogout = async () => {
      setLoading(true);
      try {
        // Call the logout API
        await logout();
      } catch (error) {
        console.error("Logout API failed:", error);
        // Even if API fails, we should clear local state
      } finally {
        // Clear local auth state regardless of API result
        clearAuth();
        setLoading(false);
        // Redirect to splash/login page
        router.replace("/splash");
      }
    };

    performLogout();
  }, [clearAuth, setLoading, router]);

  return (
  
    <div className="logout-page">
      <div className="logout-container">
        <div className="logout-spinner">
          <div className="spinner"></div>
          <p>Logging out...</p>
        </div>
      </div>

      <style jsx>{`
        .logout-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--bg-default);
        }

        .logout-container {
          text-align: center;
          padding: 2rem;
        }

        .logout-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--surface);
          border-top: 3px solid var(--brand-primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .logout-spinner p {
          color: var(--text-muted);
          font-size: var(--fs-body-15);
          margin: 0;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
 );
}