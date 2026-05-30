import type { Metadata } from "next";
import { Inter, Outfit, Share_Tech_Mono, Share_Tech } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const shareTechMono = Share_Tech_Mono({
  weight: "400",
  variable: "--font-share-mono",
  subsets: ["latin"],
});

const shareTech = Share_Tech({
  weight: "400",
  variable: "--font-share",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ARTEMIS 6621 | FRC Robotics Team — Chatham NY",
  description:
    "Chatham High School's FIRST Robotics Competition Team 6621. Building the future through competitive engineering, STEM education, and community outreach.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${shareTechMono.variable} ${shareTech.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
