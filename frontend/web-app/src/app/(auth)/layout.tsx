import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <header style={{ position: "sticky", top: 0, left: 0, right: 0 }}>
        <nav style={{ display: "flex", justifyContent: "center", alignItems: "stretch", background: "var(--color-white)", height: "max-content", width: "100%", borderBottom: "1px solid var(--color-soft-grey)", padding: "0 20px" }}>
          <div className="header-logo" style={{ display: "flex", justifyItems: "flex-start", alignItems: "center", width: "80vw" }}>
            <a href="/" style={{ width: "72px", padding: "8px", display: "inline-block", alignItems: "center", justifyContent: "center" }}>
              <img src={"/nav-logo.svg"} style={{ width: "56px" }} />
            </a>
            <h2 className="h2" style={{ fontWeight: "bold" }}>VibeTribe</h2>
          </div>
          <div className="header-cta" style={{ display: "flex", justifyItems: "flex-end", alignItems: "center" }}>
            <button className="btn" style={{ background: "var(--color-info-blue)", borderRadius: "var(--btn-radius)", color: "var(--color-white)" }}>
              Download App <svg width="24" height="24" viewBox="0 0 24 24"><g fill="currentColor"><path d="M17.707 10.708L16.293 9.29398L13 12.587V2.00098H11V12.587L7.70697 9.29398L6.29297 10.708L12 16.415L17.707 10.708Z"></path><path d="M18 18.001V20.001H6V18.001H4V20.001C4 21.103 4.897 22.001 6 22.001H18C19.104 22.001 20 21.103 20 20.001V18.001H18Z"></path></g></svg>
            </button>
          </div>
        </nav>
      </header>
      <main className="auth-layout" style={{ minHeight: "70vh", padding: 0, display:"flex", justifyContent:"center" }}>
        <div className="auth-input-section" style={{ display: "flex", flexDirection: "column", justifyContent: "center", width: "100%" }}>
          {children}
        </div>
      </main>
    </div>
  );
}


