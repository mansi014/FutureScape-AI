import { Link, useLocation } from "wouter";
import { Activity, Layers, History, Settings, Info, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Nexus", icon: Activity },
  { href: "/simulate", label: "Simulate", icon: Play },
  { href: "/history", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: Layers },
  { href: "/about", label: "About", icon: Info },
  { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "w-64 border-r border-border/50 bg-background/95 backdrop-blur-xl flex flex-col h-screen fixed left-0 top-0 z-40 transition-transform duration-300",
          "md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center border border-primary/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-primary/20 w-full h-full transform -skew-x-12 animate-pulse-glow" />
              <Activity className="w-5 h-5 text-primary relative z-10" />
            </div>
            <span className="font-display font-bold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              FutureScape
            </span>
          </Link>

          {/* Close button — mobile only */}
          <button
            className="md:hidden text-muted-foreground hover:text-white p-1"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 group relative overflow-hidden",
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                )}
                <item.icon className={cn("w-5 h-5 transition-colors shrink-0", isActive ? "text-primary" : "group-hover:text-white")} />
                <span className="font-medium tracking-wide">{item.label}</span>
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[holo-sweep_1.5s_ease-in-out_infinite]" />
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border/50">
          <div className="p-3 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-secondary animate-pulse shadow-[0_0_8px_hsl(var(--secondary))]" />
            <span className="text-xs font-mono text-secondary-foreground">SYSTEM ONLINE</span>
          </div>
        </div>
      </aside>
    </>
  );
}
