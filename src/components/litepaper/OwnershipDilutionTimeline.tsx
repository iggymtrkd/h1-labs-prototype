import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Zap, DollarSign } from "lucide-react";

export default function OwnershipDilutionTimeline() {
  const timelinePoints = [
    {
      time: "T0: Lab Creation",
      icon: Zap,
      color: "primary",
      metrics: [
        { label: "Creator deposits", value: "$100K" },
        { label: "Creator's H1", value: "100K shares (100%)" },
        { label: "Lab assets", value: "$100K" },
        { label: "NAV per share", value: "$1.00" },
        { label: "Creator's value", value: "$100K" },
      ],
      highlight: "Starting position",
    },
    {
      time: "T1: After Bonding Curve ($200K raise)",
      icon: Users,
      color: "secondary",
      metrics: [
        { label: "New investors deposit", value: "$200K via bonding curve" },
        { label: "Fee + POL allocated", value: "$30K" },
        { label: "New vault assets", value: "$270K" },
        { label: "Total H1 supply", value: "~270K shares" },
        { label: "Creator's ownership", value: "37% of lab" },
        { label: "New NAV per share", value: "$1.00" },
        { label: "Creator's value", value: "$100K (ownership ↓, value →)" },
      ],
      highlight: "Ownership diluted 37%, but value maintained",
    },
    {
      time: "T2: After $100K Dataset Revenue",
      icon: DollarSign,
      color: "accent",
      metrics: [
        { label: "Dataset sale", value: "$100K" },
        { label: "Lab owner/Scholars", value: "$50K (→ vault)" },
        { label: "Treasury", value: "$25K" },
        { label: "Buyback reserve", value: "$25K" },
        { label: "New vault assets", value: "$320K" },
        { label: "New NAV per share", value: "$1.185" },
        { label: "Creator's value", value: "$118.5K (+18.5% ↑)" },
      ],
      highlight: "Value appreciates as revenue flows in",
    },
    {
      time: "T3: After Buyback Execution",
      icon: TrendingUp,
      color: "primary",
      metrics: [
        { label: "Buyback reserves used", value: "$25K" },
        { label: "H1 supply reduced", value: "270K → ~260K shares" },
        { label: "Vault assets", value: "$320K" },
        { label: "Final NAV per share", value: "$1.231" },
        { label: "Creator's value", value: "$123.1K (+23.1% total ↑)" },
      ],
      highlight: "Buyback amplifies remaining shareholders' value",
    },
  ];

  const colorMap: Record<string, string> = {
    primary: "border-primary/30 bg-primary/5",
    secondary: "border-secondary/30 bg-secondary/5",
    accent: "border-accent/30 bg-accent/5",
  };

  const iconColorMap: Record<string, string> = {
    primary: "text-primary",
    secondary: "text-secondary",
    accent: "text-accent",
  };

  return (
    <div className="my-8">
      <div className="space-y-4">
        {timelinePoints.map((point, index) => {
          const Icon = point.icon;
          const isLast = index === timelinePoints.length - 1;

          return (
            <div key={point.time} className="relative">
              {/* Vertical Connector */}
              {!isLast && (
                <div className="absolute left-6 top-16 w-0.5 h-8 bg-gradient-to-b from-primary/40 to-transparent"></div>
              )}

              {/* Timeline Card */}
              <Card className={`p-4 border-l-4 ${colorMap[point.color]} transition-all hover:shadow-md`}>
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-opacity-20 ${colorMap[point.color]}`}>
                    <Icon className={`w-6 h-6 ${iconColorMap[point.color]}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm md:text-base">{point.time}</h4>
                    <p className="text-xs text-accent font-medium">{point.highlight}</p>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-0">
                  {point.metrics.map((metric, metricIndex) => (
                    <div
                      key={metricIndex}
                      className="text-xs md:text-sm p-2 rounded bg-background/50 border border-border/50"
                    >
                      <div className="text-muted-foreground font-medium">{metric.label}</div>
                      <div className="font-bold text-foreground mt-1">{metric.value}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Legend/Summary */}
      <Card className="p-4 mt-6 bg-accent/10 border-accent/30">
        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Key Insights
        </h4>
        <ul className="text-xs md:text-sm text-muted-foreground space-y-1">
          <li>• <strong>T0→T1:</strong> Creator's ownership dilutes from 100% to 37%, but value stays $100K (NAV maintained)</li>
          <li>• <strong>T1→T2:</strong> Revenue generates $50K inflow, NAV rises to $1.185, creator value +18.5%</li>
          <li>• <strong>T2→T3:</strong> Buyback reduces supply by ~10K shares, NAV rises to $1.231, total +23.1% appreciation</li>
        </ul>
      </Card>
    </div>
  );
}
