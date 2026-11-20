import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Roobert is the font from the Figma file
const roobert = localFont({
  variable: "--font-roobert",
  src: [
    { path: "./fonts/Roobert-TRIAL-Light.woff2", weight: "300" },
    { path: "./fonts/Roobert-TRIAL-Regular.woff2", weight: "400" },
    { path: "./fonts/Roobert-TRIAL-Medium.woff2", weight: "500" },
    { path: "./fonts/Roobert-TRIAL-SemiBold.woff2", weight: "600" },
  ],
});

export const metadata: Metadata = {
  title: "Skinstric | Sophisticated skincare",
  description:
    "Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your skin needs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${roobert.variable} h-full`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
