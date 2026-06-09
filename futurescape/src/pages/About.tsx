import { Info, Cpu, Globe2, Shield } from "lucide-react";

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4 pt-12">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mx-auto mb-6 border border-primary/50 relative">
          <div className="absolute inset-0 bg-primary/20 animate-pulse-glow rounded-2xl" />
          <Info className="w-8 h-8 text-primary relative z-10" />
        </div>
        <h1 className="text-4xl font-display font-bold text-white">About FutureScape</h1>
        <p className="text-xl text-muted-foreground">The premier civilization simulation engine.</p>
      </div>

      <div className="glass-panel p-8 rounded-2xl prose prose-invert max-w-none">
        <h2 className="font-display text-2xl text-primary">Vision & Mission</h2>
        <p>
          FutureScape AI was built to answer the ultimate "What If" questions. By combining advanced predictive models, sociodynamic variables, and historical pattern recognition, we aim to map the probability space of human existence.
        </p>

        <div className="grid md:grid-cols-3 gap-6 my-12 not-prose">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <Cpu className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-lg mb-2">Neural Core</h3>
            <p className="text-sm text-muted-foreground">Utilizing generative intelligence to extrapolate complex causal chains.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <Globe2 className="w-8 h-8 text-secondary mb-4" />
            <h3 className="font-bold text-lg mb-2">Macro-Dynamics</h3>
            <p className="text-sm text-muted-foreground">Simulating planetary scale impacts across economics, environment, and society.</p>
          </div>
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <Shield className="w-8 h-8 text-accent mb-4" />
            <h3 className="font-bold text-lg mb-2">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">Evaluating existential threats and civilizational survival probabilities.</p>
          </div>
        </div>

        <h2 className="font-display text-2xl text-secondary">How It Works</h2>
        <p>
          When you initialize a simulation, the engine maps your prompt against thousands of historical precedents and sociopolitical frameworks. It generates a divergent timeline (the "Butterfly Graph") and assigns probability scores based on current technological vectors.
        </p>
        <p>
          The output is not science fiction—it is rigorous probability mapping designed for researchers, futurists, and strategy analysts.
        </p>
      </div>
    </div>
  );
}
