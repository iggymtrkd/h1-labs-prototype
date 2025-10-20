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

            {/* FAQ 2: How do I get started? */}
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

            {/* FAQ 3: How do I launch a lab? */}
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
                    How do I launch a lab?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p>Creating a lab is simple:</p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>Call <span className="font-mono text-sm bg-muted p-1 rounded">createLab(name, symbol, domain)</span> with your lab details (e.g., "MedAtlas Cardio", "H1CARD", "Healthcare/Cardiology")</li>
                    <li>The system automatically deploys a LabVault with its own H1 token</li>
                    <li>Deposit $LABS into your lab's vault to mint H1 shares</li>
                    <li>You become the initial owner with 100% ownership (until others deposit)</li>
                    <li>Optionally deploy a LabPass NFT for identity and a Bonding Curve for bootstrap fundraising</li>
                    <li>As your total staked $LABS grows, you unlock app slots: L1 ($100K TVL) = 1 slot, L2 ($250K TVL) = 2 slots, L3 ($500K TVL) = 3 slots</li>
                  </ol>
                </div>
              </details>
            </motion.div>

            {/* FAQ 4: How do I get $LABS? */}
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
                    How do I get $LABS?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">Multiple ways to acquire $LABS:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Purchase on a DEX (Uniswap, 1inch, etc.) with ETH or other tokens</li>
                    <li>Mint via LP incentive programs (when available)</li>
                    <li>Receive from ecosystem grants (top validators, early adopters, ecosystem incentives)</li>
                    <li>On testnet: Request from the testnet faucet or receive from admin transfers</li>
                  </ul>
                  <p className="mt-3"><strong className="text-foreground">Remember:</strong> $LABS has a fixed supply—no inflation. As adoption grows, scarcity increases.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 5: $LABS vs H1 */}
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

            {/* FAQ 6: Bonding Curve */}
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
                    What is the bonding curve after staking $LABS to create a lab?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p>A bonding curve is an optional bootstrap mechanism to accelerate your lab's capital raise:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-foreground">How it works:</strong> Users buy H1 shares at NAV × 1.005 (0.5% premium)</li>
                    <li><strong className="text-foreground">Fee allocation:</strong>
                      <ul className="list-circle pl-5 mt-1">
                        <li>1-2% goes to protocol treasury</li>
                        <li>5-10% reserved for Protocol-Owned Liquidity (POL) to create DEX pairs</li>
                        <li>80-90% enters your lab's vault and mints H1 at NAV</li>
                      </ul>
                    </li>
                    <li><strong className="text-foreground">Benefit:</strong> As more capital flows in, the curve price naturally increases, incentivizing early participation</li>
                    <li><strong className="text-foreground">Why use it:</strong> Helps your lab bootstrap faster and establish initial liquidity on secondary markets</li>
                  </ul>
                </div>
              </details>
            </motion.div>

            {/* FAQ 7: Initial Ownership */}
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
                    What is my initial % of ownership of a lab (H1 tokens) if I create a lab?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">You start with 100% ownership.</strong></p>
                  <p>When you create a lab and make the initial deposit:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Your deposit is converted to H1 shares at 1:1 NAV (initial exchange rate = 1 LABS/share)</li>
                    <li>You own 100% of H1 shares if you're the only depositor</li>
                    <li>As others deposit $LABS, your ownership percentage dilutes (but your H1 value remains the same)</li>
                  </ul>
                  <p className="mt-3"><strong className="text-foreground">Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>You deposit $100K → get 100K H1 shares (100% ownership)</li>
                    <li>New staker deposits $50K → gets 50K H1 shares</li>
                    <li>Your ownership: 100K / 150K = 66.7%</li>
                    <li>Your H1 value: Still backed by ~$100K (no dilution of backing)</li>
                  </ul>
                </div>
              </details>
            </motion.div>

            {/* FAQ 8: How would one earn? */}
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
                    How would one earn in the H1 platform?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-3">
                  <p><strong className="text-foreground">Earn passively just by holding H1 tokens. When labs sell datasets:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-foreground">50%</strong> of revenue increases NAV (your H1 shares back more assets)</li>
                    <li><strong className="text-foreground">25%</strong> goes to buybacks (protocol buys & burns H1, reducing supply)</li>
                    <li><strong className="text-foreground">Result:</strong> Your holdings become scarcer + backed by more assets</li>
                  </ul>
                  <p className="text-sm italic">Example: $1M dataset sale → your 1% share gains $5K (NAV) + ~$2.5K (buyback scarcity)</p>
                  <p className="mt-3"><strong className="text-foreground">No action required:</strong> Dataset sales, buybacks, and NAV appreciation happen automatically.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 9: Speculation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
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

            {/* FAQ 10: Time to Liquidity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 }}
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

            {/* FAQ 11: What are H1 tokens backed by? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    What are H1 tokens backed by?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-2">
                  <p><strong className="text-foreground">H1 tokens are backed by two things:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><strong className="text-foreground">Staked $LABS:</strong> Every H1 share is backed by real $LABS deposited in the lab's vault (on-chain reserves)</li>
                    <li><strong className="text-foreground">Potential dataset sales:</strong> H1 holders earn from validated datasets sold to AI companies, which flows into the vault</li>
                  </ul>
                  <p className="mt-3">Your H1 can never go below NAV (Net Asset Value) because it's backed by these vault assets. Unlike speculative tokens, H1 has a hard floor.</p>
                </div>
              </details>
            </motion.div>

            {/* FAQ 12: How does buybacks work? */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="p-6 bg-card rounded-xl border border-border hover:border-primary/50 transition-all"
            >
              <details className="cursor-pointer group">
                <summary className="font-bold text-lg flex items-center justify-between">
                  <span className="flex items-center">
                    <span className="text-primary mr-3 font-bold">Q:</span>
                    How does the H1 buybacks system work?
                  </span>
                  <ChevronRight className="w-5 h-5 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-4 pl-8 text-muted-foreground space-y-3">
                  <p><strong className="text-foreground">Buybacks create scarcity gains for all H1 holders:</strong></p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li><strong>Revenue Split:</strong> When a lab sells datasets, 25% of revenue goes to the buyback reserve</li>
                    <li><strong>Execution:</strong> The protocol uses buyback funds to repurchase H1 shares at market price</li>
                    <li><strong>Burning:</strong> Repurchased H1 shares are permanently burned, reducing total supply</li>
                    <li><strong>Scarcity Gain:</strong> With fewer shares outstanding but same vault assets, each remaining share becomes more valuable</li>
                  </ol>
                  <p className="mt-3"><strong className="text-foreground">Example:</strong></p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Vault assets: $320K with 270K H1 shares = $1.185/share NAV</li>
                    <li>Buyback: $25K reserve buys ~23.81K H1 shares (at $1.05 market price) and burns them</li>
                    <li>New supply: 270K - 23.81K = 246.19K shares</li>
                    <li>New NAV: $320K / 246.19K = $1.299/share (+9.6% scarcity gain)</li>
                    <li><strong>Your benefit:</strong> Your existing H1 shares are now worth more without any action from you</li>
                  </ul>
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
