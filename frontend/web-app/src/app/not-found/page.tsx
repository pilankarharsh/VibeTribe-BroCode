"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function NotFound() {
  const router = useRouter();
  const { token } = useAuthStore();

  const handleGoHome = () => {
    if (token) {
      router.push("/home");
    } else {
      router.push("/splash");
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <div className="not-found-content">
          <div className="error-code">404</div>
          <h1 className="h2">Page Not Found</h1>
          <p className="body error-message">
            Sorry, we couldn't find the page you're looking for. 
            The page might have been moved, deleted, or you entered the wrong URL.
          </p>
          
          <div className="action-buttons">
            <button 
              onClick={handleGoBack}
              className="btn btn-secondary"
            >
              Go Back
            </button>
            <button 
              onClick={handleGoHome}
              className="btn btn-primary"
            >
              {token ? "Go to Home" : "Go to Start"}
            </button>
          </div>
        </div>

        {/* Decorative illustration */}
        <div className="illustration">
          <svg
            width="200"
            height="200"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="100"
              cy="100"
              r="80"
              stroke="var(--surface)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M70 80 Q100 50 130 80"
              stroke="var(--text-muted)"
              strokeWidth="2"
              fill="none"
            />
            <circle cx="85" cy="90" r="3" fill="var(--text-muted)" />
            <circle cx="115" cy="90" r="3" fill="var(--text-muted)" />
            <path
              d="M80 120 Q100 140 120 120"
              stroke="var(--text-muted)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>
      </div>

      <style jsx>{`
        .not-found-page {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: var(--bg-default);
          padding: 2rem 1rem;
        }

        .not-found-container {
          text-align: center;
          max-width: 600px;
          width: 100%;
        }

        .not-found-content {
          margin-bottom: 3rem;
        }

        .error-code {
          font-size: 6rem;
          font-weight: var(--fw-bold);
          color: var(--brand-primary);
          line-height: 1;
          margin-bottom: 1rem;
        }

        .not-found-content h1 {
          margin-bottom: 1rem;
          color: var(--text-default);
        }

        .error-message {
          color: var(--text-muted);
          margin-bottom: 2rem;
          line-height: var(--lh-body-15);
          max-width: 400px;
          margin-left: auto;
          margin-right: auto;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .action-buttons .btn {
          min-width: 120px;
        }

        .illustration {
          opacity: 0.6;
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @media (max-width: 640px) {
          .error-code {
            font-size: 4rem;
          }

          .not-found-container {
            padding: 1rem;
          }

          .action-buttons {
            flex-direction: column;
            align-items: center;
          }

          .action-buttons .btn {
            width: 100%;
            max-width: 200px;
          }

          .illustration svg {
            width: 150px;
            height: 150px;
          }
        }
      `}</style>
    </div>
  );
}