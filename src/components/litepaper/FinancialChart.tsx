import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  {
    year: "Year 1",
    tvl: 5,
    revenue: 2,
    buyback: 0.5,
    validators: 1,
    treasury: 0.5,
  },
  {
    year: "Year 2",
    tvl: 50,
    revenue: 20,
    buyback: 5,
    validators: 10,
    treasury: 5,
  },
  {
    year: "Year 3",
    tvl: 250,
    revenue: 100,
    buyback: 25,
    validators: 50,
    treasury: 25,
  },
];

export default function FinancialChart() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Financial Model Projection (Y1-Y3)</h3>
      <Card className="p-6 bg-gradient-card border-border">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" />
            <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: "Millions ($)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: any) => `$${value}M`}
            />
            <Legend />
            <Bar dataKey="tvl" fill="hsl(var(--primary))" name="Total TVL" />
            <Bar dataKey="revenue" fill="hsl(var(--secondary))" name="Dataset Revenue" />
            <Bar dataKey="buyback" fill="hsl(var(--accent))" name="Buyback Budget" />
            <Bar dataKey="validators" fill="hsl(142 76% 36%)" name="Validator Payouts" />
            <Bar dataKey="treasury" fill="hsl(262 83% 58%)" name="Treasury" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
