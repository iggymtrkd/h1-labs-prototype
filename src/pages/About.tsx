import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Rocket, Users, Globe, Code, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function About() {
  const timeline = [
    {
      year: "2023",
      title: "MiniWhales",
      description: "Initial proof-of-concept demonstrating human-validated AI training on blockchain",
      status: "completed",
    },
    {
      year: "2024",
      title: "H1 Labs Protocol",
      description: "Launch of the dual-token economy with $LABS and H1 tokens",
      status: "current",
    },
    {
      year: "2025 Q1",
      title: "Healthcare Domain Launch",
      description: "Scrubber App, Second Opinion+, and Pre-Chart Pro go live",
      status: "current",
    },
    {
      year: "2025 Q2",
      title: "Multi-Domain Expansion",
      description: "Launch of Art, Robotics, and Legal domain applications",
      status: "upcoming",
    },
    {
      year: "2025 Q3",
      title: "SDK Release",
      description: "Developer SDK for building custom H1 Labs applications",
      status: "upcoming",
    },
    {
      year: "2026",
      title: "Atlas Network",
      description: "Global decentralized AI training network spanning all major industries",
      status: "future",
    },
  ];

  const team = [
    {
      role: "Protocol Architecture",
      description: "Designing the dual-intelligence framework and token economics",
      icon: Code,
      color: "primary",
    },
    {
      role: "Healthcare Domain",
      description: "Building compliant medical AI training infrastructure",
      icon: Shield,
      color: "secondary",
    },
    {
      role: "Validator Network",
      description: "Growing and managing the global expert validation community",
      icon: Users,
      color: "primary",
    },
    {
      role: "Global Expansion",
      description: "Scaling H1 Labs across industries and geographies",
      icon: Globe,
      color: "secondary",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-2xl">
              <Target className="h-12 w-12 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 glow-green">Our Mission</h1>
          <p className="text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            To advance artificial intelligence through <span className="text-primary font-semibold">provable, 
            blockchain-verified training</span> that combines the precision of AI with the wisdom of human expertise.
          </p>
        </motion.div>

        {/* Vision Card */}
        <Card className="p-8 mb-16 bg-gradient-card border-primary/30">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 glow-purple">The Vision</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                H1 Labs is building the infrastructure for the next generation of AI—one that is 
                <span className="text-primary font-semibold"> transparent, auditable, and rooted in human intelligence</span>.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                By creating a decentralized marketplace where datasets are enriched, validated, and purchased 
                through blockchain mechanisms, we ensure that AI development is both ethical and economically sustainable.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/20 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-primary mb-2">100%</p>
                <p className="text-sm text-muted-foreground">Verifiable</p>
              </div>
              <div className="bg-muted/20 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-secondary mb-2">Global</p>
                <p className="text-sm text-muted-foreground">Network</p>
              </div>
              <div className="bg-muted/20 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-primary mb-2">Multi</p>
                <p className="text-sm text-muted-foreground">Domain</p>
              </div>
              <div className="bg-muted/20 p-6 rounded-xl text-center">
                <p className="text-4xl font-bold text-secondary mb-2">Open</p>
                <p className="text-sm text-muted-foreground">Protocol</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Rocket className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold">Roadmap</h2>
          </div>
          <div className="space-y-6">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  className={`p-6 bg-gradient-card border-2 transition-all ${
                    item.status === "current"
                      ? "border-primary shadow-neon-green"
                      : item.status === "completed"
                      ? "border-border opacity-70"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 w-20 text-center ${
                        item.status === "current"
                          ? "text-primary font-bold text-2xl"
                          : "text-muted-foreground text-xl"
                      }`}
                    >
                      {item.year}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{item.title}</h3>
                        <Badge
                          className={
                            item.status === "completed"
                              ? "bg-primary/20 text-primary"
                              : item.status === "current"
                              ? "bg-secondary/20 text-secondary"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Team Focus Areas */}
        <div>
          <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
            <Users className="h-8 w-8 text-primary" />
            What We're Building
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {team.map((area, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 bg-gradient-card border-border hover:border-primary transition-all card-hover">
                  <div className={`p-3 bg-${area.color}/20 rounded-xl w-fit mb-4`}>
                    <area.icon className={`h-8 w-8 text-${area.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{area.role}</h3>
                  <p className="text-muted-foreground">{area.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Core Principles */}
        <Card className="mt-16 p-8 bg-gradient-hero/10 border-primary/30">
          <h2 className="text-3xl font-bold mb-6 text-center">Core Principles</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-block p-4 bg-primary/20 rounded-2xl mb-4">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Provable</h3>
              <p className="text-muted-foreground">
                Every dataset has an immutable provenance record on the blockchain
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-secondary/20 rounded-2xl mb-4">
                <Users className="h-10 w-10 text-secondary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Human-First</h3>
              <p className="text-muted-foreground">
                AI advancement guided by expert human validation and supervision
              </p>
            </div>
            <div className="text-center">
              <div className="inline-block p-4 bg-primary/20 rounded-2xl mb-4">
                <Globe className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Decentralized</h3>
              <p className="text-muted-foreground">
                Open protocol enabling global participation and contribution
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
