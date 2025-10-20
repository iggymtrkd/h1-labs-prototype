import { motion } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface FAQProps {
  onConnect?: () => void;
}

export default function FAQ({ onConnect }: FAQProps) {
  return (
    <div className="min-h-screen pt-20 pb-12">
      {/* Header */}
      <section className="py-12 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-muted-foreground"
            >
              Everything you need to know about H1 Labs, $LABS tokens, and the protocol
            </motion.p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* FAQ 1: What is this? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    What is this?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p>H1 Labs is a decentralized protocol that lets you:</p>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Own fractional shares (H1 tokens) in domain‑specific AI labs</li>
                    <li>Earn passive yield from real dataset revenue</li>
                    <li>Benefit from buyback pressure that reduces supply (like stock buybacks)</li>
                  </ol>
                  <p className="mt-3">Unlike other yield platforms, every dollar you earn comes from real AI companies purchasing datasets—not inflationary token printing.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 2: How do I earn? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    How do I earn without doing anything?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-3">
                  <p><strong className="text-foreground">Simple:</strong> Hold H1 tokens. When labs sell datasets:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-foreground">50%</strong> of revenue increases NAV (your H1 shares back more assets)</li>
                    <li><strong className="text-foreground">25%</strong> goes to buybacks (protocol buys & burns H1, reducing supply)</li>
                    <li><strong className="text-foreground">Result:</strong> Your holdings become scarcer + backed by more assets</li>
                  </ul>
                  <p className="text-sm italic">Example: $1M dataset sale → your 1% share gains $5K (NAV) + ~$2.5K (buyback scarcity)</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 3: Downside risk */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    What's my downside risk if a lab fails?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p>Your downside is limited to your initial deposit + fees. H1 is backed by real vault assets (can't go below NAV). If a lab never generates revenue, your H1 stays at entry price and you can redeem it anytime.</p>
                  <p className="text-sm font-semibold text-foreground">Bottom line: You can't lose more than you put in.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 4: Speculation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    Can I speculate on H1 prices?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-3">
                  <p className="font-semibold text-foreground">Yes, but safely:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Trade H1 on secondary market for instant execution</li>
                    <li>Arbitrage between different labs to capture growth</li>
                    <li>Protected from pump & dump schemes (price bounds prevent extreme swings)</li>
                    <li>Protected from infinite leverage (exit caps + cooldowns)</li>
                  </ul>
                </div>
              </details>
            </motion.div>

            {/* FAQ 5: Staking Mechanism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    Do I need to stake $LABS in a specific lab?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p>Yes! When you buy H1 tokens, you're depositing your $LABS into that specific lab's vault. Your $LABS backs your H1 shares and gives you ownership of that lab's economy. You can redeem anytime (7-day cooldown), and all dataset revenue from that lab flows to its H1 holders proportionally.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 6: Time to Liquidity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    How quickly can I exit my position?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p><strong>Vault Redemption (Cheapest):</strong> 7-day cooldown, then claim your $LABS back. 0.375% redemption fee.</p>
                  <p><strong>Secondary Market (Fastest):</strong> Sell H1 on DEX immediately at current market price. No cooldown, but subject to market conditions.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 7: $LABS vs H1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    What's the difference between $LABS and H1?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-foreground">$LABS:</strong> Platform governance token. Fixed supply, scarcity-driven appreciation.</p>
                    <p><strong className="text-foreground">H1:</strong> Per-lab fractional ownership. Real yield from dataset revenue + buyback scarcity.</p>
                    <p className="italic">Typical allocation: 30% $LABS (platform hedge) + 70% H1 (yield focus)</p>
                  </div>
                </div>
              </details>
            </motion.div>

            {/* FAQ 8: Getting Started */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    How do I get started?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Connect your wallet (MetaMask, WalletConnect, etc.)</li>
                    <li>Browse available labs by domain (Healthcare, Robotics, etc.)</li>
                    <li>Choose a lab and click "Buy H1"</li>
                    <li>Deposit $LABS, get H1 shares, become part of that lab's economy</li>
                    <li>Sit back and earn passive yield as datasets sell</li>
                  </ol>
                </div>
              </details>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center bg-gradient-card p-12 rounded-2xl border border-primary/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Join the decentralized AI Revolution?</h2>
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
