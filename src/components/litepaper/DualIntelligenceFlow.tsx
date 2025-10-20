import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Bot, User, Building, ShoppingCart } from "lucide-react";

export default function DualIntelligenceFlow() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Dual-Intelligence Dataflow</h3>
          <p className="text-sm text-muted-foreground">
            Agent + Human collaboration → Δ-Gain → Bundles → Buybacks
          </p>
        </div>

        <div className="space-y-4 max-w-2xl mx-auto">
          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="h-6 w-6 text-primary" />
            </div>
            <Card className="flex-1 p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <p className="font-bold mb-1">1. Agent Execution</p>
              <p className="text-sm text-muted-foreground">
                App selects base model via SDK → AI agent executes task
              </p>
            </Card>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
              <User className="h-6 w-6 text-secondary" />
            </div>
            <Card className="flex-1 p-4 bg-gradient-to-r from-secondary/10 to-accent/10">
              <p className="font-bold mb-1">2. Human Review & Sign</p>
              <p className="text-sm text-muted-foreground">
                Credentialed human reviews output and cryptographically signs approval
              </p>
              <Badge className="mt-2 bg-secondary">Dual-Intelligence Collaboration</Badge>
            </Card>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
              <Building className="h-6 w-6 text-accent" />
            </div>
            <Card className="flex-1 p-4 bg-gradient-to-r from-accent/10 to-primary/10">
              <p className="font-bold mb-1">3. Compute Δ-Gain & Record Provenance</p>
              <p className="text-sm text-muted-foreground">
                SDK measures supervised improvement vs base model → Records attribution onchain
              </p>
            </Card>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 4 */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
            <Card className="flex-1 p-4 bg-gradient-to-r from-primary/10 to-secondary/10">
              <p className="font-bold mb-1">4. Bundle & Monetize</p>
              <p className="text-sm text-muted-foreground">
                H1 aggregates Δ-Gain into dataset bundles → AI companies purchase/license
              </p>
            </Card>
          </div>

          <div className="flex justify-center">
            <ArrowDown className="h-6 w-6 text-muted-foreground" />
          </div>

          {/* Step 5 */}
          <Card className="p-6 bg-gradient-to-br from-accent/20 to-primary/20 border-accent">
            <p className="font-bold mb-2 text-center">5. Revenue Distribution & Buybacks</p>
            <div className="grid grid-cols-3 gap-3 text-center text-sm">
              <div>
                <p className="font-semibold text-primary">50%</p>
                <p className="text-xs text-muted-foreground">Lab Owner</p>
              </div>
              <div>
                <p className="font-semibold text-secondary">25%</p>
                <p className="text-xs text-muted-foreground">Treasury</p>
              </div>
              <div>
                <p className="font-semibold text-accent">25%</p>
                <p className="text-xs text-muted-foreground">Buyback</p>
              </div>
            </div>
            <Badge className="mt-4 w-full justify-center bg-primary">
              Transparent Economics
            </Badge>
          </Card>
        </div>
      </Card>
    </div>
  );
}
