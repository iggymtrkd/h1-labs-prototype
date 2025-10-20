import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const useCaseData = [
  {
    useCase: "Healthcare Lab",
    initialStake: 50,
    revenueYear1: 5000,
    tvlGrowth: 8500,
    h1Appreciation: 788,
    validatorEarnings: 888,
  },
  {
    useCase: "Robotics Consortium",
    initialStake: 100,
    revenueYear1: 500,
    tvlGrowth: 850,
    h1Appreciation: 400,
    validatorEarnings: 250,
  },
  {
    useCase: "Creative Studio",
    initialStake: 25,
    revenueYear1: 300,
    tvlGrowth: 425,
    h1Appreciation: 350,
    validatorEarnings: 125,
  },
];

export default function UseCaseROIComparison() {
  return (
    <div className="space-y-4 my-8">
      <h3 className="text-xl font-bold text-primary mb-6">Use Case Performance Comparison</h3>
      <Card className="p-6 bg-gradient-card border-border">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={useCaseData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="useCase" stroke="hsl(var(--muted-foreground))" />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              label={{ value: "Value ($K)", angle: -90, position: "insideLeft", fill: "hsl(var(--muted-foreground))" }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: "hsl(var(--background))", 
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px"
              }}
              formatter={(value: any, name: string) => {
                if (name === "H1 Appreciation (%)") return [`${value}%`, name];
                return [`$${value}K`, name];
              }}
            />
            <Legend />
            <Bar dataKey="initialStake" fill="hsl(var(--muted))" name="Initial Stake" />
            <Bar dataKey="revenueYear1" fill="hsl(var(--primary))" name="Year 1 Revenue" />
            <Bar dataKey="tvlGrowth" fill="hsl(var(--secondary))" name="TVL Growth" />
          </BarChart>
        </ResponsiveContainer>

        <div className="mt-6 space-y-4">
          {useCaseData.map((useCase) => (
            <div key={useCase.useCase} className="p-4 rounded-lg border border-border bg-background/50">
              <h4 className="font-bold mb-2">{useCase.useCase}</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Initial</p>
                  <p className="font-medium">${useCase.initialStake}K</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year 1 Revenue</p>
                  <p className="font-medium">${useCase.revenueYear1}K</p>
                </div>
                <div>
                  <p className="text-muted-foreground">H1 Appreciation</p>
                  <p className="font-medium text-green-500">+{useCase.h1Appreciation}%</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Validator Avg</p>
                  <p className="font-medium">${useCase.validatorEarnings}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
