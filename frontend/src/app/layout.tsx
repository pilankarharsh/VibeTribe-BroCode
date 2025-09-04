import type { Metadata } from "next";
import "@/styles/variables.css";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Vibe Tribe",
  description: "Vibe Tribe Web App",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark">
      <body style={{ backgroundColor: 'var(--bg-default)', color: 'var(--text-default)' }}>
        {children}
      </body>
    </html>
  );
}


