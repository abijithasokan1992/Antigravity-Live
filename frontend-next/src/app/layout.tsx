import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { Terminal, Shield, Activity, HardDrive } from "lucide-react";

export const metadata: Metadata = {
  title: "StreamVista Media OS — Enterprise Cloud Kernel",
  description: "Native Media Operating System for Film Ingest, DIT Workflows, B2B Rights Management, and FAST Syndication.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark select-none">
      <body className="h-full flex flex-col bg-[#05070d] text-slate-100 overflow-x-hidden font-sans">
        {/* OS Top Menu Bar */}
        <Navbar />

        {/* Main Desktop OS Workspace */}
        <main className="flex-1 w-full max-w-[1600px] mx-auto p-3 md:p-6 space-y-6">
          {children}
        </main>

        {/* Bottom OS Status Bar */}
        <footer className="sticky bottom-0 z-40 bg-[#070a12]/95 backdrop-blur-xl border-t border-slate-800/80 px-4 py-1.5 text-[11px] font-mono text-slate-400 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-emerald-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              SYSTEM ONLINE
            </span>
            <span className="hidden sm:inline-block text-slate-600">|</span>
            <span className="hidden sm:inline-block text-slate-400">TENANT: CRAYONS PICTURES UNION</span>
            <span className="hidden md:inline-block text-slate-600">|</span>
            <span className="hidden md:inline-block text-cyan-400">CLUSTER: ASIA-SOUTH-MUMBAI</span>
          </div>

          <div className="flex items-center gap-4 text-[10px]">
            <span className="text-slate-400">ENCRYPTION: <strong className="text-white">AES-256 GCM</strong></span>
            <span className="text-slate-600">|</span>
            <span className="text-purple-400">API GATEWAY: <strong className="text-white">v1.4 READY</strong></span>
          </div>
        </footer>
      </body>
    </html>
  );
}
