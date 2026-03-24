"use client";

import { useEffect, useState, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    setMousePosition({ x, y });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      className="min-h-screen bg-background"
      style={
        {
          "--mouse-x": `${mousePosition.x}%`,
          "--mouse-y": `${mousePosition.y}%`,
        } as React.CSSProperties
      }
    >
      {/* Global spotlight effect */}
      <div className="fixed inset-0 spotlight pointer-events-none" />

      <Sidebar />

      <div className="pl-[72px] lg:pl-64">
        <Navbar />
        <main className="min-h-[calc(100vh-4rem)] p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
