import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Lock, Users, Lightbulb, Building2, Globe, Heart, Brain, Stethoscope } from "lucide-react";
import { motion } from "framer-motion";

export default function Mission() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-hero opacity-10" />
        
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 glow-green">
              Our Mission
            </h1>
            <p className="text-2xl text-muted-foreground mb-8">
              Advancing AI through provable, decentralized training by combining blockchain verification with human-in-the-loop supervision
            </p>
          </motion.div>
        </div>
      </section>

      {/* Core Mission Statement */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-card border border-primary/30 rounded-2xl p-10 text-center"
            >
              <Lightbulb className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl font-bold mb-4">The Problem We Solve</h2>
              <p className="text-lg text-muted-foreground mb-6">
                AI systems today are trained on data of questionable provenance, created by underpaid workers with no verification of quality or compliance. 
                This creates risk for regulated industries and invisible inequality for contributors. 
                Meanwhile, domain experts—doctors, researchers, specialists—are excluded from data creation entirely.
              </p>
              <p className="text-lg text-muted-foreground">
                <strong>H1 Labs fixes this by creating a decentralized marketplace where domain expertise is verified onchain, 
                data quality is enforced through smart contracts, and creators capture the value they generate.</strong>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Three Pillars */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 glow-purple">Our Three Pillars</h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-card rounded-xl border border-primary/30"
            >
              <Lock className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Provenance as Infrastructure</h3>
              <p className="text-muted-foreground">
                Every dataset, annotation, and validation event is recorded immutably onchain. 
                This creates a verifiable trail of origin, authorship, and compliance—transforming provenance from a feature into fundamental infrastructure.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 bg-card rounded-xl border border-secondary/30"
            >
              <Users className="h-12 w-12 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Credentialed Humans First</h3>
              <p className="text-muted-foreground">
                We partner AI agents with verified professionals—doctors, researchers, domain experts. 
                Humans review, enrich, and validate data. This hybrid approach produces datasets that no agent could create alone while capturing human intelligence correctly.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 bg-card rounded-xl border border-primary/30"
            >
              <Zap className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">Compliance by Code</h3>
              <p className="text-muted-foreground">
                HIPAA, GDPR, C2PA, and domain-specific regulations are enforced at the smart contract layer. 
                Compliance is hard-coded into the system, not merely self-reported. No workarounds. No exceptions.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Who We Serve */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 glow-green">Who We Serve</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="p-8 bg-card rounded-xl border border-border"
            >
              <Building2 className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">AI Companies & Researchers</h3>
              <p className="text-muted-foreground">
                Access enriched, compliant training datasets with immutable provenance. 
                Buy with confidence knowing every data point has been verified by credentialed professionals and meets regulatory requirements.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-8 bg-card rounded-xl border border-border"
            >
              <Globe className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Domain Experts & Professionals</h3>
              <p className="text-muted-foreground">
                Doctors, researchers, engineers, and specialists earn by validating and enriching data. 
                Get paid for knowledge, not time. Build reputation through immutable, onchain contribution records.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-8 bg-card rounded-xl border border-border"
            >
              <Lightbulb className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-3">App Developers</h3>
              <p className="text-muted-foreground">
                Embed the H1 SDK to add dual-intelligence data validation to your applications. 
                Compliance, credentialing, and provenance become features you plug in, not systems you build from scratch.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-8 bg-card rounded-xl border border-border"
            >
              <Lock className="h-10 w-10 text-secondary mb-4" />
              <h3 className="text-xl font-bold mb-3">Regulated Industries</h3>
              <p className="text-muted-foreground">
                Healthcare, finance, legal, defense, and robotics industries gain access to high-quality, compliant training data. 
                Reduce compliance risk while accelerating AI deployment.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Blockchain */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 glow-purple">Why Blockchain Matters</h2>
              <p className="text-xl text-muted-foreground">
                Blockchain isn't an accessory—it's fundamental infrastructure
              </p>
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-gradient-card rounded-lg border border-primary/20"
              >
                <h3 className="text-lg font-bold mb-2">🔐 Payment = Proof</h3>
                <p className="text-muted-foreground">
                  Every transaction is timestamped proof of human contribution. Paying in $LABS or H1 tokens links value directly to provenance, 
                  creating immutable records of who created and validated data.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 bg-gradient-card rounded-lg border border-primary/20"
              >
                <h3 className="text-lg font-bold mb-2">⚖️ Programmable Compliance</h3>
                <p className="text-muted-foreground">
                  Smart contracts enforce policy automatically. HIPAA, GDPR, C2PA rules are hard-coded into the system. 
                  Compliance isn't a checklist—it's embedded in every transaction.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 bg-gradient-card rounded-lg border border-primary/20"
              >
                <h3 className="text-lg font-bold mb-2">🌍 Decentralized Trust</h3>
                <p className="text-muted-foreground">
                  Global contributors collaborate without intermediaries while maintaining immutable records of impact. 
                  No central authority controls data access or payments—verified professionals do.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 bg-gradient-card rounded-lg border border-primary/20"
              >
                <h3 className="text-lg font-bold mb-2">💰 Economic Integrity</h3>
                <p className="text-muted-foreground">
                  Onchain token mechanics create self-balancing economics. Dataset demand drives buybacks. Contributors see transparent, automated payouts. 
                  Fair market economics, not centralized profit extraction.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Healthcare First */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 glow-green">Healthcare as Our Foundation</h2>
              <p className="text-xl text-muted-foreground">
                Why we start with medicine
              </p>
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
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  Clinicians are overworked and underpaid. Administrative burden and burnout drive talent away from medicine.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Meanwhile, AI companies source training data from low-wage annotation farms—not credentialed domain experts. Healthcare AI is built on unverified data from unqualified annotators.
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
                <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                  H1 Labs lets clinicians monetize expertise. Validate data. Enrich charts. Earn revenue through dataset sales.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Get paid for knowledge, not time. Every contribution recorded immutably onchain. Credentials verified. Compliance enforced. Impact tracked forever.
                </p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-card p-8 rounded-xl border border-primary/30 text-center mb-8"
            >
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-3">The Next Generation of Doctors Are Founders</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Own the tools that transform care. Stake $LABS. Validate datasets. Earn H1 tokens. 
                As medical AI sales grow, buybacks flow back to you. Doctors become founders with passive income tied directly to AI advancement and healthcare impact.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-8 bg-card rounded-xl border border-border"
            >
              <h4 className="text-xl font-bold mb-4">Why Healthcare First?</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Regulatory requirement:</strong> HIPAA, FDA approval, and clinical governance mean compliance is non-negotiable. H1's onchain compliance is essential infrastructure, not overhead.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Credentialed labor:</strong> Doctors, nurses, and medical researchers have verifiable credentials. Verification can be anchored onchain through third-party validation.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Urgent demand:</strong> AI in healthcare is exploding. Hospital systems and AI companies desperately need verified, compliant medical datasets.</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary font-bold">✓</span>
                  <span><strong>Economic misalignment to fix:</strong> Data annotation has inverted the value chain. H1 lets doctors capture the value they generate.</span>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Expansion */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold mb-4 glow-green">Beyond Healthcare</h2>
              <p className="text-xl text-muted-foreground">
                Our roadmap expands H1 Labs to every regulated industry
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">🤖 Robotics & Autonomous Systems</h3>
                <p className="text-sm text-muted-foreground">Industrial automation, safety-critical systems, autonomous vehicles</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">📊 Financial Services</h3>
                <p className="text-sm text-muted-foreground">Compliance, AML/KYC, fraud detection, risk assessment</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">⚖️ Legal & Compliance</h3>
                <p className="text-sm text-muted-foreground">Contract analysis, regulatory interpretation, privacy law</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">🎨 Creative Industries</h3>
                <p className="text-sm text-muted-foreground">Art provenance, music attribution, C2PA compliance</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">📚 Education & Research</h3>
                <p className="text-sm text-muted-foreground">Personalized learning, skill assessment, academic attribution</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="p-6 bg-card rounded-lg border border-border"
              >
                <h3 className="font-bold mb-2">🌍 Public Health & Climate</h3>
                <p className="text-sm text-muted-foreground">Epidemiological data, environmental monitoring, global collaboration</p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-card p-12 rounded-2xl border border-primary/30"
            >
              <h2 className="text-4xl font-bold mb-6">Join the Movement</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Whether you're a developer, researcher, clinician, or investor—H1 Labs is building the infrastructure for a trustworthy AI future. 
                Be part of a decentralized network that values expertise, enforces compliance, and rewards contribution.
              </p>
              <Link to="/">
                <Button 
                  size="lg" 
                  className="bg-gradient-primary border-0 hover:opacity-90 text-lg px-8"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
