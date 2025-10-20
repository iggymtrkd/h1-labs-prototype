import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Users, PieChart } from "lucide-react";

export default function H1TokenEconomies() {
  return (
    <div className="my-8 space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">What is H1?</h3>
          <p className="text-sm text-muted-foreground">
            H1 is <strong>not a single token</strong>. Each lab deploys its own H1 token (LabVault shares) representing:
          </p>
          <div className="grid md:grid-cols-3 gap-3 mt-4">
            <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10">
              <PieChart className="h-5 w-5 text-primary mb-2" />
              <p className="text-sm font-semibold">Fractional Ownership</p>
              <p className="text-xs text-muted-foreground mt-1">
                Of that lab&apos;s treasury
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-secondary/10 to-accent/10">
              <DollarSign className="h-5 w-5 text-secondary mb-2" />
              <p className="text-sm font-semibold">Revenue Claim</p>
              <p className="text-xs text-muted-foreground mt-1">
                On future dataset sales
              </p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10">
              <Users className="h-5 w-5 text-accent mb-2" />
              <p className="text-sm font-semibold">Ecosystem Participation</p>
              <p className="text-xs text-muted-foreground mt-1">
                In that domain&apos;s economy
              </p>
            </Card>
          </div>
        </div>

        {/* Example scenario */}
        <Card className="p-6 bg-gradient-to-br from-primary/20 to-accent/20 border-primary">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="h-6 w-6 text-primary" />
            <div>
              <h4 className="font-bold text-lg">Healthcare Lab — Year 1 Example</h4>
              <Badge className="mt-1 bg-primary">Real Revenue Model</Badge>
            </div>
          </div>

          <div className="space-y-4">
            {/* Initial State */}
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2 text-primary">Initial State</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">TVL</p>
                  <p className="font-bold">$5M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">H1 Shares</p>
                  <p className="font-bold">1M shares</p>
                </div>
                <div>
                  <p className="text-muted-foreground">NAV</p>
                  <p className="font-bold text-primary">$5.00/share</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Datasets</p>
                  <p className="font-bold">0 sold</p>
                </div>
              </div>
            </div>

            {/* Revenue Flow */}
            <div className="bg-background/50 p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2 text-secondary">After Year 1</p>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Dataset revenue (50 datasets sold)</span>
                  <span className="font-bold">$5M annually</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Buyback budget deployed (25%)</span>
                  <span className="font-bold text-accent">$1.25M</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Lab revenue retained (50%)</span>
                  <span className="font-bold text-primary">$2.5M</span>
                </div>
              </div>
            </div>

            {/* Final State */}
            <div className="bg-gradient-to-r from-primary/20 to-secondary/20 p-4 rounded-lg border-2 border-primary/50">
              <p className="text-sm font-semibold mb-2 text-primary">Result</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground">New TVL</p>
                  <p className="font-bold text-primary">~$8.5M</p>
                </div>
                <div>
                  <p className="text-muted-foreground">New NAV</p>
                  <p className="font-bold text-primary">$8.50/share</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">+70%</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">After buybacks (-5% supply)</p>
                  <p className="font-bold text-accent">$8.88/share</p>
                  <Badge variant="secondary" className="text-[10px] mt-1">+77.6%</Badge>
                </div>
                <div>
                  <p className="text-muted-foreground">Datasets sold</p>
                  <p className="font-bold">50 total</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="border-t border-border pt-4">
              <p className="text-sm font-semibold mb-3">Early H1 Holders Gain From:</p>
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5"></div>
                  <div>
                    <p className="font-semibold">Increasing NAV</p>
                    <p className="text-muted-foreground">More datasets sold</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary mt-1.5"></div>
                  <div>
                    <p className="font-semibold">Supply Reduction</p>
                    <p className="text-muted-foreground">Through buybacks</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-1.5"></div>
                  <div>
                    <p className="font-semibold">Sustainable Economy</p>
                    <p className="text-muted-foreground">Real revenue, not inflation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Card>

      {/* Comparison */}
      <Card className="p-6 bg-gradient-card border-border">
        <h4 className="font-bold mb-4">Why H1 ≠ Traditional Stake-Reward Models</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 px-3">Mechanic</th>
                <th className="text-left py-2 px-3 text-primary">H1 Labs</th>
                <th className="text-left py-2 px-3 text-muted-foreground">Competitors</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-border/50">
                <td className="py-3 px-3 font-semibold">Value Source</td>
                <td className="py-3 px-3 text-primary">Real dataset sales</td>
                <td className="py-3 px-3 text-muted-foreground">Inflationary rewards</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-3 font-semibold">Supply</td>
                <td className="py-3 px-3 text-primary">Decreases (buybacks)</td>
                <td className="py-3 px-3 text-muted-foreground">Increases (new issuance)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-3 font-semibold">Price Pressure</td>
                <td className="py-3 px-3 text-primary">Buy pressure from revenue</td>
                <td className="py-3 px-3 text-muted-foreground">Sell pressure from inflation</td>
              </tr>
              <tr>
                <td className="py-3 px-3 font-semibold">Sustainability</td>
                <td className="py-3 px-3 text-primary">Revenue-driven (durable)</td>
                <td className="py-3 px-3 text-muted-foreground">Reward-dependent (temporary)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
