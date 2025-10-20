import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from "recharts";

const timelineData = [
  { month: "Month 0", navPerShare: 5.00, tvl: 5000, supply: 1000 },
  { month: "Month 3", navPerShare: 5.50, tvl: 5500, supply: 1000 },
  { month: "Month 6", navPerShare: 6.25, tvl: 6250, supply: 1000 },
  { month: "Month 9", navPerShare: 7.50, tvl: 7500, supply: 975 },
  { month: "Month 12", navPerShare: 8.88, tvl: 8500, supply: 950 },
];

export default function TokenAppreciationTimeline() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Healthcare Lab H1 Token Appreciation (Year 1)</h3>
      <Card className="p-6 bg-gradient-card border-border">
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={timelineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              yAxisId="left"
              stroke="hsl(var(--muted-foreground))" 
              label={{ value: "NAV per Share ($)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="hsl(var(--muted-foreground))" 
              label={{ value: "TVL ($K)", angle: 90, position: "insideRight", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: any, name: string) => {
                if (name === "NAV per Share") return [`$${value.toFixed(2)}`, name];
                if (name === "TVL") return [`$${value}K`, name];
                if (name === "Supply") return [`${value}K shares`, name];
                return [value, name];
              }}
            />
            <Legend />
            <Area 
              yAxisId="right"
              type="monotone" 
              dataKey="tvl" 
              fill="hsl(var(--secondary))" 
              stroke="hsl(var(--secondary))"
              fillOpacity={0.3}
              name="TVL"
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="navPerShare" 
              stroke="hsl(var(--primary))" 
              strokeWidth={3}
              dot={{ fill: "hsl(var(--primary))", r: 5 }}
              name="NAV per Share"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="supply" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: "hsl(var(--accent))", r: 4 }}
              name="Supply"
            />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-lg border border-border bg-background/50">
            <h4 className="font-bold text-primary mb-2">Initial State</h4>
            <p className="text-sm text-muted-foreground">$5M TVL, 1M shares</p>
            <p className="text-lg font-bold mt-1">$5.00/share</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-background/50">
            <h4 className="font-bold text-secondary mb-2">After Revenue</h4>
            <p className="text-sm text-muted-foreground">$8.5M TVL, buybacks deployed</p>
            <p className="text-lg font-bold mt-1">$8.88/share</p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-background/50">
            <h4 className="font-bold text-accent mb-2">Total Gain</h4>
            <p className="text-sm text-muted-foreground">Supply reduction + NAV increase</p>
            <p className="text-lg font-bold mt-1 text-green-500">+77.6%</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
