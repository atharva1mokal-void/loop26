import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using Inter for a clean, modern look
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { CommandPalette } from "@/components/CommandPalette";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nexus | AI Project Intelligence",
  description: "Next-gen project management for engineering teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex h-screen overflow-hidden">
          <Sidebar />

          <div className="gradient-bg opacity-20" /> {/* Keep for subtle overlay if needed */}
          <main className="flex-1 overflow-y-auto relative z-10">
            {children}
          </main>
          <CommandPalette />
        </div>
      </body>
    </html>
  );
}
