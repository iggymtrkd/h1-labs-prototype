import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Boxes, Gauge, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Upgradeability",
    description: "Add new compliance facets (GDPR, HIPAA, C2PA) without redeploying storage",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Boxes,
    title: "Modularity",
    description: "Clean separation of concerns; each facet handles one domain",
    color: "text-secondary",
    bgColor: "bg-secondary/10",
  },
  {
    icon: Gauge,
    title: "Gas Efficiency",
    description: "Shared storage; single proxy overhead scales to thousands of labs",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: ShieldCheck,
    title: "Security",
    description: "Approved initializer whitelist prevents malicious upgrades",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

export default function DiamondStandardDesign() {
  return (
    <div className="my-8 space-y-6">
      <Card className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 border-primary">
        <div className="text-center mb-6">
          <Badge className="mb-3 bg-primary text-primary-foreground">EIP-2535</Badge>
          <h3 className="text-xl font-bold mb-2">Why Diamond Pattern?</h3>
          <p className="text-sm text-muted-foreground">
            A single proxy routes to modular facets while maintaining unified storage
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon;
            return (
              <Card
                key={idx}
                className={`p-6 ${benefit.bgColor} border-border hover:border-primary/50 transition-all`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 rounded-full bg-background/50">
                    <Icon className={`h-6 w-6 ${benefit.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold mb-2">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Card>

      {/* Technical details */}
      <Card className="p-6 bg-gradient-card border-border">
        <div className="space-y-4">
          <div>
            <Badge variant="outline" className="mb-2">Technical Implementation</Badge>
            <div className="grid md:grid-cols-2 gap-4 mt-3">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-primary">Singleton Token</p>
                <p className="text-xs text-muted-foreground">
                  LABSToken (ERC-20): governance, staking, platform utility
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-semibold text-secondary">Per-Lab Contracts</p>
                <p className="text-xs text-muted-foreground">
                  LabVault (ERC-20 shares, ERC-4626-style) = H1 token for that lab
                </p>
              </div>
            </div>
          </div>

          <div>
            <Badge variant="outline" className="mb-2">Key Storage</Badge>
            <div className="bg-background/50 p-4 rounded-lg mt-3">
              <code className="text-xs text-muted-foreground block space-y-1">
                <div>• labs, nextLabId, labsToken</div>
                <div>• cooldown/exit caps, protocolTreasury</div>
                <div>• curve params, reentrancyStatus</div>
                <div>• labIdToVault, labIdToLabPass, labIdToCurve</div>
              </code>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
