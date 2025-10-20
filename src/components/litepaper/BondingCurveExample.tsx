import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, Shield } from "lucide-react";

export default function BondingCurveExample() {
  return (
    <div className="my-8 space-y-4">
      <Card className="p-6 bg-gradient-card border-border">
        <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Robotics Lab Launch Example
        </h4>

        <div className="space-y-6">
          {/* Day 1 */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 bg-primary/10 border-primary/30">
              <Badge className="mb-2 bg-primary">Day 1</Badge>
              <p className="text-sm font-bold mb-2">Lab Created</p>
              <div className="space-y-1 text-xs">
                <p>• $100K initial deposit</p>
                <p>• H1-Robotics NAV: <span className="text-primary font-bold">$1.00/share</span></p>
                <p>• Curve price: <span className="text-accent font-bold">$1.005/share</span></p>
                <p>• <Badge variant="secondary" className="text-xs">Level 1 Unlocked</Badge></p>
              </div>
            </Card>

            <Card className="p-4 bg-secondary/10 border-secondary/30">
              <Badge className="mb-2 bg-secondary">Day 7</Badge>
              <p className="text-sm font-bold mb-2">Capital Raised via Curve</p>
              <div className="space-y-1 text-xs">
                <p>• Total raised: <span className="font-bold">$250K</span></p>
                <p>• Treasury receives: $5K fees + $7.5K POL</p>
                <p>• LabVault receives: $237.5K (at NAV)</p>
                <p>• New TVL: <span className="text-primary font-bold">$337.5K</span></p>
                <p>• New NAV: <span className="text-accent font-bold">$1.125/share</span></p>
                <p>• <Badge variant="secondary" className="text-xs">Level 2 Reached</Badge></p>
              </div>
            </Card>
          </div>

          {/* Safety Features */}
          <Card className="p-4 bg-gradient-to-br from-accent/20 to-primary/20 border-accent">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="h-5 w-5 text-accent" />
              <h5 className="font-bold">Safety Features</h5>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              <div className="space-y-1">
                <p className="font-semibold">Price Bounds</p>
                <p className="text-muted-foreground">Min: 0.001 | Max: 1M</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Flash Loan Protection</p>
                <p className="text-muted-foreground">Max 1-tx change: 50%</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Security Guards</p>
                <p className="text-muted-foreground">Reentrancy + Slippage checks</p>
              </div>
              <div className="space-y-1">
                <p className="font-semibold">Emergency Controls</p>
                <p className="text-muted-foreground">Admin pause mechanism</p>
              </div>
            </div>
          </Card>

          {/* Formula */}
          <Card className="p-4 bg-background/50 border-border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <p className="text-sm font-bold">Bonding Curve Formula</p>
            </div>
            <code className="text-sm text-accent bg-muted px-3 py-2 rounded block">
              price_per_share = vault_NAV × 1.005
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              0.5% premium over Net Asset Value
            </p>
          </Card>
        </div>
      </Card>
    </div>
  );
}
