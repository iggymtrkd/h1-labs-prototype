import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Users, TrendingUp, Heart, Brain, Stethoscope, Target, Info, FileText, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface HomeProps {
  onConnect: () => void;
}

export default function Home({ onConnect }: HomeProps) {
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [dontShowHowItWorks, setDontShowHowItWorks] = useState(false);
  const [dontShowDisclaimer, setDontShowDisclaimer] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const hideHowItWorks = localStorage.getItem("hideHowItWorks") === "true";
    const hideDisclaimer = localStorage.getItem("hideDisclaimer") === "true";
    
    if (!hideHowItWorks) {
      setShowHowItWorks(true);
    }
    if (!hideDisclaimer) {
      setTimeout(() => setShowDisclaimer(true), 500);
    }
  }, []);

  const handleHowItWorksClose = () => {
    if (dontShowHowItWorks) {
      localStorage.setItem("hideHowItWorks", "true");
    }
    setShowHowItWorks(false);
    setDontShowHowItWorks(false);
  };

  const handleDisclaimerClose = () => {
    if (dontShowDisclaimer) {
      localStorage.setItem("hideDisclaimer", "true");
    }
    setShowDisclaimer(false);
    setDontShowDisclaimer(false);
  };

  const simulateDeltaGain = async () => {
    // Simple simulation: pretend to compute delta and show a toast
    toast({
      title: "Δ‑Gain Recorded",
      description: "Provenance + attribution saved. Buybacks will route to the originating Lab on bundle sale.",
    });
  };

  return (
    <div className="min-h-screen pt-16">
      {/* How It Works Dialog */}
      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold glow-green">How It Works - H1 Testnet Period</DialogTitle>
            <DialogDescription className="text-base">
              Understanding the H1 Labs ecosystem and user flow
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">1</span>
                Connect Your Wallet
              </h3>
              <p className="text-muted-foreground pl-8">
                Connect your Base wallet (Base Sepolia testnet) to access the H1 Labs platform and participate in the data economy.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Acquire $LABS Tokens
              </h3>
              <p className="text-muted-foreground pl-8">
                <strong>Why:</strong> $LABS is the governance token that unlocks platform participation.<br/>
                <strong>How:</strong> Purchase $LABS tokens to stake and create or join Data Labs.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Stake & Create a Lab
              </h3>
              <p className="text-muted-foreground pl-8">
                <strong>Why:</strong> Labs are collaborative spaces for dataset creation with proven provenance.<br/>
                <strong>How:</strong> Stake $LABS to create your own Data Lab and issue domain-specific H1 tokens.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">4</span>
                Validate & Earn
              </h3>
              <p className="text-muted-foreground pl-8">
                <strong>Why:</strong> Human validation ensures AI training data quality and compliance.<br/>
                <strong>How:</strong> Credentialed validators review data submissions and earn rewards for quality verification.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-primary flex items-center gap-2">
                <span className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm">5</span>
                Trade & Profit
              </h3>
              <p className="text-muted-foreground pl-8">
                <strong>Why:</strong> Value flows back to data creators through the bonding curve mechanism.<br/>
                <strong>How:</strong> H1 tokens can be traded, with revenue sharing across Lab participants.
              </p>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dont-show-how-it-works" 
                checked={dontShowHowItWorks}
                onCheckedChange={(checked) => setDontShowHowItWorks(checked as boolean)}
              />
              <label
                htmlFor="dont-show-how-it-works"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Don't show this again
              </label>
            </div>
            <Button onClick={handleHowItWorksClose} className="w-full bg-gradient-primary">
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disclaimer Dialog */}
      <Dialog open={showDisclaimer} onOpenChange={setShowDisclaimer}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold glow-purple">Important Notice</DialogTitle>
            <DialogDescription className="text-base">
              Prototype & Testnet Information
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
              <p className="text-sm leading-relaxed">
                By proceeding, you acknowledge that <strong>H1 Labs is in prototype stage and operating on testnet</strong>. 
              </p>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed">
              This prototype is designed to explain our vision in practical terms and may or may not represent 
              the final product. All transactions are using testnet tokens with no real monetary value.
            </p>

            <div className="bg-muted/50 rounded-lg p-4">
              <ul className="text-sm text-muted-foreground space-y-2">
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Testnet environment - no real funds at risk</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Features subject to change during development</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>Not financial or medical advice</span>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="dont-show-disclaimer" 
                checked={dontShowDisclaimer}
                onCheckedChange={(checked) => setDontShowDisclaimer(checked as boolean)}
              />
              <label
                htmlFor="dont-show-disclaimer"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Don't show this again
              </label>
            </div>
            <Button onClick={handleDisclaimerClose} className="w-full bg-gradient-primary">
              I Understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              The H1 SDK embeds two intelligence systems in every app—an Agent and a credentialed Human—
              producing compliant, high‑quality data for regulated and semi‑regulated markets. Healthcare first.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary border-0 hover:opacity-90 text-lg px-8"
                onClick={onConnect}
              >
                <Wallet className="mr-2 h-5 w-5" />
                Sign In
              </Button>
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

      {/* Dual-Intelligence SDK Callout */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-5xl mx-auto bg-card border border-primary/30 rounded-2xl p-8 text-center"
          >
            <h2 className="text-3xl font-bold mb-4 glow-green">Dual‑Intelligence SDK</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Plug the H1 SDK into your app and choose a base model from partner providers—or bring your own.
              The Agent executes while a credentialed Human reviews and signs off. The supervised improvement
              (Δ‑Gain) is recorded with provenance and attribution for compliant resale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/whitepaper">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                  Learn How It Works
                </Button>
              </Link>
              <Button className="bg-gradient-primary border-0 hover:opacity-90" onClick={simulateDeltaGain}>
                Try the Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
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
                Two intelligence systems—Agent + Human—work together. The agent executes; a credentialed human
                supervises and signs off for compliance.
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

      {/* Medical Use Case Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 glow-green">Our First Beachhead: Medical</h2>
              <p className="text-xl text-muted-foreground">Revolutionizing Healthcare Through AI and Blockchain</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-destructive/10 border-l-4 border-destructive p-8 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Stethoscope className="h-8 w-8 text-destructive" />
                  <h3 className="text-2xl font-bold">The Problem</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Doctors are overworked, underpaid, and walking away. The healthcare system is failing 
                  both providers and patients, leading to burnout and declining care quality.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-primary/10 border-l-4 border-primary p-8 rounded-lg"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">The Solution</h3>
                </div>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Clinical apps that improve patient outcomes and MD income. Patient Care Apps. 
                  MD Care Apps. One Ecosystem.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-card p-8 rounded-xl border border-primary/30 text-center"
            >
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">The Next Generation of Doctors are Founders, not Employees</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We're empowering medical professionals to build and own the AI-powered tools that will 
                transform healthcare delivery, patient outcomes, and their own financial independence.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4 glow-purple">Our Roadmap: Beyond Medical</h2>
            <p className="text-xl text-muted-foreground">Expanding to Regulated Industries Worldwide</p>
          </motion.div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative p-6 pt-8 bg-card rounded-xl border-2 border-primary shadow-neon-green"
            >
              <div className="absolute top-2 left-2 bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <Target className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-bold mb-2">Medical & Healthcare</h3>
              <p className="text-muted-foreground text-sm">
                Clinical apps, diagnostic tools, patient care systems
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="relative p-6 pt-8 bg-card rounded-xl border border-border hover:border-secondary transition-all card-hover"
            >
              <div className="absolute top-2 left-2 bg-secondary text-secondary-foreground w-8 h-8 rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <Zap className="h-10 w-10 text-secondary mb-3" />
              <h3 className="text-xl font-bold mb-2">Robotics & Automation</h3>
              <p className="text-muted-foreground text-sm">
                Industrial automation, autonomous systems, smart manufacturing
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative p-6 pt-8 bg-card rounded-xl border border-border hover:border-primary transition-all card-hover"
            >
              <div className="absolute top-2 left-2 bg-muted-foreground text-background w-8 h-8 rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <Shield className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-bold mb-2">Financial Services</h3>
              <p className="text-muted-foreground text-sm">
                Compliance, risk assessment, fraud detection systems
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative p-6 pt-8 bg-card rounded-xl border border-border hover:border-secondary transition-all card-hover"
            >
              <div className="absolute top-2 left-2 bg-muted-foreground text-background w-8 h-8 rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <Users className="h-10 w-10 text-secondary mb-3" />
              <h3 className="text-xl font-bold mb-2">Legal & Compliance</h3>
              <p className="text-muted-foreground text-sm">
                Contract analysis, regulatory compliance, case management
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative p-6 pt-8 bg-card rounded-xl border border-border hover:border-primary transition-all card-hover"
            >
              <div className="absolute top-2 left-2 bg-muted-foreground text-background w-8 h-8 rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <TrendingUp className="h-10 w-10 text-primary mb-3" />
              <h3 className="text-xl font-bold mb-2">Education & Training</h3>
              <p className="text-muted-foreground text-sm">
                Personalized learning, skill assessment, certification systems
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative p-6 pt-8 bg-card rounded-xl border border-border hover:border-secondary transition-all card-hover"
            >
              <div className="absolute top-2 left-2 bg-muted-foreground text-background w-8 h-8 rounded-full flex items-center justify-center font-bold">
                6
              </div>
              <Zap className="h-10 w-10 text-secondary mb-3" />
              <h3 className="text-xl font-bold mb-2">And Beyond...</h3>
              <p className="text-muted-foreground text-sm">
                Any industry requiring compliant, high-quality AI training data
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
            <Button 
              size="lg" 
              className="bg-gradient-primary border-0 hover:opacity-90 text-lg px-8"
              onClick={onConnect}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
