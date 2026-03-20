import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartCampus AI — Intelligent Student Management",
  description:
    "AI-powered student management and attendance system for modern educational institutions. Face recognition, real-time analytics, and smart insights.",
  keywords: [
    "student management",
    "attendance system",
    "AI education",
    "smart campus",
    "face recognition",
  ],
  authors: [{ name: "SmartCampus AI" }],
  openGraph: {
    title: "SmartCampus AI — Intelligent Student Management",
    description:
      "AI-powered student management and attendance system for modern educational institutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetBrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
