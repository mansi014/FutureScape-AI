import { useState } from "react";
import { Menu, Activity } from "lucide-react";
import { Link } from "wouter";
import { Sidebar } from "./sidebar";
import { NeuralBackground } from "@/components/ui/neural-background";

export function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground flex selection:bg-primary/30 relative">
      <NeuralBackground />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-20 h-14 bg-background/90 backdrop-blur-xl border-b border-border/50 flex items-center px-4 gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="text-muted-foreground hover:text-primary transition-colors p-1"
          aria-label="Open menu"
          data-testid="button-open-menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center border border-primary/50">
            <Activity className="w-4 h-4 text-primary" />
          </div>
          <span className="font-display font-bold text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            FutureScape
          </span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen relative z-10 overflow-x-hidden pt-14 md:pt-0">
        {children}
      </main>
    </div>
  );
}
