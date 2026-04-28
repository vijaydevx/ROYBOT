import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ConnectionProvider } from "@/lib/ConnectionContext";

export const metadata: Metadata = {
  title: "ROYBOT Dashboard v2.0",
  description: "ROYBOT - AI Self-Balancing Surveillance Robot Tactical Interface",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-s-bg">
        <ConnectionProvider>
          {children}
        </ConnectionProvider>
      </body>
    </html>
  );
}
