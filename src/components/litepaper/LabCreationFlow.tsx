import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Wallet, Settings, Zap, TrendingUp, Gift, CheckCircle } from "lucide-react";

export default function LabCreationFlow() {
  const steps = [
    {
      number: 1,
      title: "Creator Preparation",
      icon: Wallet,
      color: "primary",
      items: [
        "Wallet Connected",
        "100K+ LABS Available",
        "Decision: Name, Symbol, Domain",
      ],
    },
    {
      number: 2,
      title: "Create Lab (Step 1)",
      icon: Settings,
      color: "secondary",
      items: [
        "Calls: createLabStep1()",
        "Action: Deploys LabVault (H1 token contract)",
        "Result: Lab ID assigned",
      ],
    },
    {
      number: 3,
      title: "Determine Level",
      icon: TrendingUp,
      color: "accent",
      items: [
        "100K–250K LABS → Level 1 (1 app slot)",
        "250K–500K LABS → Level 2 (2 app slots)",
        "500K+ LABS → Level 3 (3 app slots)",
      ],
    },
    {
      number: 4,
      title: "Deploy Curve & Distribute (Step 2)",
      icon: Zap,
      color: "primary",
      items: [
        "Calls: createLabStep2()",
        "Deploys: Bonding Curve contract",
        "Mints: H1 tokens",
      ],
    },
    {
      number: 5,
      title: "Automatic H1 Allocation (100K example)",
      icon: Gift,
      color: "secondary",
      items: [
        "30% → Lab Owner (vested 6 months, weekly unlocks)",
        "10% → Bonding Curve (liquid, tradeable immediately)",
        "40% → Scholar Reserve (vested)",
        "15% → Dev Reserve (vested)",
        "5% → Protocol Treasury (instant)",
      ],
    },
    {
      number: 6,
      title: "Lab Live",
      icon: CheckCircle,
      color: "accent",
      items: [
        "Creator: Can claim vested H1 from week 1",
        "Community: Can buy H1 on bonding curve",
        "Optional: Deploy LabPass for membership",
        "Ready: For data creation & monetization",
      ],
    },
  ];

  const colorMap: Record<string, string> = {
    primary: "bg-primary/20 text-primary border-primary/30",
    secondary: "bg-secondary/20 text-secondary border-secondary/30",
    accent: "bg-accent/20 text-accent border-accent/30",
  };

  const numberColorMap: Record<string, string> = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-secondary/20 text-secondary",
    accent: "bg-accent/20 text-accent",
  };

  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.number}>
                {/* Step Header */}
                <div className="flex items-start gap-4">
                  <div
                    className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-bold ${numberColorMap[step.color]}`}
                  >
                    {step.number}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Icon className="w-5 h-5" />
                      <h4 className="font-bold text-lg">{step.title}</h4>
                    </div>

                    {/* Step Items */}
                    <div className="space-y-2 ml-2">
                      {step.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary font-bold mt-0.5">├─</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="ml-6 mt-4 mb-2 flex items-center justify-center">
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
