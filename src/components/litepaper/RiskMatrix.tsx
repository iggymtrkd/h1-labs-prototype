import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Shield, TrendingUp, Users } from "lucide-react";

const risks = [
  {
    category: "Regulatory",
    icon: AlertTriangle,
    level: "medium",
    description: "Evolving data privacy and AI regulations",
    mitigations: [
      "Programmable compliance facets",
      "Credential gating system",
      "Comprehensive audit logs",
      "Domain-specific enforcement"
    ],
  },
  {
    category: "Liquidity",
    icon: TrendingUp,
    level: "medium",
    description: "Token liquidity and market depth",
    mitigations: [
      "POL/treasury custody",
      "Buyback budget design",
      "Exit caps and cooldowns",
      "Bonding curve mechanics"
    ],
  },
  {
    category: "Security",
    icon: Shield,
    level: "high",
    description: "Smart contract vulnerabilities",
    mitigations: [
      "Diamond standard controls",
      "Reentrancy guards",
      "Progressive audits",
      "Emergency pause mechanisms"
    ],
  },
  {
    category: "Adoption",
    icon: Users,
    level: "medium",
    description: "Network effects and user growth",
    mitigations: [
      "Validator network effects",
      "Partnership incentives",
      "Credentialing portal",
      "SDK ease of integration"
    ],
  },
];

export default function RiskMatrix() {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "high":
        return "bg-red-500/10 border-red-500/20 text-red-500";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-500";
      default:
        return "bg-green-500/10 border-green-500/20 text-green-500";
    }
  };

  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Risk Assessment & Mitigation Strategies</h3>
      <Card className="p-6 bg-gradient-card border-border">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risks.map((risk) => {
            const Icon = risk.icon;
            return (
              <div 
                key={risk.category}
                className="p-4 rounded-lg border border-border bg-background/50"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-primary" />
                    <h4 className="font-bold">{risk.category}</h4>
                  </div>
                  <Badge className={getLevelColor(risk.level)}>
                    {risk.level}
                  </Badge>
                </div>

                <p className="text-sm text-muted-foreground mb-3">
                  {risk.description}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground uppercase">
                    Mitigations
                  </p>
                  {risk.mitigations.map((mitigation, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-2 text-sm"
                    >
                      <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                      <p>{mitigation}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg border border-border bg-background/50">
          <p className="text-sm text-muted-foreground">
            <strong>Risk Management Approach:</strong> H1 Labs employs a multi-layered risk mitigation strategy 
            combining technical controls, programmatic compliance, and progressive decentralization. All identified 
            risks are continuously monitored and addressed through protocol upgrades and governance mechanisms.
          </p>
        </div>
      </Card>
    </div>
  );
}
