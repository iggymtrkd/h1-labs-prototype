import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Wallet, Upload, Search, DollarSign } from "lucide-react";

const flows = [
  {
    title: "Lab Founder",
    icon: Wallet,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    steps: [
      "Connect Wallet",
      "createLab(name, symbol, domain)",
      "Auto-deploys LabVault (H1 token)",
      "Deposit $LABS → mint H1 shares",
      "Reach Level thresholds",
      "Unlock app slots",
      "Optional: Deploy BondingCurve",
      "Optional: Deploy LabPass",
    ],
  },
  {
    title: "Contributor / Validator",
    icon: Upload,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    borderColor: "border-secondary/30",
    steps: [
      "Sign up on platform",
      "Credentialing Portal (license/ID)",
      "Whitelisted for domain",
      "Contribute/validate via apps",
      "Onchain provenance tracked",
      "Rewards sent to wallet",
    ],
  },
  {
    title: "AI Buyer / Enterprise",
    icon: Search,
    color: "text-accent",
    bgColor: "bg-accent/10",
    borderColor: "border-accent/30",
    steps: [
      "Discover datasets on platform",
      "Purchase/license via RevenueFacet",
      "ETH routed: 50% Lab, 25% Treasury, 25% Buyback",
      "Receive auditable provenance",
      "Access compliance artifacts",
      "Complete due diligence",
    ],
  },
];

export default function UserFlows() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">User Flows (High-Level)</h3>
          <p className="text-sm text-muted-foreground">
            Three primary user journeys through the H1 Labs platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {flows.map((flow, idx) => {
            const Icon = flow.icon;
            return (
              <Card
                key={idx}
                className={`p-6 ${flow.bgColor} ${flow.borderColor} border-2 hover:scale-105 transition-transform`}
              >
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-full bg-background/50">
                      <Icon className={`h-6 w-6 ${flow.color}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{flow.title}</h4>
                      <Badge variant="outline" className="text-xs mt-1">
                        {flow.steps.length} steps
                      </Badge>
                    </div>
                  </div>

                  {/* Steps */}
                  <div className="space-y-2">
                    {flow.steps.map((step, stepIdx) => (
                      <div key={stepIdx} className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-1">
                          {stepIdx < flow.steps.length - 1 ? (
                            <ArrowRight className={`h-4 w-4 ${flow.color}`} />
                          ) : (
                            <DollarSign className={`h-4 w-4 ${flow.color}`} />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex-1">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            All flows utilize onchain provenance, transparent revenue splits, and programmable compliance
          </p>
        </div>
      </Card>
    </div>
  );
}
