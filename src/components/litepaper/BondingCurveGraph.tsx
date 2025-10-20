import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from "recharts";
import { Clock, TrendingUp } from "lucide-react";

// Generate bonding curve data
const generateCurveData = () => {
  const data = [];
  for (let i = 0; i <= 20; i++) {
    const labsStaked = i * 50; // $LABS staked in thousands
    const h1Price = Math.sqrt(labsStaked + 100) * 0.5; // Square root bonding curve
    const ownershipPercent = i === 0 ? 100 : Math.max(20, 100 - (i * 3.5)); // Owner's share decreases as others stake
    
    data.push({
      labsStaked,
      h1Price: parseFloat(h1Price.toFixed(2)),
      ownershipPercent: parseFloat(ownershipPercent.toFixed(1)),
      cooldownDays: i * 0.5, // Cooldown period increases with stake size
    });
  }
  return data;
};

const data = generateCurveData();

export default function BondingCurveGraph() {
  return (
    <div className="my-8 space-y-6">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Bonding Curve Mechanics
          </h3>
          <p className="text-sm text-muted-foreground">
            How staking $LABS affects H1 token price and ownership distribution over time
          </p>
        </div>

        {/* Main Bonding Curve Chart */}
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="labsStaked" 
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "$LABS Staked (thousands)", position: "insideBottom", offset: -5, fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "H1 Token Price ($)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))"
              label={{ value: "Owner Ownership (%)", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: any, name: string) => {
                if (name === "h1Price") return [`$${value}`, "H1 Price"];
                if (name === "ownershipPercent") return [`${value}%`, "Owner Ownership"];
                if (name === "cooldownDays") return [`${value} days`, "Cooldown Period"];
                return [value, name];
              }}
            />
            <Legend />
            
            {/* Bonding Curve Line */}
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="h1Price" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              name="H1 Token Price"
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
            />
            
            {/* Ownership Percentage Area */}
            <Area
              yAxisId="right"
              type="monotone"
              dataKey="ownershipPercent"
              fill="hsl(var(--secondary) / 0.3)"
              stroke="hsl(var(--secondary))"
              strokeWidth={2}
              name="Owner Ownership %"
            />
            
            {/* Cooldown Period Line */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cooldownDays"
              stroke="hsl(var(--accent))"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Cooldown Period (days)"
              dot={{ fill: "hsl(var(--accent))", r: 3 }}
            />
            
            {/* Reference lines for key thresholds */}
            <ReferenceLine 
              x={200} 
              yAxisId="left"
              stroke="hsl(var(--primary))" 
              strokeDasharray="3 3"
              label={{ value: "Level 1", position: "top", fill: "hsl(var(--primary))" }}
            />
            <ReferenceLine 
              x={500} 
              yAxisId="left"
              stroke="hsl(var(--secondary))" 
              strokeDasharray="3 3"
              label={{ value: "Level 2", position: "top", fill: "hsl(var(--secondary))" }}
            />
          </ComposedChart>
        </ResponsiveContainer>

        {/* Key Insights */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <Card className="p-4 bg-primary/10 border-primary/30">
            <TrendingUp className="h-5 w-5 text-primary mb-2" />
            <p className="text-sm font-bold mb-1">Bonding Curve</p>
            <p className="text-xs text-muted-foreground">
              H1 price increases as more $LABS is staked, following a square root curve
            </p>
          </Card>

          <Card className="p-4 bg-secondary/10 border-secondary/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-secondary"></div>
              <p className="text-sm font-bold">Ownership Dilution</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Initial owner's % decreases as others buy shares, but H1 token value increases
            </p>
          </Card>

          <Card className="p-4 bg-accent/10 border-accent/30">
            <Clock className="h-5 w-5 text-accent mb-2" />
            <p className="text-sm font-bold mb-1">Cooldown Period</p>
            <p className="text-xs text-muted-foreground">
              Unstaking time increases with stake size to prevent flash attacks
            </p>
          </Card>
        </div>

        {/* Mechanics Explanation */}
        <div className="mt-6 border-t border-border pt-4">
          <Badge className="mb-3 bg-primary">Main Mechanic</Badge>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Initial Stake:</strong> Owner stakes $LABS to create lab → receives 100% H1 tokens at base price
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-secondary mt-2"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Others Buy In:</strong> New stakers purchase H1 tokens at current bonding curve price → owner's % decreases but total value increases
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-2"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Ownership Transfer:</strong> As others stake, they gain H1 tokens → proportional governance and revenue rights
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2"></div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Owner Benefits:</strong> Even with diluted %, owner gains from increased H1 price and dataset revenue share
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
