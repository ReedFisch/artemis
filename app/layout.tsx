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
  metadataBase: new URL("https://www.artemisfrc.com"),
  title: "Artemis Robotics",
  description:
    "The official website of Artemis Robotics, FRC Team 6621 from Chatham, NY. Designing, programming, and building high-performance competition robots since 2016.",
  icons: {
    icon: "/branding/logo_transparent.webp",
    shortcut: "/branding/logo_transparent.webp",
    apple: "/branding/logo_transparent.webp",
  },
  openGraph: {
    title: "Artemis Robotics",
    description: "The official website of Artemis Robotics, FRC Team 6621 from Chatham, NY. Designing, programming, and building high-performance competition robots.",
    url: "https://www.artemisfrc.com",
    siteName: "Artemis Robotics",
    images: [
      {
        url: "/photos/hero/team_with_robot.webp",
        width: 1200,
        height: 630,
        alt: "Artemis Robotics Team 6621",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Artemis Robotics",
    description: "The official website of Artemis Robotics, FRC Team 6621 from Chatham, NY.",
    images: ["/photos/hero/team_with_robot.webp"],
  },
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
