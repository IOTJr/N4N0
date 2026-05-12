import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from 'next/font/google';
import "./globals.css";

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['500', '700'],
});

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: "N4N0 — Booking + Acquisition System",
  description: "Booking, acquisition and no-show reduction for Dental Clinics and Med Spas",
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${headingFont.variable} ${bodyFont.variable} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
