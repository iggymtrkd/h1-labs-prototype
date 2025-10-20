import { Card } from "@/components/ui/card";
import { ArrowRight, TrendingUp, DollarSign, Users, Zap } from "lucide-react";

const steps = [
  {
    icon: Users,
    title: "Labs Created",
    description: "Capital Staked",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    icon: Users,
    title: "Validators",
    description: "Enrich/Validate Datasets",
    color: "text-secondary",
    bgColor: "bg-secondary/20",
  },
  {
    icon: DollarSign,
    title: "AI Companies",
    description: "Purchase Verified Data",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: TrendingUp,
    title: "Revenue Split",
    description: "50% Lab / 25% Treasury / 25% Buyback",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    icon: Zap,
    title: "Buyback Execution",
    description: "H1 Supply Decreases",
    color: "text-secondary",
    bgColor: "bg-secondary/20",
  },
  {
    icon: TrendingUp,
    title: "H1 Price ↑",
    description: "Lower Supply + Increasing NAV",
    color: "text-accent",
    bgColor: "bg-accent/20",
  },
  {
    icon: Users,
    title: "New Labs Incentivized",
    description: "Higher Token Value → Cycle Repeats",
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
];

export default function EconomicFlywheel() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2">Closed-Loop Economic Model</h3>
          <p className="text-sm text-muted-foreground">
            Self-reinforcing value cycle driven by real dataset sales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="relative">
                <Card className={`p-4 ${step.bgColor} border-border h-full`}>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={`p-3 rounded-full bg-background/50`}>
                      <Icon className={`h-6 w-6 ${step.color}`} />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{step.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </Card>
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-2 transform -translate-y-1/2 z-10">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Closing Arrow */}
        <div className="flex justify-center mt-6">
          <div className="flex items-center gap-2 text-primary">
            <ArrowRight className="h-5 w-5" />
            <span className="text-sm font-semibold">Cycle Repeats at Larger Scale</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
