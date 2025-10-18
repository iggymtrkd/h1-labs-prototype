import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Users, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 glow-green leading-tight">
              Advancing AI Through <br />
              <span className="text-transparent bg-clip-text bg-gradient-hero">
                Proven Human Intelligence
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A dual-intelligence onchain protocol that enables global contributors to produce compliant, 
              high-quality AI training data through blockchain verification and human validation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-gradient-primary border-0 hover:opacity-90 text-lg px-8">
                  Explore Labs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/whitepaper">
                <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8">
                  Read Whitepaper
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Animated Diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-20 relative"
          >
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center mb-4 shadow-neon-green">
                  <Users className="h-12 w-12 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Data Labs</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Collaborative spaces for dataset creation and enrichment
                </p>
              </motion.div>

              <div className="hidden lg:block">
                <ArrowRight className="h-8 w-8 text-primary animate-glow-pulse" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center mb-4 shadow-neon-purple">
                  <Shield className="h-12 w-12 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Validators</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Human experts verify and validate training data quality
                </p>
              </motion.div>

              <div className="hidden lg:block">
                <ArrowRight className="h-8 w-8 text-primary animate-glow-pulse" />
              </div>

              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="flex flex-col items-center"
              >
                <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mb-4 shadow-neon-green">
                  <Zap className="h-12 w-12 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">AI Models</h3>
                <p className="text-sm text-muted-foreground text-center max-w-xs">
                  Enhanced artificial intelligence trained on verified data
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 glow-purple">Why H1 Labs?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary transition-all card-hover"
            >
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Provable Training</h3>
              <p className="text-muted-foreground">
                Blockchain-verified datasets with full provenance and audit trails
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary transition-all card-hover"
            >
              <Users className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Human-in-the-Loop</h3>
              <p className="text-muted-foreground">
                Expert validation ensures the highest quality training data
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary transition-all card-hover"
            >
              <TrendingUp className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Dual-Token Economy</h3>
              <p className="text-muted-foreground">
                $LABS for governance and H1 tokens for lab-specific utility
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary transition-all card-hover"
            >
              <Zap className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Regulatory Compliant</h3>
              <p className="text-muted-foreground">
                Built for healthcare, robotics, and other regulated industries
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card p-12 rounded-2xl border border-primary/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Join the AI Revolution?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Connect your wallet and start participating in the future of AI training
            </p>
            <Link to="/dashboard">
              <Button size="lg" className="bg-gradient-primary border-0 hover:opacity-90 text-lg px-8">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
