import { motion } from "framer-motion";

export default function Terms() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 glow-green">
            Terms & Conditions
          </h1>
          
          <div className="space-y-8 text-muted-foreground">
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Important Notice</h2>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-6 mb-4">
                <p className="leading-relaxed">
                  By proceeding, you acknowledge that <strong className="text-foreground">H1 Labs is in prototype stage and operating on testnet</strong>. 
                </p>
              </div>
              <p className="leading-relaxed">
                This prototype is designed to explain our vision in practical terms and may or may not represent 
                the final product. All transactions are using testnet tokens with no real monetary value.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Testnet Environment</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>All transactions occur on Base Sepolia testnet with no real monetary value</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Features and functionality are subject to change during development</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>No real funds are at risk during testnet operations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Platform may experience downtime or data resets without notice</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Use of Platform</h2>
              <p className="leading-relaxed mb-4">
                H1 Labs provides a platform for collaborative data creation and AI training. By using this platform, you agree to:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Use the platform in accordance with all applicable laws and regulations</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Not submit any data that infringes on intellectual property rights or privacy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Maintain the security of your wallet and credentials</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Accept responsibility for all activities under your account</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Disclaimers</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Not Financial Advice:</strong> Nothing on this platform constitutes financial, investment, or trading advice</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Not Medical Advice:</strong> Healthcare data and use cases are for demonstration purposes only</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">No Guarantees:</strong> We make no guarantees about platform availability, accuracy, or future token value</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span><strong className="text-foreground">Beta Software:</strong> The platform is provided "as is" with all faults and defects</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Data & Privacy</h2>
              <p className="leading-relaxed mb-4">
                While operating on testnet, we collect minimal data necessary for platform operation:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Wallet addresses for authentication and transactions</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Lab and contribution data stored on blockchain</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary mt-1">•</span>
                  <span>Usage analytics to improve platform functionality</span>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Limitation of Liability</h2>
              <p className="leading-relaxed">
                To the fullest extent permitted by law, H1 Labs and its affiliates shall not be liable for any 
                indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, 
                whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses 
                resulting from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Changes to Terms</h2>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. Continued use of the platform after changes 
                constitutes acceptance of the modified terms. Major changes will be communicated through the platform.
              </p>
            </section>

            <section className="pt-8 border-t border-border">
              <p className="text-sm text-center">
                Last updated: January 2025<br/>
                For questions, contact us through our official channels
              </p>
            </section>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
