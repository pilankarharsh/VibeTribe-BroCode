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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}


