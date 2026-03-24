"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Settings,
  PenSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/articles", icon: FileText, label: "All Articles" },
  { href: "/categories", icon: FolderOpen, label: "Categories" },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <TooltipProvider delayDuration={0}>
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 z-40 h-screen w-[72px] border-r border-border/50 bg-card/50 backdrop-blur-xl lg:w-64"
      >
        <div className="spotlight absolute inset-0 pointer-events-none" />

        <div className="relative flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center border-b border-border/50 px-4 lg:px-6">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <PenSquare className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="hidden text-lg font-semibold tracking-tight lg:block">
                BlogCMS
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 lg:px-4">
            {navItems.map((item, index) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeNav"
                          className="absolute inset-0 rounded-lg bg-primary/10"
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                        />
                      )}
                      <item.icon className="relative h-5 w-5 shrink-0" />
                      <span className="relative hidden lg:block">
                        {item.label}
                      </span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="lg:hidden">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border/50 p-4">
            <div className="hidden lg:block">
              <p className="text-xs text-muted-foreground">
                Blog Management System
              </p>
              <p className="text-xs text-muted-foreground/60">v1.0.0</p>
            </div>
          </div>
        </div>
      </motion.aside>
    </TooltipProvider>
  );
}
