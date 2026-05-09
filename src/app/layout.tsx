import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "N4N0 — Booking + Acquisition System",
  description: "Booking, acquisition and no-show reduction for Dental Clinics and Med Spas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
