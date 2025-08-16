import InteractiveHeroSection from "@/components/InteractiveHeroSection";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .auth-layout {
            flex-direction: column !important;
          }
          .form-section {
            flex: 1 !important;
            min-height: auto !important;
            min-width:100vw;
            padding: 20px !important;
          }
          .hero-section {
            flex: 0 0 300px !important;
            min-height: 300px !important;
          }
          .hero-section h1 {
            font-size: 2rem !important;
          }
          .hero-section p {
            font-size: 1rem !important;
          }
          .mobile{
          text-align: center;
            display:flex!important
          }
            .web{
          text-align: center;
            display:none!important
          }
        }
      `}</style>
      <div className="auth-layout" style={{ height: "100vh", display: "flex", background: "var(--bg-default)", color: "var(--text-default)" }}>
        {/* Left Side - Form Section */}
        <div className="form-section" style={{
          flex: "0 0 50%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          textAlign: "start",
          padding: "40px",
          backgroundColor: "var(--bg-default)",
          minHeight: "100vh",
          width: "100%",
          maxWidth: "50vw"
        }}>
          {children}
          <div className="body web" style={{ display: "flex", color: "var(--color-muted-text)", flexDirection: "column", marginTop: "50px" }}>
            <span>Born in Goa ⛱️</span>
            <span>© all the rights reserved. 2025</span>
          </div>
        </div>

        {/* Right Side - Hero Banner */}
        <div className="hero-section" style={{
          flex: "0 0 50%",
          position: "relative",
          minHeight: "80vh",
          margin:"40px 0",
          display: "flex",
          borderRadius: "100px",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
        }}>
          {/* Background Pattern/Image */}
          <InteractiveHeroSection></InteractiveHeroSection>
        </div>
        <div className="body mobile" style={{ display: "none", color: "var(--color-muted-text)", flexDirection: "column", margin: "20px auto" }}>
        <span>Born in Goa ⛱️</span>
        <span>© all the rights reserved. 2025</span>
      </div>
      </div>
    </>
  );
}
