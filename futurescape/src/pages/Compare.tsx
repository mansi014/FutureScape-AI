import { useState } from "react";
import { useCompareScenarios, useListScenarios } from "@workspace/api-client-react";
import { Layers, Loader2, GitCompare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Compare() {
  const [scenarioIdA, setScenarioIdA] = useState<number | "">("");
  const [scenarioIdB, setScenarioIdB] = useState<number | "">("");
  
  const { data: scenarios } = useListScenarios({ limit: 100 }, { query: { queryKey: ['scenarios', { limit: 100 }] } });
  const compareScenarios = useCompareScenarios();
  const { toast } = useToast();

  const handleCompare = () => {
    if (!scenarioIdA || !scenarioIdB) {
      toast({ title: "Select Scenarios", description: "Please select two scenarios to compare", variant: "destructive" });
      return;
    }
    compareScenarios.mutate({ data: { scenarioIdA: Number(scenarioIdA), scenarioIdB: Number(scenarioIdB) } });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-display font-bold flex items-center gap-3">
        <Layers className="text-primary w-8 h-8" />
        Comparison Lab
      </h1>

      <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-4">
        <select 
          className="flex-1 bg-background/50 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
          value={scenarioIdA}
          onChange={e => setScenarioIdA(Number(e.target.value))}
        >
          <option value="">Select Reality Alpha...</option>
          {scenarios?.map(s => <option key={s.id} value={s.id}>{s.prompt.substring(0, 50)}...</option>)}
        </select>
        
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <GitCompare className="w-5 h-5 text-primary" />
        </div>
        
        <select 
          className="flex-1 bg-background/50 border border-secondary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-secondary"
          value={scenarioIdB}
          onChange={e => setScenarioIdB(Number(e.target.value))}
        >
          <option value="">Select Reality Beta...</option>
          {scenarios?.map(s => <option key={s.id} value={s.id}>{s.prompt.substring(0, 50)}...</option>)}
        </select>

        <button 
          onClick={handleCompare}
          disabled={compareScenarios.isPending || !scenarioIdA || !scenarioIdB}
          className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-white/90 disabled:opacity-50 flex items-center gap-2"
        >
          {compareScenarios.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Analyze"}
        </button>
      </div>

      {compareScenarios.data && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <div className="glass-panel p-8 rounded-2xl border-accent/20 text-center">
            <h2 className="text-sm font-mono text-muted-foreground uppercase mb-2">Verdict</h2>
            <p className="text-2xl font-display font-medium text-white">{compareScenarios.data.verdict}</p>
            <div className="mt-4 inline-flex px-4 py-2 bg-accent/10 border border-accent/20 rounded-full text-accent font-bold">
              Winner: {compareScenarios.data.winner === 'A' ? 'Reality Alpha' : compareScenarios.data.winner === 'B' ? 'Reality Beta' : 'Tie'}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-panel p-6 rounded-xl border-primary/20">
              <h3 className="text-xl font-bold mb-4 text-primary">Reality Alpha</h3>
              <p className="text-sm text-muted-foreground mb-4 italic">"{compareScenarios.data.scenarioA.prompt}"</p>
              <div className="text-4xl font-display font-bold mb-6 text-white">{compareScenarios.data.simulationA.probabilityScore}% <span className="text-sm text-muted-foreground block">Probability</span></div>
              <p className="text-sm leading-relaxed text-foreground/80">{compareScenarios.data.simulationA.summary}</p>
            </div>
            
            <div className="glass-panel p-6 rounded-xl border-secondary/20">
              <h3 className="text-xl font-bold mb-4 text-secondary">Reality Beta</h3>
              <p className="text-sm text-muted-foreground mb-4 italic">"{compareScenarios.data.scenarioB.prompt}"</p>
              <div className="text-4xl font-display font-bold mb-6 text-white">{compareScenarios.data.simulationB.probabilityScore}% <span className="text-sm text-muted-foreground block">Probability</span></div>
              <p className="text-sm leading-relaxed text-foreground/80">{compareScenarios.data.simulationB.summary}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
