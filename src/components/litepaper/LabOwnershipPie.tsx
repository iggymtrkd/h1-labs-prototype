import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";

const initialOwnershipData = [
  { name: "Founder Initial Stake", value: 60, color: "hsl(var(--primary))" },
  { name: "Available for Public Staking", value: 30, color: "hsl(var(--secondary))" },
  { name: "Protocol Liquidity Reserve", value: 7, color: "hsl(var(--accent))" },
  { name: "Protocol Treasury Fee", value: 3, color: "hsl(142, 76%, 36%)" },
];

export default function LabOwnershipPie() {
  return (
    <div className="my-8">
      <Card className="p-6 bg-gradient-card border-border">
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-primary" />
            Initial Lab Ownership Distribution
          </h3>
          <p className="text-sm text-muted-foreground">
            How ownership is allocated when a lab is first created
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={initialOwnershipData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {initialOwnershipData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                  formatter={(value: any) => `${value}%`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown */}
          <div className="space-y-4">
            <div>
              <Badge className="mb-3 bg-primary">At Launch</Badge>
              <p className="text-xs text-muted-foreground mb-4">
                Example: $100K initial lab creation
              </p>
            </div>

            {initialOwnershipData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm font-semibold">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold">{item.value}%</span>
                </div>
                <p className="text-xs text-muted-foreground pl-5">
                  {item.name === "Founder Initial Stake" && "$60K → Founder receives H1 tokens, controls lab"}
                  {item.name === "Available for Public Staking" && "$30K → Available for others to buy H1 shares"}
                  {item.name === "Protocol Liquidity Reserve" && "$7K → POL for market stability and liquidity"}
                  {item.name === "Protocol Treasury Fee" && "$3K → Platform development and operations"}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Context */}
        <div className="mt-6 pt-4 border-t border-border">
          <div className="grid md:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="font-semibold mb-2 text-primary">Founder Advantages</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Largest initial H1 token allocation</li>
                <li>• First-mover benefit on bonding curve</li>
                <li>• Controls lab governance initially</li>
                <li>• Receives 50% of all dataset revenue</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2 text-secondary">Public Staker Benefits</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Can buy H1 tokens at fair bonding curve price</li>
                <li>• Proportional governance rights</li>
                <li>• Share in dataset revenue via H1 appreciation</li>
                <li>• Benefit from buyback mechanisms</li>
              </ul>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
