import type { Metadata } from "next";
import { Geist } from "next/font/google";
import FontCheck from "@/components/FontCheck";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Skinstric | Sophisticated skincare",
  description:
    "Skinstric developed an A.I. that creates a highly-personalised routine tailored to what your skin needs.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full`}>
      <body className="min-h-full">
        <FontCheck />
        {children}
      </body>
    </html>
  );
}
