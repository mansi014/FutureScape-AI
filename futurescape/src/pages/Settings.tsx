import { Settings as SettingsIcon, Moon, Sun, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

export default function Settings() {
  const [theme, setTheme] = useState("dark");
  
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
  }, []);

  const toggleTheme = (newTheme: string) => {
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-bold flex items-center gap-3">
        <SettingsIcon className="text-primary w-8 h-8" />
        System Configuration
      </h1>

      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            Interface Theme
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => toggleTheme("dark")}
              className={`p-6 rounded-xl border flex flex-col items-center gap-4 transition-all ${theme === 'dark' ? 'bg-primary/20 border-primary text-white shadow-[0_0_20px_hsl(var(--primary)/0.2)]' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}
            >
              <Moon className="w-8 h-8" />
              <span className="font-medium">Cyber Dark</span>
            </button>
            <button 
              onClick={() => toggleTheme("light")}
              className={`p-6 rounded-xl border flex flex-col items-center gap-4 transition-all ${theme === 'light' ? 'bg-primary/20 border-primary text-primary shadow-[0_0_20px_hsl(var(--primary)/0.2)]' : 'border-white/10 text-muted-foreground hover:bg-white/5'}`}
            >
              <Sun className="w-8 h-8" />
              <span className="font-medium">Cyber Light</span>
            </button>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl border-destructive/20">
          <h2 className="text-xl font-bold mb-4 text-destructive flex items-center gap-2">
            Danger Zone
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Clear all simulation history. This action cannot be undone and will permanently delete all generated realities.
          </p>
          <button className="bg-destructive/10 text-destructive border border-destructive/50 hover:bg-destructive hover:text-destructive-foreground px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Purge Simulation Data
          </button>
        </div>
      </div>
    </div>
  );
}
