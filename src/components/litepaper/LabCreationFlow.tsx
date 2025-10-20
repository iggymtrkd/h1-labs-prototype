import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function LabCreationFlow() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="space-y-6">
          {/* Stage 1 */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary font-bold">1</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-primary mb-1">Stake $LABS</h4>
              <p className="text-sm text-muted-foreground">Initial capital commitment</p>
            </div>
            <ArrowRight className="text-muted-foreground" />
          </div>

          {/* Stage 2 */}
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <span className="text-secondary font-bold">2</span>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-secondary mb-1">Deploy LabVault</h4>
              <p className="text-sm text-muted-foreground">Auto-deploy H1 token + register domain</p>
            </div>
            <ArrowRight className="text-muted-foreground" />
          </div>

          {/* Stage 3 - TVL Levels */}
          <div className="pl-16 space-y-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-accent" />
              <span className="font-bold text-accent">Growth via Deposits</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-4 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/30">
                <Badge className="mb-2 bg-primary">Level 1</Badge>
                <div className="text-sm">
                  <p className="font-bold">$10K - $50K TVL</p>
                  <p className="text-muted-foreground">1 App Slot</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-secondary/10 to-accent/10 border-secondary/30">
                <Badge className="mb-2 bg-secondary">Level 2</Badge>
                <div className="text-sm">
                  <p className="font-bold">$50K - $250K TVL</p>
                  <p className="text-muted-foreground">2 App Slots</p>
                </div>
              </Card>

              <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/10 border-accent/30">
                <Badge className="mb-2 bg-accent">Level 3</Badge>
                <div className="text-sm">
                  <p className="font-bold">$250K+ TVL</p>
                  <p className="text-muted-foreground">3 App Slots</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Stage 4 - Optional Bootstrap */}
          <div className="border-t border-border pt-4 mt-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-xs">Optional</Badge>
              <div className="flex-1">
                <h4 className="font-bold mb-1">Bonding Curve Bootstrap</h4>
                <p className="text-sm text-muted-foreground">
                  Raise capital at NAV × 1.005 premium • Fees → Treasury • POL → Liquidity
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
