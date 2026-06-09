import { useState } from "react";
import { useCreateScenario, useRunSimulation, useGetSimulation } from "@workspace/api-client-react";
import { Loader2, Zap, BrainCircuit, Activity, BarChart2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const CATEGORIES = ["Technology", "Society", "Environment", "Politics", "Economics", "Science", "Space", "Education", "Health", "Other"];

export default function Simulate() {
  const [prompt, setPrompt] = useState("");
  const [category, setCategory] = useState("Technology");
  const [scenarioId, setScenarioId] = useState<number | null>(null);
  const { toast } = useToast();

  const createScenario = useCreateScenario();
  const runSimulation = useRunSimulation();
  
  const { data: simulation, isLoading: isLoadingSimulation } = useGetSimulation(
    scenarioId || 0,
    { query: { enabled: !!scenarioId, queryKey: ['simulation', scenarioId] } }
  );

  const handleSimulate = async () => {
    if (prompt.length < 10) {
      toast({
        title: "Prompt too short",
        description: "Please enter a more detailed scenario prompt (min 10 chars).",
        variant: "destructive"
      });
      return;
    }

    try {
      const scenario = await createScenario.mutateAsync({ data: { prompt, category } });
      setScenarioId(scenario.id);
      await runSimulation.mutateAsync({ id: scenario.id });
    } catch (e: any) {
      toast({
        title: "Simulation Failed",
        description: e?.message || "An error occurred during simulation.",
        variant: "destructive"
      });
    }
  };

  const isProcessing = createScenario.isPending || runSimulation.isPending || isLoadingSimulation;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="glass-panel p-8 rounded-2xl border-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
        <h1 className="text-3xl font-display font-bold mb-6 flex items-center gap-3">
          <BrainCircuit className="text-primary w-8 h-8" />
          Simulation Control
        </h1>
        
        <div className="space-y-4 relative z-10">
          <div>
            <label className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-2 block">
              Scenario Prompt
            </label>
            <textarea
              className="w-full bg-background/50 border border-primary/20 rounded-xl p-4 text-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none min-h-[120px]"
              placeholder="What if..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4 items-center">
            <select
              className="bg-background/50 border border-primary/20 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-all"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            <button
              onClick={handleSimulate}
              disabled={isProcessing}
              className="flex-1 bg-primary text-primary-foreground font-bold rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing Reality...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  Initialize Simulation
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isProcessing && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel p-12 rounded-2xl flex flex-col items-center justify-center space-y-6"
          >
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
              <div className="absolute inset-4 border-4 border-secondary/20 rounded-full" />
              <div className="absolute inset-4 border-4 border-secondary rounded-full border-b-transparent animate-spin animate-reverse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit className="w-8 h-8 text-primary animate-pulse" />
              </div>
            </div>
            <div className="text-xl font-display font-medium text-primary animate-pulse tracking-widest uppercase">
              Generating Alternate Timeline
            </div>
            <div className="flex gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-2 h-8 bg-primary/40 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          </motion.div>
        )}

        {simulation && !isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-panel p-6 rounded-xl md:col-span-2">
                <h3 className="text-xl font-display font-bold mb-4 text-primary">Executive Summary</h3>
                <p className="text-lg leading-relaxed text-foreground/90">{simulation.summary}</p>
              </div>
              
              <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
                <div className="text-5xl font-display font-bold text-gradient mb-2">{simulation.probabilityScore}%</div>
                <div className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Probability Score</div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-secondary" />
                  Reality Metrics
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={[
                      { subject: 'Survival', A: simulation.scores.survivalProbability },
                      { subject: 'Economy', A: simulation.scores.economicStability },
                      { subject: 'Happiness', A: simulation.scores.humanHappiness },
                      { subject: 'Tech', A: simulation.scores.technologicalAdvancement },
                      { subject: 'Environment', A: 100 - simulation.scores.environmentalRisk },
                    ]}>
                      <PolarGrid stroke="rgba(255,255,255,0.1)" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                      <Radar name="Metrics" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.4} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-accent" />
                  Domain Impacts
                </h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={simulation.domainImpacts} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 40 }}>
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="domain" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(0,212,255,0.3)', borderRadius: '8px' }}
                        itemStyle={{ color: 'hsl(var(--primary))' }}
                      />
                      <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-display font-bold mb-6">Timeline Events</h3>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-primary/50 before:to-transparent">
                {simulation.timeline.map((event, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-5 h-5 rounded-full border-2 border-primary bg-background shadow-[0_0_10px_hsl(var(--primary))] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2" />
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] glass-panel p-4 rounded-lg border-primary/20 hover:border-primary/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-primary">{event.title}</h4>
                        <span className="font-mono text-sm px-2 py-1 rounded bg-primary/10 text-primary">{event.year}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl">
              <h3 className="text-xl font-display font-bold mb-6">Future Headlines</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {simulation.newsHeadlines.map((news, i) => (
                  <div key={i} className="holo-card p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-mono text-secondary px-2 py-1 bg-secondary/10 rounded">{news.year}</span>
                      <span className="text-xs text-muted-foreground uppercase">{news.category}</span>
                    </div>
                    <h4 className="font-display font-bold text-lg mb-2">{news.headline}</h4>
                    <p className="text-sm text-muted-foreground text-right">— {news.source}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
