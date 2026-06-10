import { useListScenarios } from "@workspace/api-client-react";
import { Link } from "wouter";
import { History as HistoryIcon, ArrowRight, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const { data: scenarios, isLoading } = useListScenarios(
    { limit: 50 },
    { query: { queryKey: ["scenarios", { limit: 50 }] } }
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-bold flex items-center gap-3">
          <HistoryIcon className="text-primary w-8 h-8" />
          Simulation Archives
        </h1>
        <Link href="/simulate">
          <button className="bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 px-4 py-2 rounded-lg font-medium transition-colors">
            New Simulation
          </button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center p-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !scenarios?.length ? (
        <div className="glass-panel p-12 text-center rounded-2xl flex flex-col items-center">
          <HistoryIcon className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-xl font-bold mb-2">No Simulations Found</h3>
          <p className="text-muted-foreground mb-6">You haven't run any scenarios yet.</p>
          <Link href="/simulate">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold">
              Initialize First Simulation
            </button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((scenario) => (
            <div key={scenario.id} className="glass-panel p-6 rounded-xl border-white/5 hover:border-primary/30 transition-all group flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground px-2 py-1 bg-white/5 rounded">
                  {scenario.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(scenario.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
              <h3 className="text-lg font-medium mb-4 flex-1 line-clamp-3 group-hover:text-primary transition-colors">
                {scenario.prompt}
              </h3>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  {scenario.simulationCount} variations
                </span>
                <Link href={`/simulate?id=${scenario.id}`}>
                  <button className="text-primary hover:text-white transition-colors flex items-center gap-1 text-sm font-medium">
                    Load Data <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
