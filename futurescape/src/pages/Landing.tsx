import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, Globe, History, Zap } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

const PROMPTS = [
  "What if social media disappeared?",
  "What if humans lived on Mars?",
  "What if AI replaced all teachers?",
  "What if dinosaurs still existed?"
];

export default function Landing() {
  const [promptIndex, setPromptIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPromptIndex((prev) => (prev + 1) % PROMPTS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="min-h-[90vh] flex flex-col items-center justify-center px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background/50 to-background pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto z-10 space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border-primary/30 text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-mono tracking-widest uppercase">Simulation Engine v2.0 Online</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
            Explore Alternate <br />
            <span className="text-gradient drop-shadow-[0_0_30px_rgba(0,212,255,0.3)]">Futures with AI</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Simulate impossible worlds, predict future civilizations, and visualize alternate realities using artificial intelligence.
          </p>

          <div className="w-full max-w-2xl mx-auto relative group mt-12">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-primary rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-panel rounded-xl p-2 flex items-center gap-2 bg-background/80">
              <div className="flex-1 h-14 relative overflow-hidden flex items-center px-4">
                <motion.p
                  key={promptIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-lg text-white/80 font-medium font-sans truncate absolute"
                >
                  {PROMPTS[promptIndex]}
                </motion.p>
              </div>
              <Link href="/simulate">
                <button className="h-14 px-8 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-bold tracking-wide transition-all shadow-[0_0_20px_hsl(var(--primary)/0.4)] flex items-center gap-2 group/btn">
                  Generate Reality
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-8 relative z-10 bg-background/80 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl font-display font-bold">The Architecture of Tomorrow</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our neural simulation engine evaluates millions of parameters across sociology, technology, and economics.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              icon={Brain}
              title="Neural Processing"
              desc="Advanced AI models generate coherent timelines and cross-domain consequences for any hypothetical scenario."
            />
            <FeatureCard 
              icon={Globe}
              title="Domain Impact Analysis"
              desc="See how a single change cascades through economy, healthcare, environment, and politics."
            />
            <FeatureCard 
              icon={History}
              title="Butterfly Effect Graph"
              desc="Trace the origin of future events back to their source through an interactive visual node map."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 relative z-10">
        <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-12 text-center border-primary/20 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative z-10 space-y-8">
            <Zap className="w-12 h-12 text-secondary mx-auto" />
            <h2 className="text-4xl font-display font-bold">Ready to fork reality?</h2>
            <p className="text-xl text-muted-foreground">Step into the control room and initialize your first simulation.</p>
            <Link href="/simulate">
              <button className="px-10 py-4 rounded-xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                Initialize Engine
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="glass-panel p-8 rounded-2xl border-white/5 hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-3 font-display">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{desc}</p>
    </div>
  );
}
